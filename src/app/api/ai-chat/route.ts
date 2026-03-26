import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getAccessToken, getSupabaseOrError } from "@/app/api/_shared/supabase";
import {
  buildContext,
  buildIlikeFilter,
  buildLocalFallbackSummary,
  FALLBACK_SUMMARY,
  GEMINI_MAX_ATTEMPTS,
  GEMINI_MODEL,
  GEMINI_TIMEOUT_MS,
  MAX_ROWS_PER_TABLE,
  NO_DATA_CONTEXT,
  normalizeAiResponse,
  parseGeminiJson,
  SEARCH_TABLES,
  type JsonRecord,
  type SearchTableConfig,
  type SimulatedAiResponse,
  toSearchTerms,
} from "@/lib/aiChat";

type TableSearchResult = {
  table: string;
  rows: JsonRecord[];
  error?: string;
};
type GeminiCallResult =
  | { ok: true; text: string }
  | { ok: false; error: string };
type AppRole = "admin" | "franchisee" | "therapist" | "patient";

const rolePrompts: Record<AppRole, string[]> = {
  admin: [
    "You are an AI assistant for Kyochi Wellness.",
    "Answer like a senior business advisor with full visibility across all franchises.",
    "Focus on operational performance, revenue trends, and strategic insights.",
  ],
  franchisee: [
    "You are an AI assistant for Kyochi Wellness.",
    "Answer like a business coach focused on this franchise's performance.",
    "Focus on local appointments, therapist performance, billing, and patient retention.",
  ],
  therapist: [
    "You are an AI assistant for Kyochi Wellness.",
    "Answer like a helpful clinical coordinator.",
    "Focus on appointments, patient sessions, feedback, and daily schedule.",
  ],
  patient: [
    "You are a wellness assistant for Kyochi Reflexology.",
    "Answer in a warm, friendly, and simple tone.",
    "Focus on the patient's own appointments, sessions, billing, and wellness progress.",
    "Never mention other patients or business metrics.",
  ],
};

const toAppRole = (value: unknown): AppRole =>
  value === "admin" || value === "franchisee" || value === "therapist" || value === "patient"
    ? value
    : "admin";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseGeminiText = (payload: {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}) =>
  payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("\n")
    .trim() ?? "";

const parseGeminiError = (status: number, bodyText: string) => {
  try {
    const parsed = JSON.parse(bodyText) as { error?: { message?: string } };
    const message = parsed.error?.message?.trim();
    if (message) {
      return `Gemini error ${status}: ${message}`;
    }
  } catch {
    // no-op
  }
  return `Gemini error ${status}: ${bodyText.trim() || "Unknown error."}`;
};

const callGemini = async (promptText: string, geminiApiKey: string): Promise<GeminiCallResult> => {
  for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: promptText }] }],
          }),
          signal: controller.signal,
        },
      );

      const bodyText = await response.text();
      if (!response.ok) {
        const message = parseGeminiError(response.status, bodyText);
        const canRetry = attempt < GEMINI_MAX_ATTEMPTS && (response.status === 408 || response.status === 429 || response.status >= 500);
        if (canRetry) {
          await delay(350);
          continue;
        }
        return { ok: false, error: message };
      }

      const parsed = JSON.parse(bodyText) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      return { ok: true, text: parseGeminiText(parsed) };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Gemini request error.";
      const canRetry = attempt < GEMINI_MAX_ATTEMPTS;
      if (canRetry) {
        await delay(350);
        continue;
      }
      return { ok: false, error: `Gemini request failed: ${message}` };
    } finally {
      clearTimeout(timeout);
    }
  }

  return { ok: false, error: "Gemini request failed after retry." };
};

const searchTable = async (
  supabase: SupabaseClient,
  config: SearchTableConfig,
  terms: string[],
): Promise<TableSearchResult> => {
  const { table, selectColumns, searchColumns, orderBy } = config;
  const selectList = selectColumns.join(",");
  const ilikeFilter = buildIlikeFilter(searchColumns, terms);

  const baseQuery = () =>
    supabase.from(table).select(selectList).order(orderBy, { ascending: true }).limit(MAX_ROWS_PER_TABLE);

  let query = baseQuery();
  if (ilikeFilter.length > 0) {
    query = query.or(ilikeFilter);
  }

  const { data, error } = await query;
  if (error) {
    return { table, rows: [], error: `${table}: ${error.message}` };
  }

  const filteredRows = (data ?? []) as unknown as JsonRecord[];
  if (filteredRows.length > 0 || ilikeFilter.length === 0) {
    return { table, rows: filteredRows };
  }

  // If keyword matching returns no rows, fall back to a tiny scoped sample
  // so broad prompts (for example, "total spend") still get usable context.
  const { data: fallbackData, error: fallbackError } = await baseQuery();
  if (fallbackError) {
    return { table, rows: [], error: `${table}: ${fallbackError.message}` };
  }
  return { table, rows: (fallbackData ?? []) as unknown as JsonRecord[] };
};

export async function POST(request: Request) {
  const startedAt = Date.now();
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabaseResult = getSupabaseOrError(request);
  if ("error" in supabaseResult) {
    return supabaseResult.error;
  }

  const body = (await request.json().catch(() => ({}))) as { prompt?: string };
  const prompt = body.prompt?.trim() ?? "";
  if (!prompt) {
    return NextResponse.json({ message: "Prompt is required." }, { status: 400 });
  }

  const terms = toSearchTerms(prompt);
  const matchedSections: Array<{ table: string; rows: JsonRecord[] }> = [];
  const tableErrors: string[] = [];
  const [{ data: roleData }] = await Promise.all([
    supabaseResult.supabase.rpc("current_app_role"),
  ]);
  const appRole = toAppRole(roleData);

  const searchResults = await Promise.all(
    SEARCH_TABLES.map((config) => searchTable(supabaseResult.supabase, config, terms)),
  );
  searchResults.forEach((result) => {
    if (result.rows.length > 0) {
      matchedSections.push({ table: result.table, rows: result.rows });
    }
    if (result.error) {
      tableErrors.push(result.error);
    }
  });

  const contextBlock = buildContext(matchedSections);
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return NextResponse.json({ message: "Gemini API key is not configured." }, { status: 500 });
  }

  const promptText = [
    contextBlock,
    "",
    ...rolePrompts[appRole],
    `User question: "${prompt}"`,
    "Use only the context above.",
    `If the context does not cover the question, say exactly: ${FALLBACK_SUMMARY}`,
    "Return strict JSON with keys: summary (string), confidence (0-100 number), rationale (string[]), nextActions (string[]).",
    "Do not add markdown.",
  ].join("\n");

  const geminiResult = await callGemini(promptText, geminiApiKey);
  if (!geminiResult.ok) {
    const failureRationale = [geminiResult.error];
    if (tableErrors.length > 0) {
      failureRationale.push(`Search issues: ${tableErrors.join(" | ")}`);
    }
    const fallback: SimulatedAiResponse = {
      summary:
        matchedSections.length > 0
          ? buildLocalFallbackSummary(prompt, matchedSections)
          : FALLBACK_SUMMARY,
      confidence: 0,
      rationale: failureRationale,
      nextActions: [],
      generatedAt: new Date().toISOString(),
      simulatedLatencyMs: Date.now() - startedAt,
      model: GEMINI_MODEL,
    };
    return NextResponse.json(fallback, { status: 200 });
  }

  const geminiText = geminiResult.text;
  const parsed = parseGeminiJson(geminiText);
  const responseBody = normalizeAiResponse({
    rawText: geminiText,
    parsed,
    noDataContext: contextBlock === NO_DATA_CONTEXT,
    tableErrors,
    generatedAt: new Date().toISOString(),
    simulatedLatencyMs: Date.now() - startedAt,
    model: GEMINI_MODEL,
  });

  return NextResponse.json(responseBody, { status: 200 });
}
