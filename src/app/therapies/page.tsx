"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  History,
  IndianRupee,
  Layers,
  Star,
  Users,
} from "lucide-react";

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
import { buildTherapiesKpis, formatCurrencyINR } from "@/lib/metrics";
import { resolveUserContext } from "@/lib/roleScope";
import { supabase } from "@/lib/supabase/client";
import { resolveTherapyFeedbackSchema } from "@/lib/therapyFeedbackSchema";
import type { TherapyRow } from "@/lib/supabase/types";

type FlashState = {
  tone: "success" | "error";
  message: string;
};

const parseDurationMinutes = (text: string) => Number(text.replace(/\D/g, "") || "45");

const parsePrice = (text: string) => {
  const cleaned = text.replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
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

export default function TherapiesPage() {
  const { data, reload, isLoading } = useBootstrapData();
  const context = resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  });
  const role = context.role;
  const isAdmin = role === "admin";

  if (role === "patient") {
    return null;
  }

  const [flash, setFlash] = useState<FlashState | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileTherapy, setProfileTherapy] = useState<TherapyRow | null>(null);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 2800);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const showSuccess = useCallback((message: string) => {
    setFlash({ tone: "success", message });
  }, []);

  const openTherapyProfile = (therapy: TherapyRow) => {
    setProfileTherapy(therapy);
    setProfileOpen(true);
  };

  const kpis = buildTherapiesKpis(data.therapies, role);
  const tableConfig = tableViewConfigs.therapies;
  const therapyNameOptions = data.therapies.map((therapy) => therapy.name);
  const categoryOptions = Array.from(new Set(data.therapies.map((therapy) => therapy.category)));
  const durationOptions = Array.from(
    new Set(data.therapies.map((therapy) => `${therapy.duration_min} mins`)),
  );
  const sessionOptions = Array.from(
    new Set(data.therapies.map((therapy) => therapy.session_count.toString())),
  );
  const statusOptions = ["Active", "Inactive"];

  const persistTherapyCreate = useCallback(
    async ({ values }: { values: string[] }) => {
      if (!supabase) throw new Error("Supabase client is not available.");

      const rowId = values[0]?.trim() ?? "";
      const name = values[1]?.trim() ?? "";
      const category = values[2]?.trim() ?? "";
      const durationMin = parseDurationMinutes(values[3] ?? "");
      const sessionCount = Number(values[4]?.trim() ?? "1");
      const price = parsePrice(values[5] ?? "");
      const description = values[6]?.trim() ?? "";

      if (!rowId || !name || !category) {
        throw new Error("Name, category, and id are required.");
      }

      const { error } = await supabase.from("therapies").insert({
        id: rowId,
        name,
        category,
        duration_min: Number.isNaN(durationMin) ? 45 : durationMin,
        session_count: Number.isNaN(sessionCount) ? 1 : sessionCount,
        price,
        status: "active",
        description: description || null,
        feedback_schema: resolveTherapyFeedbackSchema({ therapyName: name, feedbackSchema: null }),
      });

      if (error) throw new Error(error.message ?? "Failed to create therapy.");
      await reload();
      showSuccess("Therapy created successfully.");
    },
    [reload, showSuccess],
  );

  const persistTherapyUpdate = useCallback(
    async ({ rowId, values }: { rowId: string; values: string[] }) => {
      if (!supabase) throw new Error("Supabase client is not available.");

      const name = values[1]?.trim() ?? "";
      const category = values[2]?.trim() ?? "";
      const durationMin = parseDurationMinutes(values[3] ?? "");
      const sessionCount = Number(values[4]?.trim() ?? "1");
      const price = parsePrice(values[5] ?? "");
      const description = values[6]?.trim() ?? "";
      const status = (values[7]?.trim() ?? "Active").toLowerCase();

      if (!name || !category) throw new Error("Name and category are required.");

      const { error } = await supabase
        .from("therapies")
        .update({
          name,
          category,
          duration_min: Number.isNaN(durationMin) ? 45 : durationMin,
          session_count: Number.isNaN(sessionCount) ? 1 : sessionCount,
          price,
          status,
          description: description || null,
          feedback_schema: resolveTherapyFeedbackSchema({
            therapyName: name,
            feedbackSchema: data.therapies.find((therapy) => therapy.id === rowId)?.feedback_schema ?? null,
          }),
        })
        .eq("id", rowId);

      if (error) throw new Error(error.message ?? "Failed to update therapy.");
      await reload();
      showSuccess("Therapy updated successfully.");
    },
    [data.therapies, reload, showSuccess],
  );

  const persistTherapyDelete = useCallback(
    async (rowIds: string[]) => {
      if (!supabase) throw new Error("Supabase client is not available.");

      for (const therapyId of rowIds) {
        const { data: linkedAppointments, error: linkedError } = await supabase
          .from("appointments")
          .select("id")
          .eq("therapy_id", therapyId)
          .limit(1);

        if (linkedError) throw new Error(linkedError.message);

        if ((linkedAppointments ?? []).length > 0) {
          throw new Error("This therapy has existing appointments and cannot be deleted.");
        }

        const { error } = await supabase.from("therapies").delete().eq("id", therapyId);
        if (error) throw new Error(error.message ?? `Failed to delete therapy ${therapyId}.`);
      }

      await reload();
      showSuccess("Therapy deleted successfully.");
    },
    [reload, showSuccess],
  );

  const therapyHistory = useMemo(() => {
    if (!profileTherapy) return [];
    return data.appointments
      .filter((a) => a.therapy_id === profileTherapy.id)
      .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());
  }, [data.appointments, profileTherapy]);

  const therapyStats = useMemo(() => {
    if (!profileTherapy) return { totalSessions: 0, totalRevenue: 0, avgRating: 0 };
    const sessions = data.appointments.filter((a) => a.therapy_id === profileTherapy.id);
    const completed = sessions.filter((a) => a.status === "completed");
    const billing = data.billing.filter((b) => completed.some((c) => c.id === b.appointment_id) && b.status === "paid");
    const feedback = data.feedback.filter((f) => completed.some((c) => c.id === f.appointment_id));
    const ratings = feedback.map((f) => f.rating).filter((r): r is number => r !== null);

    return {
      totalSessions: sessions.length,
      totalRevenue: billing.reduce((sum, b) => sum + b.amount, 0),
      avgRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
    };
  }, [data.appointments, data.billing, data.feedback, profileTherapy]);

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
        title="Therapy Programs"
        searchPlaceholder="Search therapies..."
        addActionLabel="Create Therapy Program"
        createSheetTitle="Create Therapy Program"
        kpis={kpis}
        columns={tableConfig.columns}
        centeredBodyColumns={tableConfig.centeredBodyColumns}
        onCreateRow={persistTherapyCreate}
        onUpdateRow={persistTherapyUpdate}
        onDeleteRows={persistTherapyDelete}
        onRowClick={(row) => {
          const therapy = data.therapies.find(t => t.id === row.id);
          if (therapy) openTherapyProfile(therapy);
        }}
        optimisticMutations={false}
        showAddAction={isAdmin}
        showUploadAction={isAdmin}
        enableRowEdit={isAdmin}
        enableRowDelete={isAdmin}
        enableBulkDelete={isAdmin}
        showSelection={isAdmin}
        deleteDialogTitle="Delete Therapy?"
        deleteDialogDescription={() =>
          "This will permanently delete this therapy. This cannot be undone."
        }
        formFieldConfigs={{
          "Therapy Name": { type: "typeahead", options: therapyNameOptions, placeholder: "Type therapy name...", debounceMs: 250 },
          Category: { type: "select", options: categoryOptions },
          Duration: { type: "select", options: durationOptions },
          Sessions: { type: "select", options: sessionOptions },
          Price: { type: "text", placeholder: "Enter price" },
          Description: { type: "text", placeholder: "Optional description" },
          Status: { type: "select", options: statusOptions, defaultValue: statusOptions[0] },
        }}
        isLoading={isLoading}
        rows={data.therapies.map((therapy) => ({
          id: therapy.id,
          canEdit: isAdmin,
          canDelete: isAdmin,
          cells: [
            therapy.id,
            therapy.name,
            therapy.category,
            `${therapy.duration_min} mins`,
            therapy.session_count.toString(),
            therapy.price.toString(),
            therapy.description ?? "-",
            <StatusPill key={`${therapy.id}-status`} status={therapy.status === "active" ? "Active" : "Inactive"} />,
          ],
        }))}
      />

      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="center" className="w-[min(96vw,43.75rem)] max-h-[92vh] overflow-hidden rounded-2xl border border-[#ddd8cc] bg-white p-0 shadow-2xl [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>{profileTherapy?.name ?? "Therapy Profile"}</SheetTitle>
            <SheetDescription>Program details, history and performance metrics.</SheetDescription>
          </SheetHeader>

          {profileTherapy ? (
            <div className="flex max-h-[92vh] flex-col">
              <div className="flex items-start justify-between border-b border-[#ede8dc] px-6 pb-4 pt-5">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-[52px] place-items-center rounded-full bg-[#3a7a8c] text-lg font-semibold text-white">
                    <Layers className="size-6" />
                  </div>
                  <div>
                    <p className="display-heading text-[22px] leading-none text-[#2c2416]">{profileTherapy.name}</p>
                    <p className="mt-1 text-[11px] font-medium tracking-[0.04em] text-[#a09080]">
                      {profileTherapy.id} · {profileTherapy.category}
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
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Duration & Sessions</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] flex items-center gap-1.5"><Clock className="size-3 text-[#a09080]" /> {profileTherapy.duration_min} mins · {profileTherapy.session_count} sessions</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Unit Price</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416] font-semibold">{formatCurrencyINR(profileTherapy.price)}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3 md:col-span-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Description</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#2c2416]">{profileTherapy.description || "No description provided."}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#fdf3dc] text-[#c8993a]">
                      <Star className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{therapyStats.avgRating.toFixed(1)}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Avg Rating</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#d4e8d8] text-[#4e8060]">
                      <CalendarDays className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{therapyStats.totalSessions}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Total Sessions</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                      <div className="grid size-[34px] place-items-center rounded-lg bg-[#d4ebf0] text-[#3a7a8c]">
                        <IndianRupee className="size-4" />
                      </div>
                      <div>
                        <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{formatCurrencyINR(therapyStats.totalRevenue)}</p>
                        <p className="mt-0.5 text-[10px] text-[#a09080]">Revenue</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a09080]">Program Status</p>
                  <div className="flex items-center gap-2 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${profileTherapy.status === "active" ? "bg-[#d4e8d8] text-[#3a6a50]" : "bg-[#fee2e2] text-[#b91c1c]"}`}>
                      <span className="size-1.5 rounded-full bg-current" />
                      {profileTherapy.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a09080]">Recent Sessions</p>
                  <div className="overflow-x-auto rounded-[10px] border border-[#ede8dc]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Date</th>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Patient</th>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Therapist</th>
                          <th className="bg-[#faf8f4] px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ede8dc]">
                        {therapyHistory.slice(0, 8).map((a) => (
                          <tr key={a.id} className="text-[12px] text-[#2c2416]">
                            <td className="px-3 py-2">{toLongDateLabel(a.starts_at)}</td>
                            <td className="px-3 py-2">{data.patients.find(p => p.id === a.patient_id)?.full_name || "—"}</td>
                            <td className="px-3 py-2">{data.therapists.find(t => t.id === a.therapist_id)?.full_name || "—"}</td>
                            <td className="px-3 py-2"><StatusPill status={a.status} /></td>
                          </tr>
                        ))}
                        {therapyHistory.length === 0 && (
                          <tr><td colSpan={4} className="px-3 py-8 text-center text-[#a09080]">No session history available.</td></tr>
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
