"use client";

import appointmentsData from "@/data/appointments.json";
import patientsData from "@/data/patients.json";
import therapistsData from "@/data/therapists.json";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";

const patientById = new Map(patientsData.map((patient) => [patient.id, patient]));
const therapistById = new Map(therapistsData.map((therapist) => [therapist.id, therapist]));

const completedCount = appointmentsData.filter((appointment) => appointment.status === "completed").length;
const inProgressCount = appointmentsData.filter((appointment) => appointment.status === "in_progress").length;
const waitingCount = appointmentsData.filter((appointment) => appointment.status === "waiting").length;
const completionRate = Math.round((completedCount / appointmentsData.length) * 100);

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

export default function AppointmentsPage() {
  return (
    <ManagementPageLayout
      title="Appointment Schedule"
      searchPlaceholder="Search appointments..."
      kpis={[
        { label: "Total Appointments", value: appointmentsData.length.toString(), delta: "Live", helper: "All scheduled sessions" },
        { label: "Completed", value: completedCount.toString(), delta: `${completionRate}%`, helper: "Completion ratio across sessions" },
        { label: "In Progress", value: inProgressCount.toString(), delta: "Active", helper: "Sessions currently ongoing" },
        { label: "Waiting", value: waitingCount.toString(), delta: "Queue", helper: "Patients waiting for consultation" },
      ]}
      columns={["ID", "Patient", "Therapist", "Date & Time", "Status"]}
      centeredBodyColumns={[4]}
      rows={appointmentsData.map((appointment) => ({
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
