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
    franchise_id?: string;
    full_name?: string;
    email?: string;
    specialty?: string;
    license_no?: string;
    status?: string;
  };

  const payload = {
    id: body.id?.trim(),
    franchise_id: body.franchise_id?.trim(),
    full_name: body.full_name?.trim(),
    email: body.email?.trim(),
    specialty: body.specialty?.trim(),
    license_no: body.license_no?.trim(),
    status: body.status?.trim() || "active",
  };

  if (
    !payload.id ||
    !payload.franchise_id ||
    !payload.full_name ||
    !payload.email ||
    !payload.specialty ||
    !payload.license_no
  ) {
    return NextResponse.json(
      { message: "Missing therapist payload fields." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("therapists")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
