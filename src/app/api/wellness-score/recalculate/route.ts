import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

import { getSupabaseOrError } from "@/app/api/_shared/supabase";
import {
  GEMINI_MAX_ATTEMPTS,
  GEMINI_MODEL,
  GEMINI_TIMEOUT_MS,
} from "@/lib/aiChat";

type FeedbackSnapshot = {
  id: string;
  patient_id: string;
  rating: number | null;
  submitted_at: string | null;
  session_date: string | null;
  feedback_payload?: Record<string, unknown> | null;
  notes?: unknown | null;
};

type GeminiWellnessResponse = {
  wellnessScore?: number;
  reliefDelta?: number;
  recoveryOutlook?: number;
  confidence?: number;
  summary?: string;
};
type GeminiCallResult = {
  ok: boolean;
  text: string;
  statusCode?: number;
  aborted?: boolean;
};
const WELLNESS_RECALC_COOLDOWN_MS = 30000;

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

const logAiWellness = async (payload: Record<string, unknown>) => {
  const dirPath = path.join(process.cwd(), "logs");
  const filePath = path.join(dirPath, "ai-log.log");
  const line = `${new Date().toISOString()} ${JSON.stringify(payload)}\n`;
  try {
    await mkdir(dirPath, { recursive: true });
    await appendFile(filePath, line, "utf8");
  } catch {
    // Logging must never break API behavior.
  }
};

const asNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const extractReliefFromPayload = (payload: Record<string, unknown> | null | undefined) => {
  if (!payload) {
    return null;
  }

  const aiRelief = asNumber(payload.ai_relief_delta);
  if (aiRelief !== null) {
    return aiRelief;
  }

  for (const [key, rawBefore] of Object.entries(payload)) {
    if (!key.toLowerCase().includes("before")) {
      continue;
    }
    const before = asNumber(rawBefore);
    if (before === null) {
      continue;
    }
    const after = asNumber(payload[key.replace(/before/i, "after")]);
    if (after === null) {
      continue;
    }
    return before - after;
  }

  return null;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const computeFallbackWellness = (feedbackRows: FeedbackSnapshot[]) => {
  const ratings10 = feedbackRows
    .map((row) => asNumber(row.rating))
    .filter((value): value is number => value !== null)
    .map((value) => clamp(value * 2, 0, 10));

  if (ratings10.length === 0) {
    return { wellnessScore: 0, reliefDelta: 0 };
  }

  const weighted = ratings10.reduce(
    (acc, score, index) => {
      const weight = ratings10.length - index;
      return {
        sum: acc.sum + score * weight,
        weights: acc.weights + weight,
      };
    },
    { sum: 0, weights: 0 },
  );
  const weightedScore10 = weighted.weights > 0 ? weighted.sum / weighted.weights : ratings10[0];
  const wellnessScore = clamp(Number((weightedScore10 * 10).toFixed(1)), 0, 100);

  let reliefDelta = 0;
  for (const row of feedbackRows) {
    const delta = extractReliefFromPayload(row.feedback_payload);
    if (delta !== null) {
      reliefDelta = Number(delta.toFixed(1));
      break;
    }
  }
  if (reliefDelta === 0 && ratings10.length > 1) {
    reliefDelta = Number((ratings10[ratings10.length - 1] - ratings10[0]).toFixed(1));
  }

  return {
    wellnessScore,
    reliefDelta,
  };
};

const computeFallbackRecoveryOutlook = (
  feedbackRows: FeedbackSnapshot[],
  fallbackWellness: number,
  fallbackRelief: number,
) => {
  const ratings10 = feedbackRows
    .map((row) => asNumber(row.rating))
    .filter((value): value is number => value !== null)
    .map((value) => clamp(value * 2, 0, 10));

  if (ratings10.length === 0) {
    return {
      recoveryOutlook: Math.round(clamp(fallbackWellness, 0, 100)),
      recoveryConfidence: 30,
    };
  }

  const recentWindow = ratings10.slice(0, Math.min(3, ratings10.length));
  const olderWindow = ratings10.slice(Math.min(3, ratings10.length));
  const recentAvg =
    recentWindow.length > 0
      ? recentWindow.reduce((sum, score) => sum + score, 0) / recentWindow.length
      : ratings10[0];
  const olderAvg =
    olderWindow.length > 0
      ? olderWindow.reduce((sum, score) => sum + score, 0) / olderWindow.length
      : recentAvg;
  const trend = recentAvg - olderAvg;
  const momentumScore = clamp(50 + trend * 10, 0, 100);

  const reliefScore = clamp(50 + fallbackRelief * 10, 0, 100);

  const variance =
    ratings10.reduce((sum, score) => sum + (score - recentAvg) ** 2, 0) /
    Math.max(ratings10.length, 1);
  const stdDev = Math.sqrt(variance);
  const consistencyScore = clamp(100 - stdDev * 16, 20, 100);

  const recoveryOutlook = Math.round(
    clamp(
      momentumScore * 0.4 +
        reliefScore * 0.2 +
        consistencyScore * 0.2 +
        clamp(fallbackWellness, 0, 100) * 0.2,
      0,
      100,
    ),
  );
  const recoveryConfidence = Math.round(
    clamp(35 + feedbackRows.length * 7 + (consistencyScore - 50) * 0.25, 25, 95),
  );

  return { recoveryOutlook, recoveryConfidence };
};

const parseGeminiJson = (text: string): GeminiWellnessResponse | null => {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as GeminiWellnessResponse;
  } catch {
    return null;
  }
};

const summarizeGeminiError = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "unknown_error";
  }
  try {
    const parsed = JSON.parse(trimmed) as {
      error?: { code?: number; status?: string; message?: string };
    };
    if (parsed.error) {
      return `${parsed.error.code ?? "?"}:${parsed.error.status ?? "ERROR"}:${(parsed.error.message ?? "").slice(0, 220)}`;
    }
  } catch {
    // no-op
  }
  return trimmed.slice(0, 240);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
        if (response.status === 429) {
          return { ok: false, text: bodyText, statusCode: 429 };
        }
        if (attempt < GEMINI_MAX_ATTEMPTS) {
          await delay(300);
          continue;
        }
        return { ok: false, text: bodyText, statusCode: response.status };
      }

      const parsed = JSON.parse(bodyText) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text =
        parsed.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("\n")
          .trim() ?? "";
      return { ok: true, text, statusCode: 200 };
    } catch (error) {
      const isAbortError =
        error instanceof DOMException
          ? error.name === "AbortError"
          : error instanceof Error
            ? error.name === "AbortError"
            : false;
      if (attempt < GEMINI_MAX_ATTEMPTS) {
        await delay(300);
        continue;
      }
      return {
        ok: false,
        text: error instanceof Error ? error.message : "Gemini request failed.",
        aborted: isAbortError,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
  return { ok: false, text: "Gemini request failed." };
};

export async function POST(request: Request) {
  const result = getSupabaseOrError(request);
  if ("error" in result) {
    return result.error;
  }

  const body = (await request.json().catch(() => ({}))) as { patient_id?: string };
  const patientId = body.patient_id?.trim();
  if (!patientId) {
    return NextResponse.json({ message: "patient_id is required." }, { status: 400 });
  }

  const automationClient = createServiceSupabaseClient() ?? result.supabase;

  const { data: feedbackRows, error: feedbackError } = await automationClient
    .from("feedback")
    .select("id, patient_id, rating, submitted_at, session_date, feedback_payload, notes")
    .eq("patient_id", patientId)
    .eq("status", "completed")
    .not("rating", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(7);

  if (feedbackError) {
    return NextResponse.json({ message: feedbackError.message }, { status: 400 });
  }

  const rows = ((feedbackRows ?? []) as FeedbackSnapshot[]).sort((a, b) => {
    const aTime = new Date(a.submitted_at ?? a.session_date ?? "1970-01-01").getTime();
    const bTime = new Date(b.submitted_at ?? b.session_date ?? "1970-01-01").getTime();
    return bTime - aTime;
  });

  if (rows.length === 0) {
    await logAiWellness({
      event: "wellness_recalc_skipped_no_feedback",
      patient_id: patientId,
      feedback_count: 0,
    });
    return NextResponse.json(
      {
        patient_id: patientId,
        based_on_feedback_count: 0,
        message: "No completed rated feedback found for recomputation.",
      },
      { status: 200 },
    );
  }

  const latestFeedback = rows[0];
  const previousGeneratedAt = latestFeedback?.feedback_payload?.ai_wellness_generated_at;
  const previousGeneratedMs =
    typeof previousGeneratedAt === "string"
      ? new Date(previousGeneratedAt).getTime()
      : Number.NaN;
  const cooldownActive =
    Number.isFinite(previousGeneratedMs) &&
    Date.now() - previousGeneratedMs < WELLNESS_RECALC_COOLDOWN_MS;
  if (cooldownActive) {
    await logAiWellness({
      event: "wellness_recalc_skipped_cooldown",
      patient_id: patientId,
      feedback_count: rows.length,
      cooldown_ms: WELLNESS_RECALC_COOLDOWN_MS,
      last_generated_at: previousGeneratedAt,
    });
    return NextResponse.json(
      {
        patient_id: patientId,
        based_on_feedback_count: rows.length,
        message: "Skipped due to cooldown window.",
      },
      { status: 200 },
    );
  }

  const fallback = computeFallbackWellness(rows);
  const fallbackRecovery = computeFallbackRecoveryOutlook(
    rows,
    fallback.wellnessScore,
    fallback.reliefDelta,
  );
  let aiWellness = fallback.wellnessScore;
  let aiRelief = fallback.reliefDelta;
  let confidence = 0;
  let recoveryOutlook = fallbackRecovery.recoveryOutlook;
  let recoveryConfidence = fallbackRecovery.recoveryConfidence;
  let scoringSource: "gemini" | "fallback" = "fallback";
  let geminiRawResponse = "";

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const aiEnabled = process.env.WELLNESS_AI_ENABLED !== "false";
  if (aiEnabled && geminiApiKey && rows.length > 0) {
    const promptText = [
      "You are a clinical wellness scoring assistant.",
      "Given the latest up to 7 feedback entries, calculate overall wellness, relief trend, and forward recovery outlook.",
      "Return strict JSON only with keys: wellnessScore (0-100 number), reliefDelta (-10 to 10 number), recoveryOutlook (0-100 number), confidence (0-100 number), summary (string).",
      "recoveryOutlook means probability of improvement over the next 2-3 sessions.",
      "Use recent entries with higher weight.",
      "Feedback entries:",
      JSON.stringify(rows, null, 2),
    ].join("\n");

    const gemini = await callGemini(promptText, geminiApiKey);
    if (gemini.ok) {
      geminiRawResponse = gemini.text;
      const parsed = parseGeminiJson(gemini.text);
      const parsedScore = asNumber(parsed?.wellnessScore);
      const parsedRelief = asNumber(parsed?.reliefDelta);
      const parsedRecoveryOutlook = asNumber(parsed?.recoveryOutlook);
      const parsedConfidence = asNumber(parsed?.confidence);
      if (parsedScore !== null) {
        aiWellness = clamp(Number(parsedScore.toFixed(1)), 0, 100);
        scoringSource = "gemini";
      }
      if (parsedRelief !== null) {
        aiRelief = clamp(Number(parsedRelief.toFixed(1)), -10, 10);
        scoringSource = "gemini";
      }
      if (parsedRecoveryOutlook !== null) {
        recoveryOutlook = clamp(Math.round(parsedRecoveryOutlook), 0, 100);
        scoringSource = "gemini";
      }
      if (parsedConfidence !== null) {
        confidence = clamp(Math.round(parsedConfidence), 0, 100);
        recoveryConfidence = confidence;
      }
    } else {
      geminiRawResponse = gemini.text;
      if (gemini.statusCode === 429) {
        await logAiWellness({
          event: "wellness_recalc_quota_exhausted",
          patient_id: patientId,
          model: GEMINI_MODEL,
          feedback_count: rows.length,
          gemini_error: summarizeGeminiError(gemini.text),
        });
      } else if (gemini.aborted) {
        await logAiWellness({
          event: "wellness_recalc_ai_aborted",
          patient_id: patientId,
          model: GEMINI_MODEL,
          feedback_count: rows.length,
        });
      }
    }
  } else if (!aiEnabled) {
    await logAiWellness({
      event: "wellness_recalc_ai_disabled",
      patient_id: patientId,
      feedback_count: rows.length,
      env: "WELLNESS_AI_ENABLED=false",
    });
  }

  const { error: patientUpdateError } = await automationClient
    .from("patients")
    .update({ wellness_score: aiWellness })
    .eq("id", patientId);

  if (patientUpdateError) {
    return NextResponse.json({ message: patientUpdateError.message }, { status: 400 });
  }

  if (latestFeedback) {
    const mergedPayload = {
      ...(latestFeedback.feedback_payload ?? {}),
      ai_wellness_score: aiWellness,
      ai_relief_delta: aiRelief,
      ai_wellness_confidence: confidence,
      ai_recovery_outlook: recoveryOutlook,
      ai_recovery_confidence: recoveryConfidence,
      ai_wellness_model: geminiApiKey ? GEMINI_MODEL : "fallback",
      ai_wellness_generated_at: new Date().toISOString(),
    };

    await automationClient
      .from("feedback")
      .update({ feedback_payload: mergedPayload })
      .eq("id", latestFeedback.id);
  }

  await logAiWellness({
    event: "wellness_recalc_completed",
    patient_id: patientId,
    feedback_count: rows.length,
    based_on_feedback_ids: rows.map((row) => row.id),
    source: scoringSource,
    model: scoringSource === "gemini" ? GEMINI_MODEL : "fallback",
    wellness_score: aiWellness,
    relief_delta: aiRelief,
    recovery_outlook: recoveryOutlook,
    confidence,
    fallback_wellness_score: fallback.wellnessScore,
    fallback_relief_delta: fallback.reliefDelta,
    fallback_recovery_outlook: fallbackRecovery.recoveryOutlook,
    gemini_raw_response: summarizeGeminiError(geminiRawResponse),
  });

  return NextResponse.json(
    {
      patient_id: patientId,
      wellness_score: aiWellness,
      relief_delta: aiRelief,
      recovery_outlook: recoveryOutlook,
      based_on_feedback_count: rows.length,
    },
    { status: 200 },
  );
}
