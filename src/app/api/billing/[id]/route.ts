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
    appointment_id?: string;
    patient_id?: string;
    amount?: number;
    currency?: string;
    due_date?: string;
    status?: string;
  };

  const payload: Record<string, string | number> = {};
  if (body.appointment_id !== undefined) payload.appointment_id = body.appointment_id;
  if (body.patient_id !== undefined) payload.patient_id = body.patient_id;
  if (body.amount !== undefined) payload.amount = Number(body.amount);
  if (body.currency !== undefined) payload.currency = body.currency;
  if (body.due_date !== undefined) payload.due_date = body.due_date;
  if (body.status !== undefined) payload.status = body.status;

  if (!id || Object.keys(payload).length === 0) {
    return NextResponse.json({ message: "Missing billing update payload." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("billing")
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
    return NextResponse.json({ message: "Missing billing id." }, { status: 400 });
  }

  const { error } = await supabase.from("billing").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
