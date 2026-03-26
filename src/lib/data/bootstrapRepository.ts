import {
  createSupabaseClient,
  hasSupabaseConfig,
  supabase as defaultSupabase,
} from "@/lib/supabase/client";
import type {
  AppUserRow,
  AppointmentRow,
  BillingRow,
  BootstrapData,
  FeedbackRow,
  FranchiseRow,
  NotificationRow,
  PatientRow,
  TherapistRow,
  TherapyRow,
} from "@/lib/supabase/types";

const emptySupabase = (): BootstrapData => ({
  franchises: [],
  patients: [],
  therapists: [],
  therapies: [],
  appointments: [],
  billing: [],
  feedback: [],
  users: [],
  current_user: null,
  notifications: [],
  source: "supabase",
});

export const loadBootstrapData = async ({
  accessToken,
}: {
  accessToken?: string;
} = {}): Promise<BootstrapData> => {
  if (!accessToken || accessToken.length === 0) {
    return emptySupabase();
  }

  const supabaseClient =
    accessToken && accessToken.length > 0
      ? createSupabaseClient(accessToken)
      : defaultSupabase;

  if (!hasSupabaseConfig || !supabaseClient) {
    return emptySupabase();
  }

  try {
    const [{ data: currentRole }] = await Promise.all([supabaseClient.rpc("current_app_role")]);
    const isPatientRole = currentRole === "patient";
    const [
      franchises,
      patients,
      therapists,
      therapies,
      appointments,
      billing,
      feedback,
      users,
      notifications,
    ] = await Promise.all([
      supabaseClient.from("franchises").select("*").order("id"),
      supabaseClient.from("patients").select("*").order("id"),
      isPatientRole
        ? supabaseClient
            .from("therapists_patient_view")
            .select("*")
            .order("id")
        : supabaseClient.from("therapists").select("*").order("id"),
      supabaseClient.from("therapies").select("*").order("id"),
      supabaseClient.from("appointments").select("*").order("starts_at"),
      supabaseClient.from("billing").select("*").order("id"),
      supabaseClient.from("feedback").select("*").order("id"),
      supabaseClient.from("app_users").select("*").order("id"),
      supabaseClient.from("notifications").select("*").order("id"),
    ]);

    const hasError = [
      franchises.error,
      patients.error,
      therapists.error,
      therapies.error,
      appointments.error,
      billing.error,
      feedback.error,
      users.error,
      notifications.error,
    ].some(Boolean);

    if (hasError) {
      return emptySupabase();
    }

    const snapshot = {
      franchises: (franchises.data ?? []) as FranchiseRow[],
      patients: (patients.data ?? []) as PatientRow[],
      therapists: (therapists.data ?? []) as TherapistRow[],
      therapies: (therapies.data ?? []) as TherapyRow[],
      appointments: (appointments.data ?? []) as AppointmentRow[],
      billing: (billing.data ?? []) as BillingRow[],
      feedback: (feedback.data ?? []) as FeedbackRow[],
      users: (users.data ?? []) as AppUserRow[],
      current_user: null,
      notifications: (notifications.data ?? []) as NotificationRow[],
    };

    // Keep response shape stable when Supabase returns no visible rows
    // (for example, empty datasets or restrictive policies).
    const isEffectivelyEmpty =
      snapshot.franchises.length === 0 &&
      snapshot.patients.length === 0 &&
      snapshot.therapists.length === 0 &&
      snapshot.therapies.length === 0 &&
      snapshot.appointments.length === 0 &&
      snapshot.billing.length === 0 &&
      snapshot.feedback.length === 0 &&
      snapshot.users.length === 0 &&
      snapshot.notifications.length === 0 &&
      snapshot.current_user === null;

    if (isEffectivelyEmpty) {
      return emptySupabase();
    }

    return {
      ...snapshot,
      source: "supabase",
    };
  } catch {
    return emptySupabase();
  }
};
