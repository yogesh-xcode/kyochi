import { NextResponse } from "next/server";

import { getSupabaseOrError } from "@/app/api/_shared/supabase";

export async function POST(request: Request) {
  const result = getSupabaseOrError(request);
  if ("error" in result) {
    return result.error;
  }
  const { supabase } = result;

  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    patient_id?: string;
    therapist_id?: string;
    therapy_id?: string;
    franchise_id?: string;
    starts_at?: string;
    status?: string;
  };

  const payload = {
    id: body.id,
    patient_id: body.patient_id,
    therapist_id: body.therapist_id,
    therapy_id: body.therapy_id,
    franchise_id: body.franchise_id,
    starts_at: body.starts_at,
    status: body.status,
  };

  if (
    !payload.id ||
    !payload.patient_id ||
    !payload.therapist_id ||
    !payload.therapy_id ||
    !payload.franchise_id ||
    !payload.starts_at ||
    !payload.status
  ) {
    return NextResponse.json(
      { message: "Missing appointment payload fields." },
      { status: 400 },
    );
  }

  const [{ data: role }, { data: patientId }] = await Promise.all([
    supabase.rpc("current_app_role"),
    supabase.rpc("current_app_patient_id"),
  ]);

  if (role === "patient") {
    if (!patientId || payload.patient_id !== patientId) {
      return NextResponse.json({ message: "Patients can create only their own appointments." }, { status: 403 });
    }
    if (payload.status !== "waiting") {
      return NextResponse.json({ message: "Patient appointments must start in waiting status." }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 400;
    return NextResponse.json({ message: error.message }, { status });
  }

  return NextResponse.json(data, { status: 201 });
}
