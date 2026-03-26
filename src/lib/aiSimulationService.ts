import { supabase } from "@/lib/supabase/client";

export type SimulatedAiResponse = {
  summary: string;
  confidence: number;
  rationale: string[];
  nextActions: string[];
  generatedAt: string;
  simulatedLatencyMs: number;
  model: string;
};

const normalizeResponse = (payload: Partial<SimulatedAiResponse>): SimulatedAiResponse => ({
  summary:
    typeof payload.summary === "string" && payload.summary.trim()
      ? payload.summary
      : "I don't have enough data to answer that.",
  confidence:
    typeof payload.confidence === "number"
      ? Math.max(0, Math.min(100, Math.round(payload.confidence)))
      : 0,
  rationale: Array.isArray(payload.rationale)
    ? payload.rationale.map((entry) => String(entry)).filter(Boolean)
    : [],
  nextActions: Array.isArray(payload.nextActions)
    ? payload.nextActions.map((entry) => String(entry)).filter(Boolean)
    : [],
  generatedAt:
    typeof payload.generatedAt === "string" && payload.generatedAt
      ? payload.generatedAt
      : new Date().toISOString(),
  simulatedLatencyMs:
    typeof payload.simulatedLatencyMs === "number" ? Math.max(0, payload.simulatedLatencyMs) : 0,
  model: typeof payload.model === "string" && payload.model ? payload.model : "gemini-2.5-flash",
});

export async function simulateAiStrategyResponse(
  prompt: string,
): Promise<SimulatedAiResponse> {
  const normalizedPrompt = prompt.trim();
  if (!normalizedPrompt) {
    throw new Error("Prompt is empty. Please enter a strategy prompt.");
  }

  try {
    const accessToken = (await supabase?.auth.getSession())?.data.session?.access_token;
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ prompt: normalizedPrompt }),
    });

    const payload = (await response.json().catch(() => ({}))) as Partial<SimulatedAiResponse> & {
      message?: string;
    };

    if (!response.ok) {
      return normalizeResponse({
        summary: "I don't have enough data to answer that.",
        confidence: 0,
        rationale: [payload.message ?? "AI request failed."],
        nextActions: [],
        generatedAt: new Date().toISOString(),
        simulatedLatencyMs: 0,
        model: "gemini-2.5-flash",
      });
    }

    return normalizeResponse(payload);
  } catch (error) {
    return normalizeResponse({
      summary: "I don't have enough data to answer that.",
      confidence: 0,
      rationale: [error instanceof Error ? error.message : "Failed to fetch AI response."],
      nextActions: [],
      generatedAt: new Date().toISOString(),
      simulatedLatencyMs: 0,
      model: "gemini-2.5-flash",
    });
  }
}
