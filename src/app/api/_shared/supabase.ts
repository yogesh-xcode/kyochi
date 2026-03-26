import { NextResponse } from "next/server";

import { createSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";

export const getAccessToken = (request: Request) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return undefined;
  }
  return authHeader.slice("Bearer ".length).trim();
};

export const getSupabaseOrError = (request: Request) => {
  const accessToken = getAccessToken(request);
  const supabase = createSupabaseClient(accessToken);
  if (!hasSupabaseConfig || !supabase) {
    return {
      error: NextResponse.json(
        { message: "Supabase is not configured." },
        { status: 500 },
      ),
    } as const;
  }
  return { supabase } as const;
};
