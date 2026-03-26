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
    address?: string;
    city?: string;
    region?: string;
    phone?: string;
    whatsapp?: string;
  };

  const payload: Record<string, string> = {};
  if (body.name !== undefined) payload.name = body.name;
  if (body.address !== undefined) payload.address = body.address;
  if (body.city !== undefined) payload.city = body.city;
  if (body.region !== undefined) payload.region = body.region;
  if (body.phone !== undefined) payload.phone = body.phone;
  if (body.whatsapp !== undefined) payload.whatsapp = body.whatsapp;

  if (!id || Object.keys(payload).length === 0) {
    return NextResponse.json({ message: "Missing franchise update payload." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("franchises")
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
    return NextResponse.json({ message: "Missing franchise id." }, { status: 400 });
  }

  const { error } = await supabase.from("franchises").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
