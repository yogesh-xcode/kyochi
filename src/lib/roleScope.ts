import appointmentsData from "@/data/appointments.json";
import type { UserRole } from "@/types";

const DEFAULT_THERAPIST_ID = "THR01";

export const getActiveRole = (): UserRole => {
  const role = process.env.NEXT_PUBLIC_KYOCHI_ROLE;
  if (role === "therapist" || role === "franchisee") {
    return role;
  }
  return "admin";
};

export const getActiveTherapistId = () =>
  process.env.NEXT_PUBLIC_KYOCHI_THERAPIST_ID ?? DEFAULT_THERAPIST_ID;

export const scopeAppointmentsByRole = <T extends { therapist_id: string }>(
  rows: T[],
  role: UserRole,
  therapistId: string,
) => {
  if (role !== "therapist") {
    return rows;
  }
  return rows.filter((row) => row.therapist_id === therapistId);
};

export const getScopedPatientIdsForTherapist = (
  therapistId: string,
): Set<string> =>
  new Set(
    appointmentsData
      .filter((appointment) => appointment.therapist_id === therapistId)
      .map((appointment) => appointment.patient_id),
  );
