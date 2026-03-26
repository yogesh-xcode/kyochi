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
    name?: string;
    category?: string;
    duration_min?: number;
    session_count?: number;
    status?: string;
    description?: string;
    feedback_schema?: Record<string, string> | null;
  };

  const payload: Record<string, string | number | Record<string, string> | null> = {};
  if (body.name !== undefined) payload.name = body.name;
  if (body.category !== undefined) payload.category = body.category;
  if (body.duration_min !== undefined) payload.duration_min = Number(body.duration_min);
  if (body.session_count !== undefined) payload.session_count = Number(body.session_count);
  if (body.status !== undefined) payload.status = body.status;
  if (body.description !== undefined) payload.description = body.description;
  if (body.feedback_schema !== undefined) payload.feedback_schema = body.feedback_schema;

  if (!id || Object.keys(payload).length === 0) {
    return NextResponse.json({ message: "Missing therapy update payload." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("therapies")
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
    return NextResponse.json({ message: "Missing therapy id." }, { status: 400 });
  }

  const { error } = await supabase.from("therapies").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
