import { NextResponse } from "next/server";

import { createSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";

const getAccessToken = (request: Request) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return undefined;
  }
  return authHeader.slice("Bearer ".length).trim();
};

export async function GET(request: Request) {
  const accessToken = getAccessToken(request);
  const supabase = createSupabaseClient(accessToken);

  if (!hasSupabaseConfig || !supabase) {
    return NextResponse.json([], { status: 200 });
  }

  const { data, error } = await supabase
    .from("access_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(data ?? [], { status: 200 });
}

export async function POST(request: Request) {
  const accessToken = getAccessToken(request);
  const supabase = createSupabaseClient(accessToken);

  if (!hasSupabaseConfig || !supabase) {
    return NextResponse.json(
      { message: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    message?: string;
    requestedRole?: "therapist" | "franchisee";
  };

  const { data: me, error: meError } = await supabase
    .from("app_users")
    .select("id,full_name,email,role,franchise_id,therapist_id")
    .limit(1)
    .maybeSingle();

  if (meError || !me) {
    return NextResponse.json(
      { message: "Unable to resolve current user." },
      { status: 403 },
    );
  }

  const { data: existingPending } = await supabase
    .from("access_requests")
    .select("id")
    .eq("requester_user_id", me.id)
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();

  if (existingPending) {
    return NextResponse.json(
      { message: "A pending request already exists." },
      { status: 409 },
    );
  }

  const requestedRole = body.requestedRole ?? "therapist";
  const { data, error } = await supabase
    .from("access_requests")
    .insert({
      requester_user_id: me.id,
      requester_name: me.full_name,
      requester_email: me.email,
      requested_role: requestedRole,
      requested_franchise_id: me.franchise_id,
      status: "pending",
      message: body.message?.trim() ?? "",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
