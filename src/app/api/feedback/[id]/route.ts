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
    therapist_id?: string;
    session_date?: string | null;
    rating?: number | null;
    status?: string;
    notes?: unknown | null;
    feedback_payload?: Record<string, unknown> | null;
    attachment_path?: string | null;
  };

  const payload: Record<string, string | number | Record<string, unknown> | unknown | null> = {};
  if (body.appointment_id !== undefined) payload.appointment_id = body.appointment_id;
  if (body.patient_id !== undefined) payload.patient_id = body.patient_id;
  if (body.therapist_id !== undefined) payload.therapist_id = body.therapist_id;
  if (body.session_date !== undefined) payload.session_date = body.session_date;
  if (body.rating !== undefined) payload.rating = body.rating;
  if (body.status !== undefined) payload.status = body.status;
  if (body.notes !== undefined) payload.notes = body.notes;
  if (body.feedback_payload !== undefined) payload.feedback_payload = body.feedback_payload;
  if (body.attachment_path !== undefined) payload.attachment_path = body.attachment_path;

  // If feedback content is recorded but status is omitted, treat it as completed.
  if (
    payload.status === undefined &&
    (body.rating !== undefined || body.notes !== undefined || body.feedback_payload !== undefined)
  ) {
    payload.status = "completed";
  }

  if (!id || Object.keys(payload).length === 0) {
    return NextResponse.json({ message: "Missing feedback update payload." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("feedback")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const shouldRecompute =
    data?.patient_id &&
    (payload.status === "completed" || payload.rating !== undefined || payload.feedback_payload !== undefined);
  if (shouldRecompute) {
    try {
      const authHeader = request.headers.get("authorization");
      const origin = new URL(request.url).origin;
      await fetch(`${origin}/api/wellness-score/recalculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({ patient_id: data.patient_id }),
      });
    } catch {
      // Non-blocking: feedback update should not fail if recompute call fails.
    }
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
    return NextResponse.json({ message: "Missing feedback id." }, { status: 400 });
  }

  // Ensure only admins can delete feedback. RLS policy should also enforce this.
  const { error } = await supabase.from("feedback").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({ message: "Feedback deleted successfully." }, { status: 200 });
}
