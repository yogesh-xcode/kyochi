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
    address?: string;
    city?: string;
    region?: string;
    phone?: string;
    whatsapp?: string;
  };

  const payload = {
    id: body.id?.trim(),
    name: body.name?.trim(),
    address: body.address?.trim(),
    city: body.city?.trim(),
    region: body.region?.trim(),
    phone: body.phone?.trim(),
    whatsapp: body.whatsapp?.trim(),
  };

  if (
    !payload.id ||
    !payload.name ||
    !payload.address ||
    !payload.city ||
    !payload.region ||
    !payload.phone ||
    !payload.whatsapp
  ) {
    return NextResponse.json(
      { message: "Missing franchise payload fields." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("franchises")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
