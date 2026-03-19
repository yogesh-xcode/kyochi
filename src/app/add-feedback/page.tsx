"use client";

import appointmentsData from "@/data/appointments.json";
import patientsData from "@/data/patients.json";
import therapistsData from "@/data/therapists.json";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";
import { getActiveRole, getActiveTherapistId, scopeAppointmentsByRole } from "@/lib/roleScope";

const patientById = new Map(patientsData.map((patient) => [patient.id, patient]));
const therapistById = new Map(therapistsData.map((therapist) => [therapist.id, therapist]));

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

export default function AddFeedbackPage() {
  const role = getActiveRole();
  const therapistId = getActiveTherapistId();
  const scopedAppointments = scopeAppointmentsByRole(appointmentsData, role, therapistId);
  const completedCount = scopedAppointments.filter((appointment) => appointment.status === "completed").length;
  const pendingFeedbackCount = scopedAppointments.length - completedCount;

  return (
    <ManagementPageLayout
      title="Add Feedback"
      searchPlaceholder="Search sessions for feedback..."
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
