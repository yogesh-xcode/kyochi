"use client";

import appointmentsData from "@/data/appointments.json";
import patientsData from "@/data/patients.json";
import therapistsData from "@/data/therapists.json";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";
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

const toDateLabel = (isoDate: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate));

const toTimeLabel = (isoDate: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoDate));

export default function AppointmentsPage() {
  const role = getActiveRole();
  const therapistId = getActiveTherapistId();
  const scopedAppointments = scopeAppointmentsByRole(appointmentsData, role, therapistId);
  const completedCount = scopedAppointments.filter((appointment) => appointment.status === "completed").length;
  const inProgressCount = scopedAppointments.filter((appointment) => appointment.status === "in_progress").length;
  const waitingCount = scopedAppointments.filter((appointment) => appointment.status === "waiting").length;
  const completionRate =
    scopedAppointments.length > 0 ? Math.round((completedCount / scopedAppointments.length) * 100) : 0;
  const tableConfig = tableViewConfigs.appointments;

  return (
    <ManagementPageLayout
      title="Appointment Schedule"
      searchPlaceholder="Search appointments..."
      kpis={[
        { label: "Total Appointments", value: scopedAppointments.length.toString(), delta: "Live", helper: "All scheduled sessions" },
        { label: "Completed", value: completedCount.toString(), delta: `${completionRate}%`, helper: "Completion ratio across sessions" },
        { label: "In Progress", value: inProgressCount.toString(), delta: "Active", helper: "Sessions currently ongoing" },
        { label: "Waiting", value: waitingCount.toString(), delta: "Queue", helper: "Patients waiting for consultation" },
      ]}
      columns={tableConfig.columns}
      centeredBodyColumns={tableConfig.centeredBodyColumns}
      rows={scopedAppointments.map((appointment) => ({
        id: appointment.id,
        cells: [
          appointment.id,
          patientById.get(appointment.patient_id)?.full_name ?? "Unknown",
          therapistById.get(appointment.therapist_id)?.full_name ?? "Unknown",
          toDateLabel(appointment.starts_at),
          toTimeLabel(appointment.starts_at),
          <StatusPill key={`${appointment.id}-status`} status={toStatus(appointment.status)} />,
        ],
      }))}
    />
  );
}
