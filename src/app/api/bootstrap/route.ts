import { NextResponse } from "next/server";

import { loadBootstrapData } from "@/lib/data/bootstrapRepository";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : undefined;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }

  const data = await loadBootstrapData({ accessToken });
  return NextResponse.json(data, {
    status: 200,
    headers: {
      "cache-control": "no-store",
    },
  });
}
