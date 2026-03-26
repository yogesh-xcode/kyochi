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
    phone?: string;
    dob?: string;
    wellness_score?: number;
    status?: string;
  };

  const payload = {
    id: body.id?.trim(),
    franchise_id: body.franchise_id?.trim(),
    full_name: body.full_name?.trim(),
    email: body.email?.trim(),
    phone: body.phone?.trim(),
    dob: body.dob?.trim() || new Date().toISOString().slice(0, 10),
    wellness_score: 0,
    status: body.status?.trim() || "active",
  };

  if (!payload.id || !payload.franchise_id || !payload.full_name || !payload.email || !payload.phone) {
    return NextResponse.json(
      { message: "Missing patient payload fields." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("patients")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 400;
    return NextResponse.json({ message: error.message }, { status });
  }
  return NextResponse.json(data, { status: 201 });
}
