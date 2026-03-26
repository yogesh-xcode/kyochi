import { NextResponse } from "next/server";

import { createSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";

const getAccessToken = (request: Request) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return undefined;
  }
  return authHeader.slice("Bearer ".length).trim();
};

const toNextTherapistId = (ids: string[]) => {
  const max = ids.reduce((acc, id) => {
    const parsed = Number(id.replace(/^THR/i, ""));
    return Number.isFinite(parsed) ? Math.max(acc, parsed) : acc;
  }, 0);
  return `THR${String(max + 1).padStart(2, "0")}`;
};

export async function POST(request: Request) {
  const accessToken = getAccessToken(request);
  const supabase = createSupabaseClient(accessToken);

  if (!hasSupabaseConfig || !supabase) {
    return NextResponse.json(
      { message: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const { data: role } = await supabase.rpc("current_app_role");
  if (role !== "admin") {
    return NextResponse.json({ message: "Admin only." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    requestId?: string;
    role?: "therapist" | "franchisee" | "admin";
    therapistId?: string;
    createNewTherapist?: boolean;
    franchiseId?: string | null;
  };

  if (!body.requestId || !body.role) {
    return NextResponse.json({ message: "Missing request fields." }, { status: 400 });
  }

  const { data: reqRow, error: reqError } = await supabase
    .from("access_requests")
    .select("*")
    .eq("id", body.requestId)
    .single();

  if (reqError || !reqRow) {
    return NextResponse.json({ message: "Request not found." }, { status: 404 });
  }

  if (reqRow.status !== "pending") {
    return NextResponse.json(
      { message: "Request is already processed." },
      { status: 409 },
    );
  }

  const { data: adminUserId } = await supabase.rpc("current_app_user_id");

  let assignedTherapistId: string | null = null;
  const targetFranchiseId =
    body.franchiseId ?? reqRow.requested_franchise_id ?? "FR01";

  if (body.role === "therapist") {
    assignedTherapistId = body.therapistId?.trim() || null;

    if (body.createNewTherapist || !assignedTherapistId) {
      const { data: existingTherapists } = await supabase
        .from("therapists")
        .select("id");
      assignedTherapistId = toNextTherapistId(
        (existingTherapists ?? []).map((row) => row.id),
      );

      const { error: therapistCreateError } = await supabase.from("therapists").insert({
        id: assignedTherapistId,
        franchise_id: targetFranchiseId,
        full_name: reqRow.requester_name,
        email: reqRow.requester_email,
        specialty: "General Reflexology",
        license_no: `AUTO-${assignedTherapistId}`,
        status: "active",
      });

      if (therapistCreateError) {
        return NextResponse.json(
          { message: therapistCreateError.message },
          { status: 400 },
        );
      }
    }
  }

  const { error: userUpdateError } = await supabase
    .from("app_users")
    .update({
      role: body.role,
      franchise_id: body.role === "admin" ? null : targetFranchiseId,
      therapist_id: body.role === "therapist" ? assignedTherapistId : null,
      status: "active",
    })
    .eq("id", reqRow.requester_user_id);

  if (userUpdateError) {
    return NextResponse.json({ message: userUpdateError.message }, { status: 400 });
  }

  const { error: requestUpdateError } = await supabase
    .from("access_requests")
    .update({
      status: "approved",
      assigned_role: body.role,
      assigned_therapist_id: assignedTherapistId,
      decided_by_user_id: adminUserId,
      decided_at: new Date().toISOString(),
    })
    .eq("id", reqRow.id);

  if (requestUpdateError) {
    return NextResponse.json(
      { message: requestUpdateError.message },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      message: "Access request approved.",
      assignedRole: body.role,
      assignedTherapistId,
    },
    { status: 200 },
  );
}
