"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Mail,
  Phone,
  Star,
  UserCheck,
} from "lucide-react";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { InitialsAvatar, StatusPill } from "@/components/kyochi/primitives";
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
import { buildTherapistsKpis, formatCurrencyINR } from "@/lib/metrics";
import { resolveUserContext } from "@/lib/roleScope";
import { supabase } from "@/lib/supabase/client";
import type { TherapistRow, AppointmentRow, FeedbackRow } from "@/lib/supabase/types";

const toInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

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

const toTimeLabel = (value: string | null | undefined) => {
  if (!value) return "—";
  // Assuming HH:MM format from DB or ISO string
  if (value.includes("T")) {
    const parsed = new Date(value);
    return parsed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  return value;
};

type FlashState = {
  tone: "success" | "error";
  message: string;
};

export default function TherapistsPage() {
  const { data, reload, isLoading } = useBootstrapData();
  const context = resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  });
  const role = context.role;
  const franchiseId = context.franchiseId;
  const scopedTherapists =
    role === "admin"
      ? data.therapists
      : data.therapists.filter((therapist) => therapist.franchise_id === franchiseId);

  const [flash, setFlash] = useState<FlashState | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileTherapist, setProfileTherapist] = useState<TherapistRow | null>(null);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 2800);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const showSuccess = useCallback((message: string) => {
    setFlash({ tone: "success", message });
  }, []);

  if (role === "patient") {
    return null;
  }

  const kpis = buildTherapistsKpis(scopedTherapists, role);
  const franchiseById = new Map(
    data.franchises.map((franchise) => [franchise.id, franchise]),
  );
  const franchiseIdByName = new Map(
    data.franchises.map((franchise) => [franchise.name, franchise.id]),
  );
  
  const tableConfig = tableViewConfigs.therapists;
  const therapistNameOptions = scopedTherapists.map((therapist) => therapist.full_name);
  const franchiseOptions = Array.from(new Set(data.franchises.map((f) => f.name)));
  const specialtyOptions = Array.from(new Set(scopedTherapists.map((therapist) => therapist.specialty)));

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = (await supabase?.auth.getSession())?.data.session?.access_token;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, []);

  const persistTherapistCreate = useCallback(
    async ({ values }: { values: string[] }) => {
      const rowId = values[0]?.trim() ?? "";
      const fullName = values[1]?.trim() ?? "";
      const franchiseName = values[2]?.trim() ?? "";
      const specialty = values[3]?.trim() ?? "";
      const email = values[4]?.trim() ?? "";
      const licenseNo = values[6]?.trim() ?? "";
      const franchiseRef = franchiseIdByName.get(franchiseName);

      if (!rowId || !fullName || !franchiseRef || !specialty || !email || !licenseNo) {
        throw new Error("Missing required therapist fields.");
      }

      const response = await fetch("/api/therapists", {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          id: rowId,
          full_name: fullName,
          franchise_id: franchiseRef,
          specialty,
          email,
          license_no: licenseNo,
          status: "active",
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message ?? "Failed to create therapist.");
      }
      await reload();
      showSuccess("Therapist onboarded successfully.");
    },
    [franchiseIdByName, getAuthHeaders, reload, showSuccess],
  );

  const persistTherapistUpdate = useCallback(
    async ({ rowId, values }: { rowId: string; values: string[] }) => {
      const fullName = values[1]?.trim() ?? "";
      const franchiseName = values[2]?.trim() ?? "";
      const specialty = values[3]?.trim() ?? "";
      const email = values[4]?.trim() ?? "";
      const licenseNo = values[6]?.trim() ?? "";
      const franchiseRef = franchiseIdByName.get(franchiseName);

      if (!fullName || !franchiseRef || !specialty || !email || !licenseNo) {
        throw new Error("Missing required therapist fields.");
      }

      const response = await fetch(`/api/therapists/${encodeURIComponent(rowId)}`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          full_name: fullName,
          franchise_id: franchiseRef,
          specialty,
          email,
          license_no: licenseNo,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message ?? "Failed to update therapist.");
      }
      await reload();
      showSuccess("Therapist updated successfully.");
    },
    [franchiseIdByName, getAuthHeaders, reload, showSuccess],
  );

  const persistTherapistDelete = useCallback(
    async (rowIds: string[]) => {
      const headers = await getAuthHeaders();
      for (const rowId of rowIds) {
        const response = await fetch(`/api/therapists/${encodeURIComponent(rowId)}`, {
          method: "DELETE",
          headers,
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.message ?? `Failed to delete therapist ${rowId}.`);
        }
      }
      await reload();
      showSuccess("Therapist records removed.");
    },
    [getAuthHeaders, reload, showSuccess],
  );

  const openTherapistProfile = (therapist: TherapistRow) => {
    setProfileTherapist(therapist);
    setProfileOpen(true);
  };

  const therapistHistory = useMemo(() => {
    if (!profileTherapist) return [];
    return data.appointments
      .filter((a) => a.therapist_id === profileTherapist.id)
      .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());
  }, [data.appointments, profileTherapist]);

  const therapistStats = useMemo(() => {
    if (!profileTherapist) return { totalSessions: 0, avgRating: 0, completionRate: 0 };
    const sessions = data.appointments.filter((a) => a.therapist_id === profileTherapist.id);
    const completed = sessions.filter((a) => a.status === "completed");
    const feedback = data.feedback.filter((f) => completed.some((c) => c.id === f.appointment_id));
    const ratings = feedback.map((f) => f.rating).filter((r): r is number => r !== null);
    
    return {
      totalSessions: sessions.length,
      avgRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
      completionRate: sessions.length > 0 ? (completed.length / sessions.length) * 100 : 0,
    };
  }, [data.appointments, data.feedback, profileTherapist]);

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
        title="Therapist Management"
        searchPlaceholder="Search therapists..."
        addActionLabel="Onboard Therapist"
        createSheetTitle="Onboard Therapist"
        kpis={kpis}
        columns={tableConfig.columns}
        centeredBodyColumns={tableConfig.centeredBodyColumns}
        onCreateRow={persistTherapistCreate}
        onUpdateRow={persistTherapistUpdate}
        onDeleteRows={persistTherapistDelete}
        onRowClick={(row) => {
          const therapist = scopedTherapists.find((t) => t.id === row.id);
          if (therapist) openTherapistProfile(therapist);
        }}
        formFieldConfigs={{
          Name: { type: "typeahead", options: therapistNameOptions, placeholder: "Type therapist name...", debounceMs: 250 },
          Franchise: { type: "select", options: franchiseOptions },
          Specialty: { type: "select", options: specialtyOptions },
        }}
        isLoading={isLoading}
        rows={scopedTherapists.map((therapist) => ({
          id: therapist.id,
          cells: [
            therapist.id,
            <div key={`${therapist.id}-name`} className="flex items-center gap-2">
              <InitialsAvatar initials={toInitials(therapist.full_name)} className="size-8 text-[11px]" />
              <span>{therapist.full_name}</span>
            </div>,
            franchiseById.get(therapist.franchise_id ?? "")?.name ?? "Unknown",
            therapist.specialty,
            therapist.email,
            (therapist as any).phone ?? "-",
            therapist.license_no,
          ],
        }))}
      />

      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="center" className="w-[min(96vw,43.75rem)] max-h-[92vh] overflow-hidden rounded-2xl border border-[#ddd8cc] bg-white p-0 shadow-2xl [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>{profileTherapist?.full_name ?? "Therapist Profile"}</SheetTitle>
            <SheetDescription>Therapist performance, history and credentials.</SheetDescription>
          </SheetHeader>

          {profileTherapist ? (
            <div className="flex max-h-[92vh] flex-col">
              <div className="flex items-start justify-between border-b border-[#ede8dc] px-6 pb-4 pt-5">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-[52px] place-items-center rounded-full bg-[#2c2416] text-lg font-semibold text-[#f7f4ee]">
                    <span className="display-heading">{toInitials(profileTherapist.full_name)}</span>
                  </div>
                  <div>
                    <p className="display-heading text-[22px] leading-none text-[#2c2416]">{profileTherapist.full_name}</p>
                    <p className="mt-1 text-[11px] font-medium tracking-[0.04em] text-[#a09080]">
                      {profileTherapist.id} · {profileTherapist.specialty}
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
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Franchise</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416]">{franchiseById.get(profileTherapist.franchise_id ?? "")?.name ?? "Unknown"}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">License Number</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416]">{profileTherapist.license_no || "—"}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Email</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><Mail className="size-3 text-[#a09080]" /> {profileTherapist.email}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Phone</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><Phone className="size-3 text-[#a09080]" /> {(profileTherapist as any).phone || "—"}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#fdf3dc] text-[#c8993a]">
                      <Star className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{therapistStats.avgRating.toFixed(1)}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Avg Rating</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#d4e8d8] text-[#4e8060]">
                      <CalendarDays className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{therapistStats.totalSessions}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Total Sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#d4ebf0] text-[#3a7a8c]">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{therapistStats.completionRate.toFixed(0)}%</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Completion</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                   <p className="w-[72px] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#a09080]">Status</p>
                   <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${profileTherapist.status === "active" ? "bg-[#d4e8d8] text-[#3a6a50]" : "bg-[#fee2e2] text-[#b91c1c]"}`}>
                    <span className="size-1.5 rounded-full bg-current" />
                    {profileTherapist.status}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a09080]">Recent Appointments</p>
                  <div className="overflow-x-auto rounded-[10px] border border-[#ede8dc]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Date</th>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Patient</th>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Time</th>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ede8dc]">
                        {therapistHistory.slice(0, 10).map((a) => (
                          <tr key={a.id} className="text-[12px] text-[#2c2416]">
                            <td className="px-3 py-2">{toLongDateLabel(a.starts_at)}</td>
                            <td className="px-3 py-2">{data.patients.find(p => p.id === a.patient_id)?.full_name || "—"}</td>
                            <td className="px-3 py-2 font-medium">{toTimeLabel(a.starts_at)}</td>
                            <td className="px-3 py-2"><StatusPill status={a.status} /></td>
                          </tr>
                        ))}
                        {therapistHistory.length === 0 && (
                          <tr><td colSpan={4} className="px-3 py-8 text-center text-[#a09080]">No appointment history found.</td></tr>
                        )}
                      </tbody>
                    </table>
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
