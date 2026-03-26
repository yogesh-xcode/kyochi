"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { 
  CalendarDays, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Layers, 
  MapPin, 
  Play, 
  Printer, 
  User, 
  UserCheck, 
  XCircle 
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBootstrapData } from "@/lib/data/useBootstrapData";
import { buildAppointmentsKpis } from "@/lib/metrics";
import { resolveUserContext, scopeAppointmentsByRole } from "@/lib/roleScope";
import { supabase } from "@/lib/supabase/client";
import type { AppointmentRow } from "@/lib/supabase/types";

type FlashState = {
  tone: "success" | "error";
  message: string;
};

const toStatus = (status: string) => {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In Progress";
  if (status === "scheduled") return "Scheduled";
  if (status === "declined") return "Declined";
  if (status === "cancelled") return "Cancelled";
  return "Waiting";
};

const toLongDateLabel = (value: string | null | undefined) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const toTimeLabel = (isoDate: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoDate));

const toIsoFromDateAndTime = (dateText: string, timeText: string) => {
  const normalizedDate = dateText.trim();
  const normalizedTime = timeText.trim();
  const ampm = normalizedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    const rawHour = Number(ampm[1]);
    const mins = ampm[2];
    const meridiem = ampm[3].toUpperCase();
    const hour24 = (rawHour % 12) + (meridiem === "PM" ? 12 : 0);
    return new Date(`${normalizedDate}T${String(hour24).padStart(2, "0")}:${mins}:00`).toISOString();
  }
  return new Date(`${normalizedDate}T${normalizedTime || "00:00"}:00`).toISOString();
};

export default function AppointmentsPage() {
  const { data, reload, isLoading: isBootstrapLoading } = useBootstrapData();
  const searchParams = useSearchParams();
  const openAddOnMount = searchParams.get("new") === "true";
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [flash, setFlash] = useState<FlashState | null>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileAppointment, setProfileAppointment] = useState<AppointmentRow | null>(null);

  const context = useMemo(() => resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  }), [data.users, data.current_user]);

  const role = context.role;
  const scopedAppointments = useMemo(() => 
    scopeAppointmentsByRole(
      data.appointments, 
      context.role, 
      context.therapistId, 
      context.patientId, 
      context.franchiseId
    ), [data.appointments, context]);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 2800);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const showSuccess = useCallback((message: string) => {
    setFlash({ tone: "success", message });
  }, []);

  const showError = useCallback((message: string) => {
    setFlash({ tone: "error", message });
  }, []);

  const openAppointmentProfile = (appointment: AppointmentRow) => {
    setProfileAppointment(appointment);
    setProfileOpen(true);
  };

  const patientById = useMemo(() => new Map(data.patients.map((p) => [p.id, p])), [data.patients]);
  const therapistById = useMemo(() => new Map(data.therapists.map((t) => [t.id, t])), [data.therapists]);
  const therapyById = useMemo(() => new Map(data.therapies.map((t) => [t.id, t])), [data.therapies]);
  const franchiseById = useMemo(() => new Map(data.franchises.map((f) => [f.id, f])), [data.franchises]);

  const persistAppointmentCreate = useCallback(async ({ values }: { values: string[] }) => {
    if (!supabase) throw new Error("Supabase client is not available.");
    setIsPageLoading(true);
    try {
      const patientName = values[1]?.trim() ?? "";
      const therapyName = values[2]?.trim() ?? "";
      const therapistName = values[3]?.trim() ?? "";
      const startsAt = toIsoFromDateAndTime(values[5], values[6]);

      const patient = data.patients.find(p => p.full_name === patientName);
      const therapy = data.therapies.find(t => t.name === therapyName);
      const therapist = data.therapists.find(t => t.full_name === therapistName);

      if (!patient || !therapy || !therapist) throw new Error("Invalid patient, therapy or therapist selection.");

      const { error } = await supabase.from("appointments").insert({
        id: `APT${Date.now()}`,
        patient_id: patient.id,
        therapy_id: therapy.id,
        therapist_id: therapist.id,
        franchise_id: therapist.franchise_id,
        starts_at: startsAt,
        status: "scheduled",
      });

      if (error) throw new Error(error.message);
      await reload();
      showSuccess("Appointment booked successfully.");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to book appointment.");
    } finally {
      setIsPageLoading(false);
    }
  }, [data, reload, showSuccess, showError]);

  const persistAppointmentUpdate = useCallback(async ({ rowId, values }: { rowId: string; values: string[] }) => {
    if (!supabase) throw new Error("Supabase client is not available.");
    setIsPageLoading(true);
    try {
      const startsAt = toIsoFromDateAndTime(values[5], values[6]);
      const status = values[7]?.toLowerCase() ?? "scheduled";

      const { error } = await supabase.from("appointments").update({
        starts_at: startsAt,
        status,
      }).eq("id", rowId);

      if (error) throw new Error(error.message);
      await reload();
      showSuccess("Appointment updated.");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update appointment.");
    } finally {
      setIsPageLoading(false);
    }
  }, [reload, showSuccess, showError]);

  const persistAppointmentDelete = useCallback(async (rowIds: string[]) => {
    if (!supabase) throw new Error("Supabase client is not available.");
    setIsPageLoading(true);
    try {
      const { error } = await supabase.from("appointments").update({ status: "cancelled" }).in("id", rowIds);
      if (error) throw new Error(error.message);
      await reload();
      showSuccess("Appointment(s) cancelled.");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to cancel appointment.");
    } finally {
      setIsPageLoading(false);
    }
  }, [reload, showSuccess, showError]);

  const kpis = buildAppointmentsKpis(scopedAppointments, role);
  const tableConfig = tableViewConfigs.appointments;

  return (
    <div className="space-y-3">
      {flash ? (
        <div className="fixed right-5 top-20 z-[80]">
          <div className={`rounded-xl border px-3 py-2 text-sm shadow-sm ${
            flash.tone === "success" ? "border-[#86efac] bg-[#f0fdf4] text-[#166534]" : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
          }`}>
            {flash.message}
          </div>
        </div>
      ) : null}

      <ManagementPageLayout
        title={role === "therapist" || role === "patient" ? "My Appointments" : "Appointment Schedule"}
        searchPlaceholder="Search appointments..."
        addActionLabel="Book Appointment"
        createSheetTitle="Book Appointment"
        kpis={kpis}
        columns={tableConfig.columns}
        centeredBodyColumns={tableConfig.centeredBodyColumns}
        onCreateRow={persistAppointmentCreate}
        onUpdateRow={persistAppointmentUpdate}
        onDeleteRows={persistAppointmentDelete}
        onRowClick={(row) => {
          const appointment = scopedAppointments.find(a => a.id === row.id);
          if (appointment) openAppointmentProfile(appointment);
        }}
        isLoading={isBootstrapLoading || isPageLoading}
        rows={scopedAppointments.map((a) => ({
          id: a.id,
          cells: [
            a.id,
            patientById.get(a.patient_id)?.full_name ?? "—",
            therapyById.get(a.therapy_id)?.name ?? "—",
            therapistById.get(a.therapist_id)?.full_name ?? "—",
            franchiseById.get(a.franchise_id ?? "")?.name ?? "—",
            toLongDateLabel(a.starts_at),
            toTimeLabel(a.starts_at),
            <StatusPill key={a.id} status={toStatus(a.status)} />,
          ],
        }))}
      />

      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="center" className="w-[min(96vw,43.75rem)] max-h-[92vh] overflow-hidden rounded-2xl border border-[#ddd8cc] bg-white p-0 shadow-2xl [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Appointment Profile</SheetTitle>
            <SheetDescription>Detailed appointment information and status.</SheetDescription>
          </SheetHeader>

          {profileAppointment ? (
            <div className="flex max-h-[92vh] flex-col">
              <div className="flex items-start justify-between border-b border-[#ede8dc] px-6 pb-4 pt-5">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-[52px] place-items-center rounded-full bg-[#3a7a8c] text-lg font-semibold text-white">
                    <CalendarDays className="size-6" />
                  </div>
                  <div>
                    <p className="display-heading text-[22px] leading-none text-[#2c2416]">Appointment Details</p>
                    <p className="mt-1 text-[11px] font-medium tracking-[0.04em] text-[#a09080]">
                      {profileAppointment.id} · {toStatus(profileAppointment.status)}
                    </p>
                  </div>
                </div>
                <SheetClose asChild>
                  <button type="button" className="grid size-[30px] place-items-center rounded-[7px] border border-[#ddd8cc] text-[#a09080] transition hover:bg-[#f0ede6] hover:text-[#2c2416]">×</button>
                </SheetClose>
              </div>

              <div className="overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Patient</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><User className="size-3 text-[#a09080]" /> {patientById.get(profileAppointment.patient_id)?.full_name ?? "—"}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Therapist</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><UserCheck className="size-3 text-[#a09080]" /> {therapistById.get(profileAppointment.therapist_id)?.full_name ?? "—"}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Therapy Program</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><Layers className="size-3 text-[#a09080]" /> {therapyById.get(profileAppointment.therapy_id)?.name ?? "—"}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Location</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><MapPin className="size-3 text-[#a09080]" /> {franchiseById.get(profileAppointment.franchise_id ?? "")?.name ?? "—"}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#fdf3dc] text-[#c8993a]">
                      <CalendarDays className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{toLongDateLabel(profileAppointment.starts_at)}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Appointment Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#d4ebf0] text-[#3a7a8c]">
                      <Clock className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{toTimeLabel(profileAppointment.starts_at)}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Scheduled Time</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                   <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a09080]">Current Status</p>
                   <div className="flex items-center gap-2 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                     <StatusPill status={toStatus(profileAppointment.status)} />
                     <span className="mx-1 h-[18px] w-px bg-[#ede8dc]" />
                     <p className="text-[11px] text-[#a09080]">Scheduled for: {toLongDateLabel(profileAppointment.starts_at)}</p>
                   </div>
                </div>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
