import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getSupabaseOrError } from "@/app/api/_shared/supabase";

const generatePatientId = () => {
  const stamp = Date.now().toString().slice(-8);
  const rand = Math.floor(10 + Math.random() * 90);
  return `PAT${stamp}${rand}`;
};

const createServiceClient = () => {
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

const findPatientByEmail = async (
  supabase: any,
  email: string,
): Promise<
  | {
      id: string;
      franchise_id: string;
      full_name: string;
      email: string;
      phone: string;
      dob: string;
    }
  | null
> => {
  const lowered = email.trim().toLowerCase();
  if (!lowered) {
    return null;
  }

  const { data, error } = await supabase
    .from("patients")
    .select("id, franchise_id, full_name, email, phone, dob")
    .ilike("email", lowered)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as {
    id: string;
    franchise_id: string;
    full_name: string;
    email: string;
    phone: string;
    dob: string;
  } | null;
};

export async function GET(request: Request) {
  const result = getSupabaseOrError(request);
  if ("error" in result) {
    return result.error;
  }

  const { supabase } = result;
  const { data: role } = await supabase.rpc("current_app_role");
  if (role !== "patient") {
    return NextResponse.json({ message: "Patient role only." }, { status: 403 });
  }

  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { data: appUser, error: appUserError } = await supabase
    .from("app_users")
    .select("id, full_name, email, patient_id, franchise_id")
    .eq("auth_user_id", authUser.user.id)
    .maybeSingle();

  if (appUserError || !appUser) {
    return NextResponse.json({ message: "App user mapping not found." }, { status: 404 });
  }

  const needsProfile = !appUser.patient_id;
  return NextResponse.json(
    {
      needsProfile,
      user: {
        full_name: appUser.full_name,
        email: appUser.email,
        patient_id: appUser.patient_id,
        franchise_id: appUser.franchise_id,
      },
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  const result = getSupabaseOrError(request);
  if ("error" in result) {
    return result.error;
  }

  const { supabase } = result;
  const service = createServiceClient();
  if (!service) {
    return NextResponse.json({ message: "Service role is not configured." }, { status: 500 });
  }

  const { data: role } = await supabase.rpc("current_app_role");
  if (role !== "patient") {
    return NextResponse.json({ message: "Patient role only." }, { status: 403 });
  }

  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    full_name?: string;
    phone?: string;
    dob?: string;
  };

  const fullName = body.full_name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const dob = body.dob?.trim() ?? "";

  const { data: appUser, error: appUserError } = await service
    .from("app_users")
    .select("id, email, full_name, patient_id, franchise_id")
    .eq("auth_user_id", authUser.user.id)
    .maybeSingle();

  if (appUserError || !appUser) {
    return NextResponse.json({ message: "App user mapping not found." }, { status: 404 });
  }

  if (appUser.patient_id) {
    return NextResponse.json({ patient_id: appUser.patient_id }, { status: 200 });
  }

  const matchedPatient = await findPatientByEmail(service, appUser.email);
  if (matchedPatient) {
    const updatePatientPayload: Record<string, string> = {};
    if (!matchedPatient.full_name && fullName) {
      updatePatientPayload.full_name = fullName;
    }
    if ((!matchedPatient.phone || matchedPatient.phone.trim().length === 0) && phone) {
      updatePatientPayload.phone = phone;
    }
    if (!matchedPatient.dob && dob) {
      updatePatientPayload.dob = dob;
    }

    if (Object.keys(updatePatientPayload).length > 0) {
      const { error: patchPatientError } = await service
        .from("patients")
        .update(updatePatientPayload)
        .eq("id", matchedPatient.id);

      if (patchPatientError) {
        return NextResponse.json({ message: patchPatientError.message }, { status: 400 });
      }
    }

    const { error: linkError } = await service
      .from("app_users")
      .update({
        patient_id: matchedPatient.id,
        franchise_id: null,
        full_name: fullName || appUser.full_name,
      })
      .eq("id", appUser.id);

    if (linkError) {
      return NextResponse.json({ message: linkError.message }, { status: 400 });
    }

    return NextResponse.json({ patient_id: matchedPatient.id }, { status: 200 });
  }

  if (!fullName || !phone || !dob) {
    return NextResponse.json(
      { message: "Full name, phone, and DOB are required." },
      { status: 400 },
    );
  }

  let resolvedFranchiseId = appUser.franchise_id;
  if (!resolvedFranchiseId) {
    const { data: fallbackFranchise, error: fallbackFranchiseError } = await service
      .from("franchises")
      .select("id")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fallbackFranchiseError || !fallbackFranchise?.id) {
      return NextResponse.json({ message: "Unable to resolve franchise." }, { status: 400 });
    }

    resolvedFranchiseId = fallbackFranchise.id;
  }

  let patientId = generatePatientId();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const { error: patientInsertError } = await service.from("patients").insert({
      id: patientId,
      franchise_id: resolvedFranchiseId,
      full_name: fullName,
      email: appUser.email,
      phone,
      dob,
      wellness_score: 0,
      status: "active",
    });

    if (!patientInsertError) {
      break;
    }

    if (patientInsertError.code === "23505") {
      patientId = generatePatientId();
      continue;
    }

    return NextResponse.json({ message: patientInsertError.message }, { status: 400 });
  }

  const { error: linkError } = await service
    .from("app_users")
    .update({
      patient_id: patientId,
      franchise_id: null,
      full_name: fullName,
    })
    .eq("id", appUser.id);

  if (linkError) {
    return NextResponse.json({ message: linkError.message }, { status: 400 });
  }

  return NextResponse.json({ patient_id: patientId }, { status: 200 });
}
