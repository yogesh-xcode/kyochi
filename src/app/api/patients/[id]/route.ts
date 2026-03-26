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
    phone?: string;
    dob?: string;
    status?: string;
  };

  const payload: Record<string, string | number> = {};
  if (body.franchise_id !== undefined) payload.franchise_id = body.franchise_id;
  if (body.full_name !== undefined) payload.full_name = body.full_name;
  if (body.email !== undefined) payload.email = body.email;
  if (body.phone !== undefined) payload.phone = body.phone;
  if (body.dob !== undefined) payload.dob = body.dob;
  if (body.status !== undefined) payload.status = body.status;

  if (!id || Object.keys(payload).length === 0) {
    return NextResponse.json({ message: "Missing patient update payload." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("patients")
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
    return NextResponse.json({ message: "Missing patient id." }, { status: 400 });
  }

  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
