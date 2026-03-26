import type { AppCurrentUserRow, AppUserRow, AppointmentRow } from "@/lib/supabase/types";
import type { UserRole } from "@/types";

export type CurrentUserDisplay = {
  name: string;
  initials: string;
  role: UserRole;
};

export type UserScopeContext = {
  role: UserRole;
  userId: string;
  therapistId: string;
  patientId: string;
  franchiseId: string;
  user?: AppUserRow;
};

const isRole = (value: string | undefined | null): value is UserRole =>
  value === "admin" || value === "franchisee" || value === "therapist" || value === "patient";

export const resolveRole = (roleInput?: string | null): UserRole => {
  if (roleInput === "franchisee" || roleInput === "therapist" || roleInput === "patient") {
    return roleInput;
  }
  return "admin";
};

export const resolveUserContext = ({
  users,
  currentUser,
  authUserId,
}: {
  users: AppUserRow[];
  currentUser?: AppCurrentUserRow | null;
  authUserId?: string | null;
}): UserScopeContext => {
  const userById = new Map(users.map((user) => [user.id, user]));
  const userByAuthId =
    authUserId && authUserId.length > 0
      ? users.find((entry) => entry.auth_user_id === authUserId)
      : undefined;
  const userByCurrent =
    currentUser && currentUser.user_id
      ? userById.get(currentUser.user_id)
      : undefined;
  const user =
    userByAuthId ??
    userByCurrent ??
    (users.length === 1 ? users[0] : undefined);
  const userId = user?.id ?? "";

  const roleCandidate = user?.role ?? currentUser?.role ?? null;
  const role = isRole(roleCandidate) ? roleCandidate : "admin";

  const therapistId = user?.therapist_id ?? "";
  const patientId = user?.patient_id ?? "";
  const franchiseId = user?.franchise_id ?? "";

  return {
    role,
    userId,
    therapistId,
    patientId,
    franchiseId,
    user,
  };
};

export const toCurrentUserDisplay = (context: UserScopeContext): CurrentUserDisplay => {
  if (!context.user) {
    return {
      name: "Unknown User",
      initials: "UU",
      role: context.role,
    };
  }

  const initials = context.user.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    name: context.user.full_name,
    initials: initials || "UU",
    role: context.user.role,
  };
};

export const scopeRowsByFranchise = <T extends { franchise_id?: string }>(
  rows: T[],
  role: UserRole,
  franchiseId: string,
) => {
  if (role !== "franchisee") {
    return rows;
  }
  return rows.filter((row) => row.franchise_id === franchiseId);
};

export const scopeAppointmentsByRole = <
  T extends { therapist_id: string; patient_id?: string; franchise_id?: string },
>(
  rows: T[],
  role: UserRole,
  therapistId: string,
  patientId?: string,
  franchiseId?: string,
) => {
  if (role === "therapist") {
    return rows.filter((row) => row.therapist_id === therapistId);
  }
  if (role === "patient") {
    return rows.filter((row) => row.patient_id === patientId);
  }
  if (role === "franchisee") {
    return rows.filter((row) => row.franchise_id === franchiseId);
  }
  return rows;
};

export const getScopedPatientIdsForTherapist = (
  therapistId: string,
  appointments: AppointmentRow[],
): Set<string> =>
  new Set(
    appointments
      .filter((appointment) => appointment.therapist_id === therapistId)
      .map((appointment) => appointment.patient_id),
  );
