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
    appointment_id?: string;
    franchise_id?: string;
    patient_id?: string;
    amount?: number;
    currency?: string;
    due_date?: string;
    status?: string;
  };

  const payload = {
    id: body.id?.trim(),
    appointment_id: body.appointment_id?.trim(),
    franchise_id: body.franchise_id?.trim(),
    patient_id: body.patient_id?.trim(),
    amount: Number(body.amount ?? 0),
    currency: body.currency?.trim() || "INR",
    due_date: body.due_date?.trim() || new Date().toISOString().slice(0, 10),
    status: body.status?.trim() || "due",
  };

  if (!payload.id || !payload.appointment_id || !payload.franchise_id || !payload.patient_id || Number.isNaN(payload.amount)) {
    return NextResponse.json(
      { message: "Missing billing payload fields." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("billing")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
