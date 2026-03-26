import { NextResponse } from "next/server";

import { getSupabaseOrError } from "@/app/api/_shared/supabase";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Params) {
  const result = getSupabaseOrError(request);
  if ("error" in result) {
    return result.error;
  }
  const { supabase } = result;
  const { id } = await context.params;

  const body = (await request.json().catch(() => ({}))) as {
    franchise_id?: string;
    full_name?: string;
    email?: string;
    specialty?: string;
    license_no?: string;
    status?: string;
  };

  const payload: Record<string, string> = {};
  if (body.franchise_id !== undefined) payload.franchise_id = body.franchise_id;
  if (body.full_name !== undefined) payload.full_name = body.full_name;
  if (body.email !== undefined) payload.email = body.email;
  if (body.specialty !== undefined) payload.specialty = body.specialty;
  if (body.license_no !== undefined) payload.license_no = body.license_no;
  if (body.status !== undefined) payload.status = body.status;

  if (!id || Object.keys(payload).length === 0) {
    return NextResponse.json({ message: "Missing therapist update payload." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("therapists")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: Request, context: Params) {
  const result = getSupabaseOrError(request);
  if ("error" in result) {
    return result.error;
  }
  const { supabase } = result;
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ message: "Missing therapist id." }, { status: 400 });
  }

  const { error } = await supabase.from("therapists").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
