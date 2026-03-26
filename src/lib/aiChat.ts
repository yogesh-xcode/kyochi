export type SimulatedAiResponse = {
  summary: string;
  confidence: number;
  rationale: string[];
  nextActions: string[];
  generatedAt: string;
  simulatedLatencyMs: number;
  model: string;
};

export type JsonRecord = Record<string, unknown>;

export const NO_DATA_CONTEXT = "No relevant data found in the system.";
export const MAX_ROWS_PER_TABLE = 3;
export const MAX_CONTEXT_CHARS = 12000;
export const GEMINI_TIMEOUT_MS = 30000;
export const GEMINI_MAX_ATTEMPTS = 2;
export const GEMINI_MODEL = "gemini-2.5-flash";
export const FALLBACK_SUMMARY = "I don't have enough data to answer that.";

export type SearchTableConfig = {
  table: string;
  selectColumns: string[];
  searchColumns: string[];
  orderBy: string;
};

export const SEARCH_TABLES: ReadonlyArray<SearchTableConfig> = [
  {
    table: "appointments",
    selectColumns: [
      "id",
      "franchise_id",
      "patient_id",
      "therapist_id",
      "therapy_id",
      "starts_at",
      "status",
    ],
    searchColumns: ["id", "franchise_id", "patient_id", "therapist_id", "therapy_id", "status"],
    orderBy: "starts_at",
  },
  {
    table: "billing",
    selectColumns: ["id", "appointment_id", "franchise_id", "patient_id", "amount", "currency", "status", "due_date"],
    searchColumns: ["id", "appointment_id", "franchise_id", "patient_id", "currency", "status"],
    orderBy: "id",
  },
  {
    table: "feedback",
    selectColumns: [
      "id",
      "appointment_id",
      "franchise_id",
      "patient_id",
      "therapist_id",
      "invoice_id",
      "rating",
      "status",
      "submitted_at",
    ],
    searchColumns: ["id", "appointment_id", "franchise_id", "patient_id", "therapist_id", "status"],
    orderBy: "id",
  },
  {
    table: "franchises",
    selectColumns: ["id", "name", "city", "region"],
    searchColumns: ["id", "name", "city", "region"],
    orderBy: "id",
  },
  {
    table: "patients",
    selectColumns: ["id", "franchise_id", "status", "wellness_score"],
    searchColumns: ["id", "franchise_id", "status"],
    orderBy: "id",
  },
  {
    table: "therapies",
    selectColumns: ["id", "name", "category", "status", "price", "duration_min", "session_count"],
    searchColumns: ["id", "name", "category", "status", "description"],
    orderBy: "id",
  },
  {
    table: "therapists",
    selectColumns: ["id", "franchise_id", "specialty", "status"],
    searchColumns: ["id", "franchise_id", "specialty", "status"],
    orderBy: "id",
  },
];

export const toSearchTerms = (question: string) =>
  question
    .toLowerCase()
    .split(/[^a-z0-9_]+/g)
    .map((term) => term.trim())
    .filter((term) => term.length > 1)
    .slice(0, 10);

export const buildIlikeFilter = (searchColumns: string[], terms: string[]) => {
  if (terms.length === 0) {
    return "";
  }
  const escapedTerms = terms.map((term) => term.replaceAll("%", "\\%").replaceAll(",", "\\,"));
  return escapedTerms
    .flatMap((term) => searchColumns.map((column) => `${column}.ilike.%${term}%`))
    .join(",");
};

const truncateByChars = (value: string, maxChars: number) =>
  value.length <= maxChars ? value : `${value.slice(0, maxChars - 19)}\n\n[context truncated]`;

export const buildContext = (
  groupedRows: Array<{ table: string; rows: JsonRecord[] }>,
  maxChars = MAX_CONTEXT_CHARS,
) => {
  if (groupedRows.length === 0) {
    return NO_DATA_CONTEXT;
  }

  const sortedSections = groupedRows
    .filter((section) => section.rows.length > 0)
    .sort((a, b) => a.table.localeCompare(b.table));

  if (sortedSections.length === 0) {
    return NO_DATA_CONTEXT;
  }

  const context = sortedSections
    .map(({ table, rows }) => `### ${table}\n${JSON.stringify(rows, null, 2)}`)
    .join("\n\n");

  return truncateByChars(context, maxChars);
};

export const parseGeminiJson = (text: string): Partial<SimulatedAiResponse> | null => {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as Partial<SimulatedAiResponse>;
  } catch {
    return null;
  }
};

export const normalizeAiResponse = ({
  rawText,
  parsed,
  noDataContext,
  tableErrors,
  generatedAt,
  simulatedLatencyMs,
  model,
}: {
  rawText: string;
  parsed: Partial<SimulatedAiResponse> | null;
  noDataContext: boolean;
  tableErrors: string[];
  generatedAt: string;
  simulatedLatencyMs: number;
  model: string;
}): SimulatedAiResponse => {
  const parsedSummary =
    typeof parsed?.summary === "string" && parsed.summary.trim().length > 0
      ? parsed.summary.trim()
      : "";
  const summary = noDataContext ? FALLBACK_SUMMARY : parsedSummary || rawText || FALLBACK_SUMMARY;

  const parsedConfidence = typeof parsed?.confidence === "number" ? parsed.confidence : NaN;
  const confidence = Number.isFinite(parsedConfidence)
    ? Math.max(0, Math.min(100, Math.round(parsedConfidence)))
    : noDataContext
      ? 0
      : 78;

  const parsedRationale = Array.isArray(parsed?.rationale)
    ? parsed.rationale.map((entry) => String(entry)).filter(Boolean).slice(0, 5)
    : [];
  const rationale =
    parsedRationale.length > 0 ? parsedRationale : ["Answer generated from matched Supabase records only."];
  if (tableErrors.length > 0) {
    rationale.push(`Search issues: ${tableErrors.join(" | ")}`);
  }

  const nextActions = Array.isArray(parsed?.nextActions)
    ? parsed.nextActions.map((entry) => String(entry)).filter(Boolean).slice(0, 5)
    : [];

  return {
    summary,
    confidence,
    rationale,
    nextActions,
    generatedAt,
    simulatedLatencyMs: Math.max(0, simulatedLatencyMs),
    model,
  };
};

export const buildLocalFallbackSummary = (
  prompt: string,
  groupedRows: Array<{ table: string; rows: JsonRecord[] }>,
) => {
  const appointments = groupedRows.find((section) => section.table === "appointments")?.rows ?? [];
  if (appointments.length > 0) {
    const statuses = new Map<string, number>();
    const ids: string[] = [];

    appointments.forEach((row) => {
      const id = typeof row.id === "string" ? row.id : "";
      const status = typeof row.status === "string" ? row.status : "unknown";
      if (id) {
        ids.push(id);
      }
      statuses.set(status, (statuses.get(status) ?? 0) + 1);
    });

    const statusSummary = Array.from(statuses.entries())
      .map(([status, count]) => `${count} ${status}`)
      .join(", ");
    const idSummary = ids.length > 0 ? ids.join(", ") : "no identifiable session IDs";

    return `From your current records, I found ${appointments.length} session(s): ${idSummary}. Status breakdown: ${statusSummary}.`;
  }

  const billing = groupedRows.find((section) => section.table === "billing")?.rows ?? [];
  if (billing.length > 0) {
    return `I found ${billing.length} billing record(s), but no appointment rows were available in the current AI context.`;
  }

  if (prompt.toLowerCase().includes("session")) {
    return FALLBACK_SUMMARY;
  }
  return FALLBACK_SUMMARY;
};
