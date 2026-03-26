import {
  buildContext,
  buildIlikeFilter,
  FALLBACK_SUMMARY,
  NO_DATA_CONTEXT,
  normalizeAiResponse,
  parseGeminiJson,
  toSearchTerms,
} from "@/lib/aiChat";

describe("aiChat helpers", () => {
  it("builds normalized search terms", () => {
    expect(toSearchTerms("  Revenue @ Chennai!!  AP01?  ")).toEqual(["revenue", "chennai", "ap01"]);
  });

  it("creates ilike filter from terms and columns", () => {
    expect(buildIlikeFilter(["id", "status"], ["ap01", "paid"]))
      .toBe("id.ilike.%ap01%,status.ilike.%ap01%,id.ilike.%paid%,status.ilike.%paid%");
  });

  it("returns no-data context when rows are empty", () => {
    expect(buildContext([])).toBe(NO_DATA_CONTEXT);
  });

  it("sorts sections and truncates oversized context", () => {
    const context = buildContext(
      [
        { table: "therapists", rows: [{ id: "T1" }] },
        { table: "appointments", rows: [{ id: "A1", status: "waiting" }] },
      ],
      60,
    );

    expect(context.startsWith("### appointments")).toBe(true);
    expect(context.includes("[context truncated]")).toBe(true);
  });

  it("parses fenced json from model text", () => {
    const parsed = parseGeminiJson("```json\n{\"summary\":\"ok\",\"confidence\":99}\n```");
    expect(parsed).toEqual({ summary: "ok", confidence: 99 });
  });

  it("normalizes invalid model output to stable contract", () => {
    const response = normalizeAiResponse({
      rawText: "",
      parsed: null,
      noDataContext: true,
      tableErrors: ["patients: denied"],
      generatedAt: "2026-03-22T00:00:00.000Z",
      simulatedLatencyMs: 10,
      model: "gemini-2.5-flash",
    });

    expect(response.summary).toBe(FALLBACK_SUMMARY);
    expect(response.confidence).toBe(0);
    expect(response.rationale.join(" ")).toContain("patients: denied");
    expect(response.model).toBe("gemini-2.5-flash");
  });
});
