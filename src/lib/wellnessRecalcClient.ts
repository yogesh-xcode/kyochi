import { supabase } from "@/lib/supabase/client";

export const triggerWellnessRecalculation = async (patientId: string) => {
  if (!patientId) {
    return;
  }

  const token = (await supabase?.auth.getSession())?.data.session?.access_token;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  await fetch("/api/wellness-score/recalculate", {
    method: "POST",
    headers,
    body: JSON.stringify({ patient_id: patientId }),
  });
};

