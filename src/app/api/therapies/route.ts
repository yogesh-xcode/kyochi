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
    name?: string;
    category?: string;
    duration_min?: number;
    session_count?: number;
    status?: string;
    description?: string;
    feedback_schema?: Record<string, string> | null;
  };

  const payload = {
    id: body.id?.trim(),
    name: body.name?.trim(),
    category: body.category?.trim(),
    duration_min: Number(body.duration_min ?? 45),
    session_count: Number(body.session_count ?? 1),
    status: body.status?.trim() || "active",
    description: body.description?.trim() || "",
    feedback_schema: body.feedback_schema ?? null,
  };

  if (!payload.id || !payload.name || !payload.category) {
    return NextResponse.json(
      { message: "Missing therapy payload fields." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("therapies")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
