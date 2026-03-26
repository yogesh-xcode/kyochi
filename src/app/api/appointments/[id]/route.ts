import { NextResponse } from "next/server";
import { appendFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

import { createSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";

const getAccessToken = (request: Request) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return undefined;
  }
  return authHeader.slice("Bearer ".length).trim();
};

type Params = {
  params: Promise<{ id: string }>;
};

const logToSupaflow = async (event: string, payload: Record<string, unknown>) => {
  const logPath = path.join(process.cwd(), "supaflow.log");
  const line = `${new Date().toISOString()} ${event} ${JSON.stringify(payload)}\n`;
  try {
    await appendFile(logPath, line, "utf8");
  } catch {
    // Logging must never break API behavior.
  }
};

const createServiceSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export async function PATCH(request: Request, context: Params) {
  const accessToken = getAccessToken(request);
  const supabase = createSupabaseClient(accessToken);

  if (!hasSupabaseConfig || !supabase) {
    return NextResponse.json(
      { message: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    patient_id?: string;
    therapist_id?: string;
    therapy_id?: string;
    franchise_id?: string;
    starts_at?: string;
    status?: string;
  };

  if (!id) {
    return NextResponse.json({ message: "Missing appointment id." }, { status: 400 });
  }

  const payload = {
    patient_id: body.patient_id,
    therapist_id: body.therapist_id,
    therapy_id: body.therapy_id,
    franchise_id: body.franchise_id,
    starts_at: body.starts_at,
    status: body.status,
  };

  if (
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
    const { data: existingAppointment, error: existingAppointmentError } = await supabase
      .from("appointments")
      .select("id, patient_id, therapist_id, therapy_id, franchise_id, starts_at, status")
      .eq("id", id)
      .single();

    if (existingAppointmentError || !existingAppointment) {
      return NextResponse.json({ message: "Appointment not found." }, { status: 404 });
    }

    if (!patientId || existingAppointment.patient_id !== patientId || payload.patient_id !== patientId) {
      return NextResponse.json({ message: "Patients can edit only their own appointments." }, { status: 403 });
    }

    if (!["waiting", "scheduled"].includes(existingAppointment.status)) {
      return NextResponse.json({ message: "Only waiting or scheduled appointments can be rescheduled." }, { status: 403 });
    }

    if (
      payload.therapist_id !== existingAppointment.therapist_id ||
      payload.therapy_id !== existingAppointment.therapy_id ||
      payload.patient_id !== existingAppointment.patient_id ||
      payload.franchise_id !== existingAppointment.franchise_id
    ) {
      return NextResponse.json({ message: "Patients cannot modify appointment ownership fields." }, { status: 403 });
    }

    if (payload.status !== "waiting") {
      return NextResponse.json({ message: "Patient reschedule must keep status as waiting." }, { status: 400 });
    }

    if (payload.starts_at === existingAppointment.starts_at && existingAppointment.status === "waiting") {
      return NextResponse.json({ message: "No changes detected for reschedule." }, { status: 200 });
    }
  }

  const { data, error } = await supabase
    .from("appointments")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  // Workflow automation:
  // When an appointment is completed, ensure feedback (pending) and billing (unpaid)
  // records exist so therapist/admin can continue the closeout flow.
  if (payload.status === "completed") {
    const automationClient = createServiceSupabaseClient() ?? supabase;
    const [feedbackLookup, billingLookup] = await Promise.all([
      automationClient
        .from("feedback")
        .select("id")
        .eq("appointment_id", id)
        .maybeSingle(),
      automationClient
        .from("billing")
        .select("id")
        .eq("appointment_id", id)
        .maybeSingle(),
    ]);

    if (feedbackLookup.error) {
      return NextResponse.json({ message: feedbackLookup.error.message }, { status: 400 });
    }
    if (billingLookup.error) {
      return NextResponse.json({ message: billingLookup.error.message }, { status: 400 });
    }

    const { data: therapyRecord, error: therapyLookupError } = await automationClient
      .from("therapies")
      .select("price")
      .eq("id", payload.therapy_id)
      .maybeSingle();
    if (therapyLookupError) {
      return NextResponse.json({ message: therapyLookupError.message }, { status: 400 });
    }
    const amountFromTherapy = Number(therapyRecord?.price ?? 0);

    if (!billingLookup.data) {
      const fallbackBillingId = `in-${id}`.toLowerCase();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const { error: billingCreateError } = await automationClient
        .from("billing")
        .insert({
          id: fallbackBillingId,
          appointment_id: id,
          franchise_id: payload.franchise_id,
          patient_id: payload.patient_id,
          amount: Number.isFinite(amountFromTherapy) ? amountFromTherapy : 0,
          currency: "INR",
          due_date: dueDate.toISOString().slice(0, 10),
          status: "unpaid",
        });

      if (billingCreateError) {
        return NextResponse.json({ message: billingCreateError.message }, { status: 400 });
      }
    }

    if (!feedbackLookup.data) {
      const fallbackFeedbackId = `fb-${id}`.toLowerCase();
      const { error: feedbackCreateError } = await automationClient.from("feedback").insert({
        id: fallbackFeedbackId,
        appointment_id: id,
        franchise_id: payload.franchise_id,
        patient_id: payload.patient_id,
        therapist_id: payload.therapist_id,
        session_date: payload.starts_at,
        rating: null,
        status: "pending",
        notes: null,
        submitted_at: null,
      });

      if (feedbackCreateError) {
        return NextResponse.json({ message: feedbackCreateError.message }, { status: 400 });
      }
    }

    // Wellness score is AI-driven from recent feedback via /api/wellness-score/recalculate.
    // Do not overwrite it here with appointment completion ratio.
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: Request, context: Params) {
  const accessToken = getAccessToken(request);
  const supabase = createSupabaseClient(accessToken);

  if (!hasSupabaseConfig || !supabase) {
    await logToSupaflow("appointments.delete.config_error", {
      hasSupabaseConfig,
      hasClient: Boolean(supabase),
    });
    return NextResponse.json(
      { message: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const { id } = await context.params;
  if (!id) {
    await logToSupaflow("appointments.delete.bad_request", {
      reason: "missing_id",
    });
    return NextResponse.json({ message: "Missing appointment id." }, { status: 400 });
  }

  const { data: deletedFeedbackRows, error: feedbackDeleteError } = await supabase
    .from("feedback")
    .delete()
    .eq("appointment_id", id)
    .select("id");

  if (feedbackDeleteError) {
    await logToSupaflow("appointments.delete.feedback_error", {
      id,
      message: feedbackDeleteError.message,
      details: feedbackDeleteError.details,
      hint: feedbackDeleteError.hint,
      code: feedbackDeleteError.code,
    });
    return NextResponse.json(
      { message: `Failed to delete feedback rows: ${feedbackDeleteError.message}` },
      { status: 400 },
    );
  }

  await logToSupaflow("appointments.delete.feedback_deleted", {
    id,
    deletedCount: deletedFeedbackRows?.length ?? 0,
  });

  const { data: deletedBillingRows, error: billingDeleteError } = await supabase
    .from("billing")
    .delete()
    .eq("appointment_id", id)
    .select("id");

  if (billingDeleteError) {
    await logToSupaflow("appointments.delete.billing_error", {
      id,
      message: billingDeleteError.message,
      details: billingDeleteError.details,
      hint: billingDeleteError.hint,
      code: billingDeleteError.code,
    });
    return NextResponse.json(
      { message: `Failed to delete billing rows: ${billingDeleteError.message}` },
      { status: 400 },
    );
  }

  await logToSupaflow("appointments.delete.billing_deleted", {
    id,
    deletedCount: deletedBillingRows?.length ?? 0,
  });

  const [
    { count: remainingFeedbackCount, error: remainingFeedbackError },
    { count: remainingBillingCount, error: remainingBillingError },
  ] = await Promise.all([
    supabase
      .from("feedback")
      .select("id", { count: "exact", head: true })
      .eq("appointment_id", id),
    supabase
      .from("billing")
      .select("id", { count: "exact", head: true })
      .eq("appointment_id", id),
  ]);

  if (remainingFeedbackError || remainingBillingError) {
    await logToSupaflow("appointments.delete.dependency_check_error", {
      id,
      feedbackError: remainingFeedbackError?.message ?? null,
      billingError: remainingBillingError?.message ?? null,
    });
    return NextResponse.json(
      { message: "Failed to verify dependent rows before deleting appointment." },
      { status: 400 },
    );
  }

  if ((remainingFeedbackCount ?? 0) > 0 || (remainingBillingCount ?? 0) > 0) {
    await logToSupaflow("appointments.delete.blocked_by_dependencies", {
      id,
      remainingFeedbackCount: remainingFeedbackCount ?? 0,
      remainingBillingCount: remainingBillingCount ?? 0,
    });
    return NextResponse.json(
      {
        message:
          "Dependent billing/feedback rows are still present. Delete was likely blocked by RLS policies on child tables.",
      },
      { status: 403 },
    );
  }

  const { data: deletedAppointmentRows, error: appointmentDeleteError } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id)
    .select("id");

  if (appointmentDeleteError) {
    await logToSupaflow("appointments.delete.supabase_error", {
      id,
      message: appointmentDeleteError.message,
      details: appointmentDeleteError.details,
      hint: appointmentDeleteError.hint,
      code: appointmentDeleteError.code,
    });
    return NextResponse.json({ message: appointmentDeleteError.message }, { status: 400 });
  }

  if (!deletedAppointmentRows || deletedAppointmentRows.length === 0) {
    await logToSupaflow("appointments.delete.not_found_or_blocked", { id });
    return NextResponse.json(
      { message: "Delete did not affect any row. Record not found or access denied." },
      { status: 404 },
    );
  }

  await logToSupaflow("appointments.delete.success", {
    id,
    deletedAppointmentCount: deletedAppointmentRows.length,
    deletedBillingCount: deletedBillingRows?.length ?? 0,
    deletedFeedbackCount: deletedFeedbackRows?.length ?? 0,
  });
  return NextResponse.json({ ok: true }, { status: 200 });
}
