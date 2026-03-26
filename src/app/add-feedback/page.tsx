"use client";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";
import { useBootstrapData } from "@/lib/data/useBootstrapData";
import {
  resolveUserContext,
  scopeAppointmentsByRole,
} from "@/lib/roleScope";
import { supabase } from "@/lib/supabase/client";
import { triggerWellnessRecalculation } from "@/lib/wellnessRecalcClient";

const toStatus = (status: string) => {
  if (status === "completed") {
    return "Completed" as const;
  }
  if (status === "in_progress") {
    return "In Progress" as const;
  }
  return "Waiting" as const;
};

const toDateTimeLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const generateFeedbackId = (appointmentId: string) =>
  `fb-${appointmentId}-${Date.now().toString().slice(-4)}`.toLowerCase();

export default function AddFeedbackPage() {
  const { data, reload, isLoading } = useBootstrapData();
  const context = resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  });
  const role = context.role;
  const therapistId = context.therapistId;
  const patientId = context.patientId;
  const franchiseId = context.franchiseId;
  if (role === "patient") {
    return null;
  }
  const patientById = new Map(data.patients.map((patient) => [patient.id, patient]));
  const therapistById = new Map(
    data.therapists.map((therapist) => [therapist.id, therapist]),
  );
  const scopedAppointments = scopeAppointmentsByRole(
    data.appointments,
    role,
    therapistId,
    patientId,
    franchiseId,
  );
  const appointmentById = new Map(scopedAppointments.map((entry) => [entry.id, entry]));
  const existingFeedbackByAppointmentId = new Map(
    data.feedback.map((entry) => [entry.appointment_id, entry]),
  );
  const completedCount = scopedAppointments.filter((appointment) => appointment.status === "completed").length;
  const pendingFeedbackCount = scopedAppointments.length - completedCount;

  const persistFeedbackCapture = async ({ values }: { values: string[] }) => {
    if (!supabase) {
      throw new Error("Supabase client is not available.");
    }

    const appointmentId = (values[0] ?? "").trim();
    const statusText = (values[4] ?? "").trim().toLowerCase();
    const nextStatus = statusText === "completed" ? "completed" : "pending";

    const appointment = appointmentById.get(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found in current scope.");
    }

    const submittedAt = nextStatus === "completed" ? new Date().toISOString() : null;
    const existing = existingFeedbackByAppointmentId.get(appointmentId);

    if (existing) {
      const { error: updateError } = await supabase
        .from("feedback")
        .update({
          status: nextStatus,
          submitted_at: submittedAt,
        })
        .eq("id", existing.id);
      if (updateError) {
        throw new Error(updateError.message);
      }
    } else {
      const nextId = generateFeedbackId(appointmentId);
      const { error: insertError } = await supabase.from("feedback").insert({
        id: nextId,
        appointment_id: appointment.id,
        franchise_id: appointment.franchise_id,
        patient_id: appointment.patient_id,
        therapist_id: appointment.therapist_id,
        invoice_id: null,
        session_date: appointment.starts_at,
        rating: null,
        status: nextStatus,
        notes: null,
        submitted_at: submittedAt,
        attachment_path: null,
      });
      if (insertError) {
        throw new Error(insertError.message);
      }
    }

    if (nextStatus === "completed") {
      await triggerWellnessRecalculation(appointment.patient_id).catch(() => {
        // Non-blocking: feedback capture succeeded; wellness recompute can retry later.
      });
    }
    await reload();
  };

  return (
    <ManagementPageLayout
      title="Add Feedback"
      searchPlaceholder="Search sessions for feedback..."
      addActionLabel="Capture Feedback"
      createSheetTitle="Capture Feedback"
      kpis={[
        {
          label: "Visible Sessions",
          value: scopedAppointments.length.toString(),
          delta: role === "therapist" ? "Assigned" : "Network",
          helper: "Sessions available for feedback capture",
        },
        {
          label: "Completed Sessions",
          value: completedCount.toString(),
          delta: "Ready",
          helper: "Completed sessions ready for notes",
        },
        {
          label: "Pending Feedback",
          value: pendingFeedbackCount.toString(),
          delta: pendingFeedbackCount > 0 ? "Queue" : "Clear",
          helper: "Sessions still awaiting feedback",
        },
        {
          label: "Active Scope",
          value: role === "therapist" ? therapistId : "All",
          delta: "Role",
          helper: "Current role data visibility",
        },
      ]}
      columns={["Appointment ID", "Patient", "Therapist", "Session Date", "Status"]}
      centeredBodyColumns={[0, 4]}
      onCreateRow={persistFeedbackCapture}
      optimisticMutations={false}
      formFieldConfigs={{
        "Appointment ID": {
          type: "typeahead",
          options: scopedAppointments.map((entry) => entry.id),
          placeholder: "Type appointment id...",
          debounceMs: 250,
        },
        Patient: {
          type: "typeahead",
          options: Array.from(
            new Set(scopedAppointments.map((entry) =>
              patientById.get(entry.patient_id)?.full_name ?? "Unknown",
            )),
          ),
          placeholder: "Patient name",
          debounceMs: 250,
        },
        Therapist: {
          type: "select",
          options: Array.from(
            new Set(scopedAppointments.map((entry) =>
              therapistById.get(entry.therapist_id)?.full_name ?? "Unknown",
            )),
          ),
        },
        "Session Date": {
          type: "date",
        },
        Status: {
          type: "select",
          options: ["completed", "pending"],
          defaultValue: "completed",
        },
      }}
      isLoading={isLoading}
      rows={scopedAppointments.map((appointment) => ({
        id: appointment.id,
        cells: [
          appointment.id,
          patientById.get(appointment.patient_id)?.full_name ?? "Unknown",
          therapistById.get(appointment.therapist_id)?.full_name ?? "Unknown",
          toDateTimeLabel(appointment.starts_at),
          <StatusPill key={`${appointment.id}-status`} status={toStatus(appointment.status)} />,
        ],
      }))}
    />
  );
}
