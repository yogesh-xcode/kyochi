"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  SquarePen,
  Star,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import type { KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
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
import { buildPatientsKpis } from "@/lib/metrics";
import { resolveUserContext } from "@/lib/roleScope";
import { supabase } from "@/lib/supabase/client";
import type { PatientRow } from "@/lib/supabase/types";

const generatePatientId = () => {
  const stamp = Date.now().toString().slice(-8);
  const rand = Math.floor(10 + Math.random() * 90);
  return `PAT${stamp}${rand}`;
};

const toDateLabel = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
};

const toLongDateLabel = (value: string | null | undefined) => {
  if (!value) {
    return "—";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const toMonthYearLabel = (value: string | null | undefined) => {
  if (!value) {
    return "—";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const toAgeLabel = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }
  const dob = new Date(value);
  if (Number.isNaN(dob.getTime())) {
    return "";
  }
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
    years -= 1;
  }
  if (years < 0) {
    return "";
  }
  return `(${years} yrs)`;
};

const getInitials = (fullName: string | null | undefined) => {
  if (!fullName) {
    return "PT";
  }
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const asNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const extractReliefDelta = (payload: Record<string, unknown> | null | undefined) => {
  if (!payload) {
    return null;
  }

  const aiRelief = asNumber(payload.ai_relief_delta);
  if (aiRelief !== null) {
    return aiRelief;
  }

  for (const [key, rawBefore] of Object.entries(payload)) {
    if (!key.toLowerCase().includes("before")) {
      continue;
    }

    const before = asNumber(rawBefore);
    if (before === null) {
      continue;
    }

    const sameKeyAfter = key.replace(/before/i, "after");
    const rawAfter = payload[sameKeyAfter];
    const after = asNumber(rawAfter);
    if (after === null) {
      continue;
    }

    return before - after;
  }

  return null;
};

const getHistoryStatusTone = (status: string) => {
  const normalized = status.trim().toLowerCase();
  if (normalized === "completed" || normalized === "active" || normalized === "paid") {
    return "bg-[#d4e8d8] text-[#3a6a50]";
  }
  if (normalized === "waiting" || normalized === "pending") {
    return "bg-[#f0ede6] text-[#7a6a52]";
  }
  if (normalized === "scheduled") {
    return "bg-[#d4ebf0] text-[#3a7a8c]";
  }
  return "bg-[#f0ede6] text-[#7a6a52]";
};

const getWellnessTone = (score: number) => {
  if (score >= 70) {
    return "bg-[#dcfce7] text-[#166534] border-[#86efac]";
  }
  if (score >= 40) {
    return "bg-[#fef3c7] text-[#92400e] border-[#fcd34d]";
  }
  return "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]";
};

type HistoryRow = {
  id: string;
  starts_at: string;
  status: string;
  therapist_id: string;
  therapy_id: string;
  therapists?: { full_name?: string | null } | null;
  therapies?: { name?: string | null } | null;
};

type FeedbackSummaryRow = {
  appointment_id: string;
  rating: number | null;
  status: string;
  notes: unknown | null;
  submitted_at: string | null;
  feedback_payload?: Record<string, unknown> | null;
};

type FlashState = {
  tone: "success" | "error";
  message: string;
};

function PatientsContent() {
  const { data, isLoading: isBootstrapLoading } = useBootstrapData();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const context = resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  });

  const role = context.role;
  const therapistId = context.therapistId;
  const patientId = context.patientId;
  const franchiseId = context.franchiseId;

  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [editablePatientIds, setEditablePatientIds] = useState<Set<string>>(new Set());
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePatient, setProfilePatient] = useState<PatientRow | null>(null);
  const [profileHistory, setProfileHistory] = useState<HistoryRow[]>([]);
  const [profileFeedback, setProfileFeedback] = useState<FeedbackSummaryRow[]>([]);
  const [pendingEditRowId, setPendingEditRowId] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [flash, setFlash] = useState<FlashState | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!flash) {
      return;
    }
    const timer = window.setTimeout(() => setFlash(null), 2800);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const showSuccess = useCallback((message: string) => {
    setFlash({ tone: "success", message });
  }, []);

  const showError = useCallback((message: string) => {
    setFlash({ tone: "error", message });
  }, []);

  const updatePatientRouteQuery = useCallback(
    (updates: { profile?: string | null; edit?: string | null }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.profile !== undefined) {
        if (updates.profile) {
          params.set("profile", updates.profile);
        } else {
          params.delete("profile");
        }
      }
      if (updates.edit !== undefined) {
        if (updates.edit) {
          params.set("edit", updates.edit);
        } else {
          params.delete("edit");
        }
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const loadPatients = useCallback(async () => {
    if (!supabase) {
      return;
    }

    let query = supabase.from("patients").select("*").order("full_name", { ascending: true });

    if (role === "patient") {
      query = query.eq("id", patientId);
    } else if (role !== "admin") {
      query = query.eq("franchise_id", franchiseId);
    }

    const { data: patientRows, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    setPatients((patientRows ?? []) as PatientRow[]);
  }, [franchiseId, patientId, role]);

  const loadTherapistEditablePatients = useCallback(async () => {
    if (!supabase || role !== "therapist") {
      setEditablePatientIds(new Set());
      return;
    }

    const { data: appts, error } = await supabase
      .from("appointments")
      .select("patient_id")
      .eq("therapist_id", therapistId)
      .eq("franchise_id", franchiseId);

    if (error) {
      throw new Error(error.message);
    }

    const ids = new Set((appts ?? []).map((row) => (row as { patient_id: string }).patient_id));
    setEditablePatientIds(ids);
  }, [franchiseId, role, therapistId]);

  const reloadPatients = useCallback(async () => {
    setIsPageLoading(true);
    try {
      await loadPatients();
      await loadTherapistEditablePatients();
    } finally {
      setIsPageLoading(false);
    }
  }, [loadPatients, loadTherapistEditablePatients]);

  const openPatientProfile = useCallback(
    async (
      patient: PatientRow,
      options?: { syncUrl?: boolean },
    ) => {
      setProfilePatient(patient);
      setProfileOpen(true);
      setProfileLoading(true);
      if (options?.syncUrl !== false) {
        updatePatientRouteQuery({ profile: patient.id, edit: null });
      }

      if (!supabase) {
        setProfileHistory([]);
        setProfileFeedback([]);
        setProfileLoading(false);
        return;
      }

      let historyQuery = supabase
        .from("appointments")
        .select("id, starts_at, status, therapist_id, therapy_id, therapists(full_name), therapies(name)")
        .eq("patient_id", patient.id)
        .eq("franchise_id", patient.franchise_id)
        .order("starts_at", { ascending: false });

      let feedbackQuery = supabase
        .from("feedback")
        .select("appointment_id, rating, status, notes, submitted_at, feedback_payload, therapist_id")
        .eq("patient_id", patient.id)
        .eq("franchise_id", patient.franchise_id)
        .order("submitted_at", { ascending: false, nullsFirst: false });

      if (role === "therapist") {
        historyQuery = historyQuery.eq("therapist_id", therapistId);
        feedbackQuery = feedbackQuery.eq("therapist_id", therapistId);
      }

      const [{ data: historyRows, error: historyError }, { data: feedbackRows, error: feedbackError }] =
        await Promise.all([historyQuery, feedbackQuery]);

      if (historyError || feedbackError) {
        showError(historyError?.message ?? feedbackError?.message ?? "Failed to load patient profile.");
        setProfileHistory([]);
        setProfileFeedback([]);
        setProfileLoading(false);
        return;
      }

      setProfileHistory((historyRows ?? []) as HistoryRow[]);
      setProfileFeedback((feedbackRows ?? []) as FeedbackSummaryRow[]);
      setProfileLoading(false);
    },
    [role, showError, therapistId, updatePatientRouteQuery],
  );

  useEffect(() => {
    void reloadPatients().catch((error) => {
      const message = error instanceof Error ? error.message : "Failed to load patients.";
      showError(message);
    });
  }, [reloadPatients, showError]);

  useEffect(() => {
    const profileId = searchParams.get("profile");
    if (!profileId) {
      if (profileOpen) {
        setProfileOpen(false);
      }
      return;
    }
    if (patients.length === 0) {
      return;
    }
    const targetPatient = patients.find((entry) => entry.id === profileId);
    if (!targetPatient) {
      return;
    }
    if (profilePatient?.id === targetPatient.id && profileOpen) {
      return;
    }
    void openPatientProfile(targetPatient, { syncUrl: false });
  }, [openPatientProfile, patients, profileOpen, profilePatient?.id, searchParams]);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (!editId) {
      return;
    }
    const hasTarget = patients.some((entry) => entry.id === editId);
    if (!hasTarget) {
      return;
    }
    setPendingEditRowId(editId);
  }, [patients, searchParams]);

  const canEditPatient = useCallback(
    (patient: PatientRow) => {
      if (role === "admin") {
        return true;
      }
      if (role === "franchisee") {
        return patient.franchise_id === franchiseId;
      }
      return editablePatientIds.has(patient.id);
    },
    [editablePatientIds, franchiseId, role],
  );

  const canDeletePatient = role === "admin";

  const kpis = useMemo(() => buildPatientsKpis(patients, role), [patients, role]);
  const tableConfig = tableViewConfigs.patients;

  const persistPatientCreate = useCallback(
    async ({ values }: { values: string[] }) => {
      if (!supabase) {
        throw new Error("Supabase client is not available.");
      }

      const fullName = values[1]?.trim() ?? "";
      const email = values[2]?.trim() ?? "";
      const phone = values[3]?.trim() ?? "";
      const dob = values[4]?.trim() ?? "";

      if (!fullName || !email || !phone || !dob) {
        throw new Error("Full name, email, phone, and DOB are required.");
      }

      let candidateId = values[0]?.trim() || generatePatientId();

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const { error } = await supabase.from("patients").insert({
          id: candidateId,
          franchise_id: franchiseId,
          full_name: fullName,
          email,
          phone,
          dob,
          wellness_score: 0,
          status: "active",
        });

        if (!error) {
          await reloadPatients();
          showSuccess("Patient registered successfully.");
          return {
            id: candidateId,
            values: [candidateId, fullName, email, phone, toDateLabel(dob), "0", "Active"],
          };
        }

        const message = error.message ?? "Failed to create patient.";
        const duplicate =
          message.toLowerCase().includes("patients_pkey") ||
          message.toLowerCase().includes("duplicate key");

        if (duplicate && attempt < 2) {
          candidateId = generatePatientId();
          continue;
        }

        throw new Error(message);
      }

      throw new Error("Failed to create patient due to repeated id conflicts.");
    },
    [franchiseId, reloadPatients, showSuccess],
  );

  const persistPatientUpdate = useCallback(
    async ({ rowId, values }: { rowId: string; values: string[] }) => {
      if (!supabase) {
        throw new Error("Supabase client is not available.");
      }

      const fullName = values[1]?.trim() ?? "";
      const email = values[2]?.trim() ?? "";
      const phone = values[3]?.trim() ?? "";
      const dob = values[4]?.trim() ?? "";

      if (!fullName || !email || !phone || !dob) {
        throw new Error("Full name, email, phone, and DOB are required.");
      }

      const { error } = await supabase
        .from("patients")
        .update({
          full_name: fullName,
          email,
          phone,
          dob,
        })
        .eq("id", rowId);

      if (error) {
        throw new Error(error.message);
      }

      await reloadPatients();
      showSuccess("Patient details updated.");
    },
    [reloadPatients, showSuccess],
  );

  const persistPatientDelete = useCallback(
    async (rowIds: string[]) => {
      if (!supabase) {
        throw new Error("Supabase client is not available.");
      }

      for (const patientId of rowIds) {
        const feedbackDelete = await supabase
          .from("feedback")
          .delete()
          .eq("patient_id", patientId);
        if (feedbackDelete.error) {
          throw new Error(feedbackDelete.error.message);
        }

        const billingDelete = await supabase
          .from("billing")
          .delete()
          .eq("patient_id", patientId);
        if (billingDelete.error) {
          throw new Error(billingDelete.error.message);
        }

        const appointmentsDelete = await supabase
          .from("appointments")
          .delete()
          .eq("patient_id", patientId);
        if (appointmentsDelete.error) {
          throw new Error(appointmentsDelete.error.message);
        }

        const patientDelete = await supabase
          .from("patients")
          .delete()
          .eq("id", patientId);
        if (patientDelete.error) {
          throw new Error(patientDelete.error.message);
        }
      }

      await reloadPatients();
      showSuccess("Patient deleted successfully.");
    },
    [reloadPatients, showSuccess],
  );

  const patientRows: KyochiTableRow[] = useMemo(
    () =>
      patients.map((patient) => {
        const wellnessScore = Number(patient.wellness_score ?? 0);
        const canEdit = canEditPatient(patient);

        return {
          id: patient.id,
          canEdit,
          canDelete: canDeletePatient,
          actions: (
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              aria-label={`View ${patient.full_name}`}
              title={`View ${patient.full_name}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void openPatientProfile(patient);
              }}
            >
              <Eye className="size-3.5" />
            </Button>
          ),
          sortValues: [
            patient.id,
            patient.full_name,
            patient.email,
            patient.phone,
            patient.dob,
            wellnessScore,
            patient.status,
          ],
          cells: [
            patient.id,
            patient.full_name,
            patient.email,
            patient.phone,
            toDateLabel(patient.dob),
            <span
              key={`${patient.id}-wellness`}
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getWellnessTone(
                wellnessScore,
              )}`}
            >
              {wellnessScore.toFixed(1)}%
            </span>,
            <StatusPill key={`${patient.id}-status`} status={patient.status} />,
          ],
        };
      }),
    [canDeletePatient, canEditPatient, openPatientProfile, patients],
  );

  const feedbackByAppointment = useMemo(
    () => new Map(profileFeedback.map((entry) => [entry.appointment_id, entry])),
    [profileFeedback],
  );

  const assignedTherapist = useMemo(
    () => profileHistory.find((entry) => entry.therapists?.full_name)?.therapists?.full_name ?? "Not assigned",
    [profileHistory],
  );

  const latestVisit = useMemo(() => profileHistory[0]?.starts_at ?? null, [profileHistory]);

  const patientSince = useMemo(() => {
    const oldestAppointment = profileHistory.at(-1)?.starts_at;
    return oldestAppointment ? `Patient since ${toMonthYearLabel(oldestAppointment)}` : "Patient profile";
  }, [profileHistory]);

  const latestRating = useMemo(() => {
    const ratedEntry = profileFeedback.find((entry) => typeof entry.rating === "number");
    return typeof ratedEntry?.rating === "number" ? ratedEntry.rating : null;
  }, [profileFeedback]);

  const reliefDelta = useMemo(() => {
    for (const feedback of profileFeedback) {
      const delta = extractReliefDelta(feedback.feedback_payload);
      if (delta !== null) {
        return delta;
      }
    }
    return null;
  }, [profileFeedback]);

  const handleProfileOpenChange = useCallback(
    (nextOpen: boolean) => {
      setProfileOpen(nextOpen);
      if (!nextOpen) {
        updatePatientRouteQuery({ profile: null });
      }
    },
    [updatePatientRouteQuery],
  );

  const handleBookSession = useCallback(() => {
    if (!profilePatient) {
      return;
    }
    const params = new URLSearchParams({
      create: "1",
      patient: profilePatient.id,
      patientName: profilePatient.full_name,
    });
    router.push(`/appointments?${params.toString()}`);
  }, [profilePatient, router]);

  const handleEditPatient = useCallback(() => {
    if (!profilePatient) {
      return;
    }
    setProfileOpen(false);
    updatePatientRouteQuery({ profile: null, edit: profilePatient.id });
  }, [profilePatient, updatePatientRouteQuery]);

  if (role === "patient") {
    return null;
  }

  return (
    <>
      {flash ? (
        <div className="fixed right-5 top-20 z-[80]">
          <div
            className={`rounded-xl border px-3 py-2 text-sm shadow-sm ${
              flash.tone === "success"
                ? "border-[#86efac] bg-[#f0fdf4] text-[#166534]"
                : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
            }`}
          >
            {flash.message}
          </div>
        </div>
      ) : null}

      <ManagementPageLayout
        title="Patient Records"
        searchPlaceholder="Search patients..."
        addActionLabel="Register Patient"
        createSheetTitle="Register Patient"
        kpis={kpis}
        columns={tableConfig.columns}
        centeredBodyColumns={tableConfig.centeredBodyColumns}
        rows={patientRows}
        onCreateRow={persistPatientCreate}
        onUpdateRow={persistPatientUpdate}
        onDeleteRows={persistPatientDelete}
        openEditRowId={pendingEditRowId}
        onOpenEditRowHandled={() => {
          setPendingEditRowId(null);
          updatePatientRouteQuery({ edit: null });
        }}
        onRowClick={(row) => {
          const patient = patients.find((entry) => entry.id === row.id);
          if (patient) {
            void openPatientProfile(patient);
          }
        }}
        optimisticMutations={false}
        enableBulkDelete={role === "admin"}
        showSelection={role === "admin"}
        deleteDialogTitle="Delete Patient?"
        deleteDialogDescription={() =>
          "This will permanently delete this patient and all their appointments, billing, and feedback. This cannot be undone."
        }
        formFieldConfigs={{
          "Full Name": {
            type: "text",
            placeholder: "Enter patient full name...",
          },
          DOB: {
            type: "date",
          },
          Wellness: {
            hiddenInForm: true,
          },
          Status: {
            hiddenInForm: true,
          },
        }}
        isLoading={isBootstrapLoading || isPageLoading}
      />

      <Sheet open={profileOpen} onOpenChange={handleProfileOpenChange}>
        <SheetContent
          side="center"
          className="w-[min(96vw,43.75rem)] max-h-[92vh] overflow-hidden rounded-2xl border border-[#ddd8cc] bg-white p-0 shadow-2xl [&>button]:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{profilePatient?.full_name ?? "Patient Profile"}</SheetTitle>
            <SheetDescription>Read-only patient profile and appointment history.</SheetDescription>
          </SheetHeader>

          {profilePatient ? (
            <div className="flex max-h-[92vh] flex-col">
              <div className="flex items-start justify-between border-b border-[#ede8dc] px-6 pb-4 pt-5">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-[52px] place-items-center rounded-full bg-[#2c2416] text-lg font-semibold text-[#f7f4ee]">
                    <span className="display-heading">{getInitials(profilePatient.full_name)}</span>
                  </div>
                  <div>
                    <p className="display-heading text-[22px] leading-none text-[#2c2416]">{profilePatient.full_name}</p>
                    <p className="mt-1 text-[11px] font-medium tracking-[0.04em] text-[#a09080]">
                      {profilePatient.id} · {patientSince}
                    </p>
                  </div>
                </div>
                <SheetClose asChild>
                  <button
                    type="button"
                    aria-label="Close patient profile"
                    className="grid size-[30px] place-items-center rounded-[7px] border border-[#ddd8cc] text-[#a09080] transition hover:bg-[#f0ede6] hover:text-[#2c2416]"
                  >
                    ×
                  </button>
                </SheetClose>
              </div>

              <div className="overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Email</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416]">{profilePatient.email}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Phone</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416]">{profilePatient.phone}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Date of birth</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416]">
                      {toDateLabel(profilePatient.dob)}
                      <span className="ml-1.5 text-[11px] text-[#a09080]">{toAgeLabel(profilePatient.dob)}</span>
                    </p>
                  </div>
                  <div className="rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a09080]">Assigned therapist</p>
                    <p className="mt-1 text-[13.5px] text-[#2c2416]">{assignedTherapist}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#fdf3dc] text-[#c8993a]">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">
                        {Number(profilePatient.wellness_score ?? 0).toFixed(1)}%
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Wellness score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#d4e8d8] text-[#4e8060]">
                      <CalendarDays className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">{profileHistory.length}</p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">Sessions total</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                    <div className="grid size-[34px] place-items-center rounded-lg bg-[#d4ebf0] text-[#3a7a8c]">
                      <Star className="size-4" />
                    </div>
                    <div>
                      <p className="display-heading text-[1.125rem] leading-none text-[#2c2416]">
                        {reliefDelta !== null
                          ? reliefDelta.toFixed(1)
                          : latestRating !== null
                            ? latestRating.toFixed(1)
                            : "—"}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#a09080]">
                        {reliefDelta !== null ? "Relief delta" : "Session rating"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 rounded-[10px] border border-[#ede8dc] bg-[#fdfcf9] px-4 py-3">
                  <p className="w-[92px] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#a09080]">Status</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#d4e8d8] px-2.5 py-1 text-[11px] font-medium text-[#3a6a50]">
                    <span className="size-1.5 rounded-full bg-current" />
                    {profilePatient.status}
                  </span>
                  <span className="mx-1 h-[18px] w-px bg-[#ede8dc]" />
                  <p className="w-[92px] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#a09080]">Wellness score</p>
                  <span className="display-heading inline-flex rounded-full bg-[#fdf3dc] px-2.5 py-1 text-[13px] leading-none text-[#a07020]">
                    {Number(profilePatient.wellness_score ?? 0).toFixed(1)}%
                  </span>
                  <span className="mx-1 h-[18px] w-px bg-[#ede8dc]" />
                  <p className="w-[72px] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#a09080]">Last visit</p>
                  <span className="text-[12px] font-medium text-[#2c2416]">{toLongDateLabel(latestVisit)}</span>
                </div>

                <div className="mt-5">
                  <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a09080]">
                    Appointment history
                  </p>
                  <div className="overflow-x-auto rounded-[10px] border border-[#ede8dc]">
                    <table className="min-w-[640px] w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="bg-[#faf8f4] px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">
                            Date
                          </th>
                          <th className="bg-[#faf8f4] px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">
                            Therapist
                          </th>
                          <th className="bg-[#faf8f4] px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">
                            Therapy
                          </th>
                          <th className="bg-[#faf8f4] px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">
                            Score
                          </th>
                          <th className="bg-[#faf8f4] px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {profileLoading ? (
                          <tr>
                            <td colSpan={5} className="px-3 py-4 text-center text-xs text-[#a09080]">
                              Loading appointment history...
                            </td>
                          </tr>
                        ) : profileHistory.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-3 py-4 text-center text-xs text-[#a09080]">
                              No appointments found.
                            </td>
                          </tr>
                        ) : (
                          profileHistory.map((entry) => {
                            const feedback = feedbackByAppointment.get(entry.id);
                            return (
                              <tr key={entry.id}>
                                <td className="border-b border-[#f0ede6] px-2.5 py-2.5 text-[12.5px] text-[#a09080]">
                                  {toDateLabel(entry.starts_at)}
                                </td>
                                <td className="border-b border-[#f0ede6] px-2.5 py-2.5 text-[12.5px] text-[#2c2416]">
                                  {entry.therapists?.full_name ?? "Unknown"}
                                </td>
                                <td className="border-b border-[#f0ede6] px-2.5 py-2.5 text-[12.5px] text-[#2c2416]">
                                  {entry.therapies?.name ?? "Therapy Session"}
                                </td>
                                <td className="border-b border-[#f0ede6] px-2.5 py-2.5 text-[12.5px]">
                                  <span className="display-heading text-[#c8993a]">
                                    {typeof feedback?.rating === "number" ? feedback.rating.toFixed(1) : "—"}
                                  </span>
                                </td>
                                <td className="border-b border-[#f0ede6] px-2.5 py-2.5 text-[12.5px]">
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${getHistoryStatusTone(entry.status)}`}
                                  >
                                    <span className="size-1.5 rounded-full bg-current" />
                                    {entry.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-[#ede8dc] bg-[#fdfcf9] px-6 py-3.5">
                <button
                  type="button"
                  onClick={handleBookSession}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#ddd8cc] bg-white px-3.5 py-2 text-[12px] font-medium text-[#2c2416] transition hover:bg-[#f0ede6]"
                >
                  <CalendarDays className="size-3.5" />
                  Book session
                </button>
                <button
                  type="button"
                  onClick={handleEditPatient}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#2c2416] bg-[#2c2416] px-3.5 py-2 text-[12px] font-medium text-[#f7f4ee] transition hover:border-[#c8993a] hover:bg-[#c8993a]"
                >
                  <SquarePen className="size-3.5" />
                  Edit patient
                </button>
                <div className="flex-1" />
                {/* <button
                  type="button"
                  onClick={handleFlagForReview}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#f5dede] bg-white px-3.5 py-2 text-[12px] font-medium text-[#b85555] transition hover:bg-[#f5dede]"
                >
                  <Flag className="size-3.5" />
                  Flag for review
                </button> */}
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default function PatientsPage() {
  return (
    <Suspense fallback={<div>Loading patients...</div>}>
      <PatientsContent />
    </Suspense>
  );
}
