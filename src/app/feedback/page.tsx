"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Lock, Pencil, Plus, Printer, Trash2 } from "lucide-react";

import { type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";
import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBootstrapData } from "@/lib/data/useBootstrapData";
import { buildFeedbackKpis } from "@/lib/metrics";
import { resolveUserContext } from "@/lib/roleScope";
import { supabase } from "@/lib/supabase/client";
import { triggerWellnessRecalculation } from "@/lib/wellnessRecalcClient";
import {
  type FeedbackFieldType,
  defaultOptionsForField,
  groupSchemaQuestionsByStep,
  resolveTherapyFeedbackSchema,
  toReadableQuestionLabel,
} from "@/lib/therapyFeedbackSchema";

type FeedbackRecord = {
  id: string;
  appointment_id: string;
  patient_id: string;
  therapist_id: string;
  franchise_id: string;
  invoice_id: string | null;
  rating: number | null;
  notes: unknown | null;
  feedback_payload: Record<string, unknown> | null;
  attachment_path: string | null;
  status: "pending" | "completed";
  submitted_at: string | null;
  patients?: { full_name?: string | null } | null;
  therapists?: { full_name?: string | null } | null;
  appointments?: { starts_at?: string | null; therapy_id?: string | null } | null;
};

type FlashState = {
  tone: "success" | "error";
  message: string;
};

type StepDirection = "next" | "back";

type FeedbackAnswers = Record<string, unknown>;

const toDateLabel = (isoDate: string | null | undefined) => {
  if (!isoDate) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate));
};

const toStarLabel = (rating: number | null) => {
  if (rating == null) {
    return "—";
  }
  const safe = Math.max(1, Math.min(5, rating));
  return `${"★".repeat(safe)}${"☆".repeat(5 - safe)} (${safe})`;
};

const toImportDateLabel = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const dmy = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmy) {
    return `${dmy[1]}/${dmy[2]}/${dmy[3]}`;
  }

  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return `${iso[3]}/${iso[2]}/${iso[1]}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
};

const parseRatingValue = (value: string) => {
  const normalized = value.replace(/[^0-9]/g, "");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 5) {
    return null;
  }
  return parsed;
};

const withinThirtyMinutes = (submittedAt: string | null) => {
  if (!submittedAt) {
    return true;
  }
  const diffMs = Date.now() - new Date(submittedAt).getTime();
  return diffMs < 30 * 60 * 1000;
};

const getDefaultAnswerForType = (type: FeedbackFieldType) => {
  if (type === "range") {
    return 5;
  }
  if (type === "multiselect" || type === "checkbox") {
    return [] as string[];
  }
  if (type === "boolean") {
    return false;
  }
  return "";
};

const deriveRatingFromAnswers = (answers: FeedbackAnswers) => {
  const scoredEntries = Object.entries(answers)
    .filter(([key, value]) => key.toLowerCase().includes("score") && typeof value === "number")
    .map(([, value]) => Number(value));

  const baseScore = scoredEntries.length > 0
    ? scoredEntries.reduce((sum, value) => sum + value, 0) / scoredEntries.length
    : 6;

  const normalized = baseScore > 5 ? Math.round(baseScore / 2) : Math.round(baseScore);
  return Math.max(1, Math.min(5, normalized));
};

const parseNotesAsJson = (notes: unknown | null): FeedbackAnswers => {
  if (!notes || typeof notes !== "object" || Array.isArray(notes)) {
    return {};
  }
  return notes as FeedbackAnswers;
};

const isSingleSelectFieldType = (type: FeedbackFieldType) =>
  type === "radio" || type === "dropdown" || type === "boolean";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export default function FeedbackPage() {
  const { data, isLoading: isBootstrapLoading } = useBootstrapData();
  const context = resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  });

  const role = context.role;
  const franchiseId = context.franchiseId;
  const therapistId = context.therapistId;
  const patientId = context.patientId;

  const [feedbackRows, setFeedbackRows] = useState<FeedbackRecord[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState<FeedbackRecord | null>(null);
  const [feedbackStep, setFeedbackStep] = useState(0);
  const [stepDirection, setStepDirection] = useState<StepDirection>("next");
  const [answers, setAnswers] = useState<FeedbackAnswers>({});
  const [finalRating, setFinalRating] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<FlashState | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const patientByName = useMemo(
    () => new Map(data.patients.map((row) => [row.full_name.toLowerCase(), row.id])),
    [data.patients],
  );
  const therapistByName = useMemo(
    () => new Map(data.therapists.map((row) => [row.full_name.toLowerCase(), row.id])),
    [data.therapists],
  );

  const appointmentById = useMemo(
    () => new Map(data.appointments.map((appointment) => [appointment.id, appointment])),
    [data.appointments],
  );

  const therapyById = useMemo(
    () => new Map(data.therapies.map((therapy) => [therapy.id, therapy])),
    [data.therapies],
  );
  const manualCandidateAppointments = useMemo(
    () =>
      data.appointments.filter((appointment) => {
        if (appointment.status !== "completed") {
          return false;
        }
        if (role === "admin") {
          return true;
        }
        if (role === "franchisee") {
          return appointment.franchise_id === franchiseId;
        }
        return (
          appointment.franchise_id === franchiseId &&
          appointment.therapist_id === therapistId
        );
      }),
    [data.appointments, franchiseId, role, therapistId],
  );
  const manualPatientOptions = useMemo(
    () =>
      Array.from(
        new Set(
          manualCandidateAppointments.map(
            (appointment) =>
              data.patients.find((patient) => patient.id === appointment.patient_id)?.full_name ?? "Unknown",
          ),
        ),
      ).filter((name) => name !== "Unknown"),
    [data.patients, manualCandidateAppointments],
  );
  const manualTherapistOptions = useMemo(
    () =>
      Array.from(
        new Set(
          manualCandidateAppointments.map(
            (appointment) =>
              data.therapists.find((therapist) => therapist.id === appointment.therapist_id)?.full_name ?? "Unknown",
          ),
        ),
      ).filter((name) => name !== "Unknown"),
    [data.therapists, manualCandidateAppointments],
  );

  const activeAppointment = useMemo(() => {
    if (!activeFeedback) {
      return null;
    }
    return appointmentById.get(activeFeedback.appointment_id) ?? null;
  }, [activeFeedback, appointmentById]);

  const activeTherapy = useMemo(() => {
    if (!activeAppointment) {
      return null;
    }
    return therapyById.get(activeAppointment.therapy_id) ?? null;
  }, [activeAppointment, therapyById]);

  const activeQuestionSchema = useMemo(
    () =>
      resolveTherapyFeedbackSchema({
        therapyName: activeTherapy?.name ?? "Relaxation",
        feedbackSchema: activeTherapy?.feedback_schema ?? null,
      }),
    [activeTherapy?.feedback_schema, activeTherapy?.name],
  );

  const questionSteps = useMemo(
    () => groupSchemaQuestionsByStep(activeQuestionSchema),
    [activeQuestionSchema],
  );

  const ratingStepIndex = questionSteps.length + 1;
  const successStepIndex = questionSteps.length + 2;
  const totalSteps = successStepIndex + 1;

  const activeSessionCount = useMemo(() => {
    if (!activeFeedback) {
      return 0;
    }
    return data.appointments.filter((entry) => entry.patient_id === activeFeedback.patient_id).length;
  }, [activeFeedback, data.appointments]);

  const activePatientWellness = useMemo(() => {
    if (!activeFeedback) {
      return 0;
    }
    const patient = data.patients.find((entry) => entry.id === activeFeedback.patient_id);
    return Number(patient?.wellness_score ?? 0);
  }, [activeFeedback, data.patients]);

  const progressWidth = totalSteps > 1 ? (feedbackStep / (totalSteps - 1)) * 100 : 0;
  const suggestedRating = deriveRatingFromAnswers(answers);
  const stepMotionClass =
    stepDirection === "back"
      ? "animate-in slide-in-from-left-10 fade-in-0 duration-300"
      : "animate-in slide-in-from-right-10 fade-in-0 duration-300";

  const activeQuestionStep =
    feedbackStep > 0 && feedbackStep <= questionSteps.length
      ? questionSteps[feedbackStep - 1]
      : null;

  const isLastQuestionStep = feedbackStep === questionSteps.length;

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

  const loadFeedback = useCallback(async () => {
    if (!supabase) {
      return;
    }

    let query = supabase
      .from("feedback")
      .select(`
        id,
        appointment_id,
        patient_id,
        therapist_id,
        franchise_id,
        invoice_id,
        rating,
        notes,
        feedback_payload,
        attachment_path,
        status,
        submitted_at,
        patients(full_name),
        therapists(full_name),
        appointments(starts_at, therapy_id)
      `)
      .order("id", { ascending: false });

    if (role === "franchisee") {
      query = query.eq("franchise_id", franchiseId);
    }
    if (role === "therapist") {
      query = query.eq("therapist_id", therapistId).eq("franchise_id", franchiseId);
    }
    if (role === "patient") {
      query = query.eq("patient_id", patientId);
    }

    const { data: rows, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    setFeedbackRows((rows ?? []) as FeedbackRecord[]);
  }, [franchiseId, patientId, role, therapistId]);

  useEffect(() => {
    let active = true;
    void loadFeedback()
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Failed to load feedback.";
        showError(message);
      })
      .finally(() => {
        if (active) {
          setIsPageLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [loadFeedback, showError]);

  const closeFeedbackSheet = useCallback(() => {
    setSheetOpen(false);
    setActiveFeedback(null);
    setFeedbackStep(0);
    setStepDirection("next");
    setAnswers({});
    setFinalRating(null);
  }, []);

  const goToStep = useCallback((nextStep: number, direction: StepDirection = "next") => {
    setStepDirection(direction);
    setFeedbackStep(Math.max(0, Math.min(totalSteps - 1, nextStep)));
  }, [totalSteps]);

  const openFeedbackSheet = useCallback(
    (entry: FeedbackRecord) => {
      const schema = resolveTherapyFeedbackSchema({
        therapyName:
          therapyById.get(
            appointmentById.get(entry.appointment_id)?.therapy_id ?? "",
          )?.name ?? "Relaxation",
        feedbackSchema:
          therapyById.get(
            appointmentById.get(entry.appointment_id)?.therapy_id ?? "",
          )?.feedback_schema ?? null,
      });

      const initialAnswers = Object.fromEntries(
        Object.entries(schema).map(([fieldKey, fieldType]) => [fieldKey, getDefaultAnswerForType(fieldType)]),
      );
      const mergedAnswers = {
        ...initialAnswers,
        ...parseNotesAsJson(entry.notes),
        ...(entry.feedback_payload ?? {}),
      };

      setActiveFeedback(entry);
      setAnswers(mergedAnswers);
      setFinalRating(entry.rating ?? deriveRatingFromAnswers(mergedAnswers));
      setFeedbackStep(0);
      setStepDirection("next");
      setSheetOpen(true);
    },
    [appointmentById, therapyById],
  );

  const setAnswerValue = useCallback(
    ({ fieldKey, value, fieldType }: { fieldKey: string; value: unknown; fieldType: FeedbackFieldType }) => {
      setAnswers((previous) => ({
        ...previous,
        [fieldKey]: value,
      }));

      if (!activeQuestionStep || activeQuestionStep.fields.length !== 1 || !isSingleSelectFieldType(fieldType)) {
        return;
      }

      const nextStep = Math.min(successStepIndex, feedbackStep + 1);
      if (nextStep !== feedbackStep) {
        goToStep(nextStep, "next");
      }
    },
    [activeQuestionStep, feedbackStep, goToStep, successStepIndex],
  );

  const submitFeedback = useCallback(async () => {
    if (!supabase || !activeFeedback) {
      return;
    }
    if (!finalRating || finalRating < 1 || finalRating > 5) {
      showError("Please provide final session rating.");
      return;
    }

    setSaving(true);
    try {
      const payloadAnswers = {
        ...answers,
        final_rating: finalRating,
      };
      const updatePayload = {
        rating: finalRating,
        notes: payloadAnswers,
        feedback_payload: payloadAnswers,
        status: "completed" as const,
        submitted_at: new Date().toISOString(),
      };

      const token = (await supabase.auth.getSession())?.data.session?.access_token;
      const response = await fetch(`/api/feedback/${encodeURIComponent(activeFeedback.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(payload.message ?? "Failed to save feedback.");
      }

      await loadFeedback();
      goToStep(successStepIndex, "next");
      showSuccess("Feedback saved successfully.");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to save feedback.");
    } finally {
      setSaving(false);
    }
  }, [
    activeFeedback,
    answers,
    finalRating,
    goToStep,
    loadFeedback,
    showError,
    showSuccess,
    successStepIndex,
  ]);

  const printFeedbackDetails = useCallback((entry: FeedbackRecord) => {
    if (typeof window === "undefined") {
      return;
    }

    const patientName = entry.patients?.full_name ?? "Unknown";
    const therapistName = entry.therapists?.full_name ?? "Unknown";
    const sessionDate = toDateLabel(entry.appointments?.starts_at ?? null);
    const rating = toStarLabel(entry.rating);
    const submittedAt = toDateLabel(entry.submitted_at);
    const status = entry.status;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) {
      iframe.remove();
      return;
    }

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Feedback Print</title>
          <style>
            * { box-sizing: border-box; font-family: "Manrope", sans-serif; }
            body { margin: 0; padding: 18px; background: #ffffff; color: #2c2519; }
            .sheet { border: 1px solid #efe5c9; border-radius: 12px; overflow: hidden; max-width: 720px; margin: 0 auto; }
            .header { padding: 14px 16px; background: linear-gradient(90deg, #f8edd3 0%, #fff8e9 100%); border-bottom: 1px solid #efe5c9; }
            .title { margin: 0; font-size: 18px; font-weight: 700; }
            .subtitle { margin-top: 4px; font-size: 11px; color: #7a6b4f; letter-spacing: 0.08em; text-transform: uppercase; }
            .content { padding: 14px 16px 16px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
            .item { border: 1px solid #efe5c9; border-radius: 10px; background: #fffef8; padding: 8px 10px; }
            .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7a5b; margin-bottom: 3px; }
            .value { font-size: 14px; font-weight: 600; color: #2c2519; }
            .footer { margin-top: 12px; font-size: 11px; color: #8a7a5b; text-align: right; }
            @media print {
              body { padding: 0; }
              .sheet { border: 0; border-radius: 0; max-width: none; }
            }
          </style>
        </head>
        <body>
          <main class="sheet">
            <section class="header">
              <h1 class="title">Feedback Details</h1>
              <p class="subtitle">Kyochi Intelligence</p>
            </section>
            <section class="content">
              <div class="grid">
                <div class="item"><div class="label">Feedback ID</div><div class="value">${escapeHtml(entry.id)}</div></div>
                <div class="item"><div class="label">Status</div><div class="value">${escapeHtml(status)}</div></div>
                <div class="item"><div class="label">Patient</div><div class="value">${escapeHtml(patientName)}</div></div>
                <div class="item"><div class="label">Therapist</div><div class="value">${escapeHtml(therapistName)}</div></div>
                <div class="item"><div class="label">Session Date</div><div class="value">${escapeHtml(sessionDate)}</div></div>
                <div class="item"><div class="label">Rating</div><div class="value">${escapeHtml(rating)}</div></div>
                <div class="item"><div class="label">Submitted On</div><div class="value">${escapeHtml(submittedAt)}</div></div>
                <div class="item"><div class="label">Appointment ID</div><div class="value">${escapeHtml(entry.appointment_id)}</div></div>
              </div>
              <p class="footer">Printed on ${escapeHtml(new Date().toLocaleString("en-IN"))}</p>
            </section>
          </main>
        </body>
      </html>
    `);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      window.setTimeout(() => iframe.remove(), 600);
    };
  }, []);

  const deleteFeedback = useCallback(
    async (feedbackId: string) => {
      if (!supabase) {
        showError("Supabase client is not available.");
        return;
      }
      try {
        const response = await fetch(`/api/feedback/${feedbackId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete feedback.");
        }

        showSuccess("Feedback deleted successfully.");
        await loadFeedback(); // Reload feedback data
      } catch (error) {
        showError(error instanceof Error ? error.message : "Failed to delete feedback.");
      }
    },
    [loadFeedback, showError, showSuccess],
  );


  const tableConfig = tableViewConfigs.feedback;
  const roleScopeLabel =
    role === "admin" ? "All Branches" : role === "franchisee" ? "Own Branch" : "Own Feedback";
  const kpis = useMemo(
    () => buildFeedbackKpis({ feedback: feedbackRows, roleScopeLabel, role }),
    [feedbackRows, roleScopeLabel, role],
  );

  const rows: KyochiTableRow[] = useMemo(
    () =>
      feedbackRows.map((entry) => {
        const patientName = entry.patients?.full_name ?? "Unknown";
        const therapistName = entry.therapists?.full_name ?? "Unknown";
        const appointmentDate = toDateLabel(entry.appointments?.starts_at);
        const ratingText = toStarLabel(entry.rating);

        const canTherapistEdit =
          role === "therapist" &&
          entry.status === "completed" &&
          withinThirtyMinutes(entry.submitted_at);

        const actions = (
          <div className="inline-flex items-center gap-1">
            {entry.status === "pending" && (role === "therapist" || role === "patient" || role === "admin") ? (
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => openFeedbackSheet(entry)}
              >
                <Plus className="size-3.5" />
                {role === "patient" ? "Submit" : "Record"}
              </Button>
            ) : null}

            {role === "patient" ? (
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                aria-label="Print Feedback"
                title="Print Feedback"
                onClick={() => {
                  printFeedbackDetails(entry);
                }}
              >
                <Printer className="size-3.5" />
              </Button>
            ) : null}

            {entry.status === "completed" && (role === "admin" || role === "franchisee") ? (
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                aria-label="Edit Feedback"
                title="Edit Feedback"
                onClick={() => openFeedbackSheet(entry)}
              >
                <Pencil className="size-3.5" />
              </Button>
            ) : null}

            {role === "admin" ? (
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                aria-label="Delete Feedback"
                title="Delete Feedback"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this feedback?")) {
                    void deleteFeedback(entry.id);
                  }
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
            ) : null}

            {entry.status === "completed" && role === "therapist" && canTherapistEdit ? (
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                aria-label="Edit Feedback"
                title="Edit Feedback"
                onClick={() => openFeedbackSheet(entry)}
              >
                <Pencil className="size-3.5" />
              </Button>
            ) : null}

            {entry.status === "completed" && role === "therapist" && !canTherapistEdit ? (
              <span
                className="inline-flex items-center justify-center rounded-md border border-[var(--k-color-border-soft)] bg-[#f7f4ea] p-1.5 text-[#8b7a55]"
                title="Edit window closed (30 min limit)"
                aria-label="Edit window closed (30 min limit)"
              >
                <Lock className="size-3.5" />
              </span>
            ) : null}
          </div>
        );

        return {
          id: entry.id,
          actions,
          sortValues: [
            patientName,
            therapistName,
            appointmentDate,
            entry.rating ?? -1,
            entry.status,
          ],
          cells: [
            patientName,
            therapistName,
            appointmentDate,
            ratingText,
            <StatusPill key={`${entry.id}-status`} status={entry.status} />,
          ],
        };
      }),
    [feedbackRows, openFeedbackSheet, printFeedbackDetails, role],
  );

  const persistManualOrImportedFeedback = useCallback(
    async ({ values }: { values: string[] }) => {
      if (!supabase) {
        throw new Error("Supabase client is not available.");
      }

      const patientName = (values[0] ?? "").trim();
      const therapistName = (values[1] ?? "").trim();
      const appointmentDateText = (values[2] ?? "").trim();
      const ratingText = (values[3] ?? "").trim();
      const statusText = (values[4] ?? "").trim().toLowerCase();

      const patientId = patientByName.get(patientName.toLowerCase());
      const therapistRef = therapistByName.get(therapistName.toLowerCase());
      const appointmentDateLabel = toImportDateLabel(appointmentDateText);

      if (!patientId || !therapistRef || !appointmentDateLabel) {
        throw new Error("Patient, therapist, and appointment date are required.");
      }

      const rating = parseRatingValue(ratingText);
      const resolvedStatus = statusText === "pending" ? "pending" : "completed";

      const matchingAppointments = manualCandidateAppointments.filter(
        (entry) =>
          entry.patient_id === patientId &&
          entry.therapist_id === therapistRef &&
          toDateLabel(entry.starts_at) === appointmentDateLabel,
      );

      if (matchingAppointments.length === 0) {
        throw new Error("No matching completed appointment found for patient, therapist, and date.");
      }

      const appointment =
        matchingAppointments.find(
          (entry) => !feedbackRows.some((feedback) => feedback.appointment_id === entry.id),
        ) ?? matchingAppointments[0];

      const existing = feedbackRows.find((entry) => entry.appointment_id === appointment.id);
      const submittedAt = resolvedStatus === "completed" ? new Date().toISOString() : null;

      if (existing) {
        let updateQuery = supabase
          .from("feedback")
          .update({
            rating: resolvedStatus === "completed" ? rating : null,
            status: resolvedStatus,
            notes: null,
            submitted_at: submittedAt,
          })
          .eq("id", existing.id);

        if (role === "therapist") {
          updateQuery = updateQuery
            .eq("therapist_id", therapistId)
            .eq("franchise_id", franchiseId);
        }

        const { error: updateError } = await updateQuery;
        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const nextId = `fb-${appointment.id}-${Date.now().toString().slice(-4)}`.toLowerCase();
        const { error: insertError } = await supabase.from("feedback").insert({
          id: nextId,
          appointment_id: appointment.id,
          franchise_id: appointment.franchise_id,
          patient_id: appointment.patient_id,
          therapist_id: appointment.therapist_id,
          rating: resolvedStatus === "completed" ? rating : null,
          status: resolvedStatus,
          notes: null,
          feedback_payload: null,
          submitted_at: submittedAt,
          invoice_id: null,
          session_date: appointment.starts_at,
          attachment_path: null,
        });

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      if (resolvedStatus === "completed") {
        await triggerWellnessRecalculation(appointment.patient_id).catch(() => {
          // Non-blocking: feedback capture succeeded; wellness recompute can retry later.
        });
      }
      await loadFeedback();
    },
    [
      data.appointments,
      data.patients,
      data.therapists,
      feedbackRows,
      franchiseId,
      loadFeedback,
      manualCandidateAppointments,
      patientByName,
      role,
      therapistByName,
      therapistId,
    ],
  );

  return (
    <>
      {flash ? (
        <div className="fixed right-5 top-20 z-[80]">
          <div
            className={`rounded-xl border px-3 py-2 text-sm shadow-sm ${flash.tone === "success"
                ? "border-[#86efac] bg-[#f0fdf4] text-[#166534]"
                : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
              }`}
          >
            {flash.message}
          </div>
        </div>
      ) : null}

      <ManagementPageLayout
        title="Feedback"
        searchPlaceholder="Search feedback..."
        kpis={kpis}
        columns={tableConfig.columns}
        centeredBodyColumns={tableConfig.centeredBodyColumns}
        rows={rows}
        showAddAction={false}
        addActionLabel="Record"
        createSheetTitle="Record Feedback"
        showUploadAction={role !== "patient"}
        uploadActionLabel="Import"
        onCreateRow={role === "patient" ? undefined : persistManualOrImportedFeedback}
        enableRowEdit={false}
        enableRowDelete={false}
        enableBulkDelete={false}
        showSelection={false}
        optimisticMutations={false}
        isLoading={isBootstrapLoading || isPageLoading}
        formFieldConfigs={{
          Patient: {
            type: "typeahead",
            options: manualPatientOptions,
            placeholder: "Type patient name...",
            debounceMs: 250,
          },
          Therapist: {
            type: "select",
            options: manualTherapistOptions,
          },
          "Appointment Date": {
            type: "date",
          },
          Rating: {
            type: "select",
            options: ["5", "4", "3", "2", "1"],
          },
          Status: {
            type: "select",
            options: ["completed", "pending"],
            defaultValue: "completed",
          },
        }}
      />

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeFeedbackSheet();
            return;
          }
          setSheetOpen(true);
        }}
      >
        <SheetContent side="center" className="w-[min(94vw,36rem)] overflow-hidden p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>
              {activeFeedback?.status === "pending" ? "Record Feedback" : "Edit Feedback"}
            </SheetTitle>
            <SheetDescription>Therapist session feedback workflow.</SheetDescription>
          </SheetHeader>

          <div className="bg-[#faf7f2]">
            <div className="h-[2px] w-full bg-[#e8dece]">
              <div
                className="h-full bg-gradient-to-r from-[#c9a96e] to-[#e8c97a] transition-all duration-300"
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            <div className="bg-[#1c1610] px-5 pb-5 pt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">
                {feedbackStep === 0
                  ? "Session Review"
                  : feedbackStep === successStepIndex
                    ? "Done"
                    : feedbackStep === ratingStepIndex
                      ? "Final Rating"
                    : `Question ${feedbackStep} of ${questionSteps.length}`}
              </p>
              <h3 className="mt-1 font-[var(--font-display)] text-[26px] italic leading-tight text-[#f5ede0]">
                {feedbackStep === successStepIndex
                  ? "Thank You"
                  : feedbackStep === 0
                    ? activeTherapy?.name ?? "Therapy"
                    : feedbackStep === ratingStepIndex
                      ? "Rate this session"
                    : toReadableQuestionLabel(activeQuestionStep?.fields?.[0]?.[0] ?? "Question")}
              </h3>
              {feedbackStep < successStepIndex ? (
                <p className="mt-1 text-[11px] text-[#b7a080]">
                  {toDateLabel(activeFeedback?.appointments?.starts_at ?? null)} ·{" "}
                  {activeFeedback?.therapists?.full_name ?? "Therapist"}
                </p>
              ) : null}
            </div>

            <div className="min-h-[340px] px-5 pb-5 pt-5">
              <div key={`feedback-step-${feedbackStep}`} className={stepMotionClass}>
                {feedbackStep === 0 ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#e8dece] bg-white p-4">
                      <p className="text-sm font-semibold text-[#2a1f14]">{activeFeedback?.patients?.full_name ?? "Patient"}</p>
                      <p className="mt-1 text-xs text-[#9a8570]">
                        Session documented by {activeFeedback?.therapists?.full_name ?? "therapist"}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-[#e8dece] bg-white px-2 py-3 text-center">
                        <p className="font-[var(--font-display)] text-2xl text-[#2a1f14]">{activeSessionCount}</p>
                        <p className="mt-1 text-[10px] text-[#b0977a]">Sessions done</p>
                      </div>
                      <div className="rounded-xl border border-[#e8dece] bg-white px-2 py-3 text-center">
                        <p className="font-[var(--font-display)] text-2xl text-[#2a1f14]">{activePatientWellness.toFixed(1)}</p>
                        <p className="mt-1 text-[10px] text-[#b0977a]">Avg wellness</p>
                      </div>
                      <div className="rounded-xl border border-[#e8dece] bg-white px-2 py-3 text-center">
                        <p className="font-[var(--font-display)] text-2xl text-[#3d6b3a]">{finalRating ?? suggestedRating}/5</p>
                        <p className="mt-1 text-[10px] text-[#b0977a]">Draft rating</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => goToStep(1, "next")}
                      className="h-10 w-full border-none bg-[#1c1610] text-[#e8c97a] hover:bg-[#2b2219]"
                    >
                      Start session feedback
                    </Button>
                    <button
                      type="button"
                      className="w-full text-center text-[11px] text-[#b0977a]"
                      onClick={closeFeedbackSheet}
                    >
                      Close draft
                    </button>
                  </div>
                ) : null}

                {activeQuestionStep ? (
                  <div className="space-y-5">
                    {activeQuestionStep.fields.map(([fieldKey, fieldType]) => {
                      const label = toReadableQuestionLabel(fieldKey);
                      const fieldValue = answers[fieldKey] ?? getDefaultAnswerForType(fieldType);
                      const options = defaultOptionsForField(fieldKey);

                      if (fieldType === "range") {
                        const numeric = typeof fieldValue === "number" ? fieldValue : 5;
                        return (
                          <div key={fieldKey} className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-[#7a6548]">
                              <span>{label}</span>
                              <span className="font-[var(--font-display)] text-xl text-[#c9a96e]">{numeric}</span>
                            </div>
                            <input
                              type="range"
                              min={1}
                              max={10}
                              step={1}
                              value={numeric}
                              onChange={(event) =>
                                setAnswerValue({
                                  fieldKey,
                                  value: Number(event.target.value),
                                  fieldType,
                                })
                              }
                              className="h-1 w-full accent-[#c9a96e]"
                            />
                          </div>
                        );
                      }

                      if (fieldType === "text") {
                        return (
                          <div key={fieldKey} className="space-y-1">
                            <label className="block text-xs text-[#7a6548]">{label}</label>
                            <textarea
                              value={typeof fieldValue === "string" ? fieldValue : ""}
                              onChange={(event) =>
                                setAnswerValue({
                                  fieldKey,
                                  value: event.target.value,
                                  fieldType,
                                })
                              }
                              placeholder={`Enter ${label.toLowerCase()}...`}
                              className="min-h-[90px] w-full rounded-xl border border-[#ddd0bb] bg-white px-3 py-2 text-sm text-[#2a1f14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e]/40"
                            />
                          </div>
                        );
                      }

                      if (fieldType === "date") {
                        return (
                          <Field key={fieldKey} className="gap-2">
                            <FieldLabel
                              className="text-[11px] tracking-[0.1em] text-[#7a6548]"
                              htmlFor={`feedback-date-${fieldKey}`}
                            >
                              {label}
                            </FieldLabel>
                            <DatePickerInput
                              id={`feedback-date-${fieldKey}`}
                              value={typeof fieldValue === "string" ? fieldValue : ""}
                              onChange={(nextValue) =>
                                setAnswerValue({
                                  fieldKey,
                                  value: nextValue,
                                  fieldType,
                                })
                              }
                              className="h-10 rounded-xl border-[#ddd0bb] bg-white px-3 text-sm text-[#2a1f14] focus-visible:border-[#c9a96e] focus-visible:ring-[#c9a96e]/40"
                            />
                          </Field>
                        );
                      }

                      if (fieldType === "boolean") {
                        const boolValue = Boolean(fieldValue);
                        return (
                          <div key={fieldKey} className="space-y-2">
                            <p className="text-xs text-[#7a6548]">{label}</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { key: "yes", label: "Yes", value: true },
                                { key: "no", label: "No", value: false },
                              ].map((item) => (
                                <button
                                  key={`${fieldKey}-${item.key}`}
                                  type="button"
                                  onClick={() =>
                                    setAnswerValue({
                                      fieldKey,
                                      value: item.value,
                                      fieldType,
                                    })
                                  }
                                  className={`rounded-xl border px-3 py-2 text-sm ${boolValue === item.value
                                      ? "border-[#c9a96e] bg-[#fdf5e8] text-[#2a1f14]"
                                      : "border-[#ddd0bb] bg-white text-[#3a2e1f]"
                                    }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      if (fieldType === "multiselect" || fieldType === "checkbox") {
                        const values = Array.isArray(fieldValue) ? (fieldValue as string[]) : [];
                        return (
                          <div key={fieldKey} className="space-y-2">
                            <p className="text-xs text-[#7a6548]">{label}</p>
                            <div className="space-y-1.5">
                              {options.map((option) => {
                                const selected = values.includes(option);
                                return (
                                  <button
                                    key={`${fieldKey}-${option}`}
                                    type="button"
                                    onClick={() => {
                                      const next = selected
                                        ? values.filter((entry) => entry !== option)
                                        : [...values, option];
                                      setAnswerValue({ fieldKey, value: next, fieldType });
                                    }}
                                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${selected
                                        ? "border-[#c9a96e] bg-[#fdf5e8] text-[#2a1f14]"
                                        : "border-[#ddd0bb] bg-white text-[#3a2e1f]"
                                      }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (fieldType === "dropdown") {
                        return (
                          <div key={fieldKey} className="space-y-1">
                            <label className="block text-xs text-[#7a6548]">{label}</label>
                            <select
                              value={typeof fieldValue === "string" ? fieldValue : ""}
                              onChange={(event) =>
                                setAnswerValue({
                                  fieldKey,
                                  value: event.target.value,
                                  fieldType,
                                })
                              }
                              className="h-10 w-full rounded-xl border border-[#ddd0bb] bg-white px-3 text-sm text-[#2a1f14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e]/40"
                            >
                              <option value="">Select</option>
                              {options.map((option) => (
                                <option key={`${fieldKey}-${option}`} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }

                      return (
                        <div key={fieldKey} className="space-y-2">
                          <p className="text-xs text-[#7a6548]">{label}</p>
                          <div className="space-y-1.5">
                            {options.map((option) => (
                              <button
                                key={`${fieldKey}-${option}`}
                                type="button"
                                onClick={() =>
                                  setAnswerValue({
                                    fieldKey,
                                    value: option,
                                    fieldType,
                                  })
                                }
                                className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${String(fieldValue) === option
                                    ? "border-[#c9a96e] bg-[#fdf5e8] text-[#2a1f14]"
                                    : "border-[#ddd0bb] bg-white text-[#3a2e1f]"
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <div className="rounded-lg bg-[#eef4fb] px-3 py-2 text-[11px] text-[#5a7fa0]">
                      Responses will be stored as structured therapist feedback for this session.
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => goToStep(Math.max(0, feedbackStep - 1), "back")}
                        className="h-10 flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          goToStep(feedbackStep + 1, "next");
                        }}
                        disabled={saving}
                        className="h-10 flex-[1.8]"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                ) : null}

                {feedbackStep === ratingStepIndex ? (
                  <div className="space-y-5">
                    <p className="text-[12px] text-[#7a6548]">
                      Set final therapist rating for this session.
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {([1, 2, 3, 4, 5] as const).map((value) => (
                        <button
                          key={`rating-${value}`}
                          type="button"
                          onClick={() => setFinalRating(value)}
                          className={`rounded-xl border px-3 py-2 text-sm font-semibold ${finalRating === value
                              ? "border-[#c9a96e] bg-[#fdf5e8] text-[#2a1f14]"
                              : "border-[#ddd0bb] bg-white text-[#3a2e1f]"
                            }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <div className="rounded-lg bg-[#eef4fb] px-3 py-2 text-[11px] text-[#5a7fa0]">
                      This value is written directly to the dedicated rating column.
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => goToStep(Math.max(0, feedbackStep - 1), "back")}
                        className="h-10 flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          void submitFeedback();
                        }}
                        disabled={saving}
                        className="h-10 flex-[1.8]"
                      >
                        {saving ? "Saving..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {feedbackStep === successStepIndex ? (
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#c9a96e] text-lg text-[#c9a96e]">
                      ✓
                    </div>
                    <div>
                      <p className="font-[var(--font-display)] text-[30px] italic text-[#2a1f14]">Thank you</p>
                      <p className="mt-1 text-xs text-[#9a8570]">
                        Feedback logged for {activeTherapy?.name ?? "this therapy"}.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-[#e8dece] bg-white py-3">
                        <p className="font-[var(--font-display)] text-2xl text-[#2a1f14]">{questionSteps.length}</p>
                        <p className="text-[10px] text-[#b0977a]">Prompts</p>
                      </div>
                      <div className="rounded-xl border border-[#e8dece] bg-white py-3">
                        <p className="font-[var(--font-display)] text-2xl text-[#2a1f14]">{Object.keys(answers).length}</p>
                        <p className="text-[10px] text-[#b0977a]">Responses</p>
                      </div>
                      <div className="rounded-xl border border-[#e8dece] bg-white py-3">
                        <p className="font-[var(--font-display)] text-2xl text-[#2a1f14]">{finalRating ?? suggestedRating}/5</p>
                        <p className="text-[10px] text-[#b0977a]">Rating</p>
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={closeFeedbackSheet} className="h-10 w-full">
                      Return to feedback list
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            {feedbackStep < successStepIndex ? (
              <div className="flex justify-center gap-1.5 px-5 pb-4">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <span
                    key={`step-dot-${index}`}
                    className={`h-1.5 rounded-full transition-all ${index === feedbackStep ? "w-4 bg-[#c9a96e]" : "w-1.5 bg-[#e0d4c0]"}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
