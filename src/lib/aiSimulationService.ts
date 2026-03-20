export type SimulatedAiResponse = {
  summary: string;
  confidence: number;
  rationale: string[];
  nextActions: string[];
  generatedAt: string;
  simulatedLatencyMs: number;
  model: string;
};

type Scenario = {
  match: (prompt: string) => boolean;
  summaryTemplates: string[];
  rationale: string[];
  actions: string[];
  confidenceRange: [number, number];
};

const scenarios: Scenario[] = [
  {
    match: (prompt) =>
      /invoice|payment|overdue|billing|collection|reminder/i.test(prompt),
    summaryTemplates: [
      "Revenue leakage is recoverable this week if reminders are sequenced by invoice age and amount.",
      "Cash recovery can improve quickly by prioritizing overdue invoices by risk tier and response probability.",
    ],
    rationale: [
      "Older invoices are less likely to convert without stronger escalation language.",
      "Personalized message context improves response rate compared with bulk reminders.",
      "A two-touch reminder cadence usually captures most short-term recovery.",
    ],
    actions: [
      "Segment overdue invoices into 0-7, 8-14, and 15+ day buckets.",
      "Send first reminder with amount due and payment link; schedule follow-up at 24 hours.",
      "Escalate 15+ day invoices with direct call task assignment.",
    ],
    confidenceRange: [82, 93],
  },
  {
    match: (prompt) =>
      /feedback|review|google|rating|reputation|post-session/i.test(prompt),
    summaryTemplates: [
      "Feedback capture is the fastest growth lever because review volume is below service completion volume.",
      "Your reputation flywheel is under-activated; automated post-session nudges can close the gap quickly.",
    ],
    rationale: [
      "Completed sessions with no follow-up lead to lost review opportunities.",
      "Time-to-request strongly influences feedback submission rate.",
      "A fallback reminder after 24 hours captures delayed responders.",
    ],
    actions: [
      "Trigger WhatsApp review ask 2 hours after session completion.",
      "Add one follow-up reminder at 24 hours for non-responders.",
      "Track weekly review conversion: completed sessions vs. reviews posted.",
    ],
    confidenceRange: [84, 94],
  },
  {
    match: (prompt) =>
      /waiting|churn|retention|re-engage|rebook|drop/i.test(prompt),
    summaryTemplates: [
      "Retention risk is concentrated in waiting-status patients with no next booking date.",
      "A short re-engagement workflow can recover at-risk patients before churn hardens.",
    ],
    rationale: [
      "Patients without scheduled follow-up are most likely to lapse.",
      "Personalized rebooking nudges outperform generic campaigns.",
      "Small incentives can accelerate return visits for stalled cohorts.",
    ],
    actions: [
      "Create a daily list of waiting patients with last visit age.",
      "Send personalized rebooking message with two appointment options.",
      "Offer limited-time add-on benefit for bookings confirmed within 48 hours.",
    ],
    confidenceRange: [80, 90],
  },
  {
    match: (prompt) =>
      /membership|bundle|ltv|loyalty|repeat|package/i.test(prompt),
    summaryTemplates: [
      "Prepaid bundles are likely to lift retention and stabilize near-term cash flow.",
      "A structured membership can convert repeat behavior into predictable revenue.",
    ],
    rationale: [
      "Repeat patients already show willingness to return without program design.",
      "Bundling increases commitment and lowers no-show risk.",
      "Simple offer framing improves front-desk adoption and conversion.",
    ],
    actions: [
      "Launch 5+1 bundle with 60-day validity and clear terms.",
      "Train checkout script for therapists and front desk.",
      "Track conversion rate by location and adjust offer framing weekly.",
    ],
    confidenceRange: [78, 89],
  },
  {
    match: (prompt) =>
      /franchise|location|reporting|city|expansion|scale/i.test(prompt),
    summaryTemplates: [
      "Scale risk is primarily operational visibility, not demand.",
      "Standardized franchise reporting is the minimum control layer needed before expansion.",
    ],
    rationale: [
      "Cross-location blind spots delay corrective action.",
      "A compact KPI template balances consistency and low reporting effort.",
      "City-level comparisons expose therapy and staffing variance early.",
    ],
    actions: [
      "Define monthly KPI template: sessions, revenue, utilization, complaints.",
      "Collect via one shared form with deadline and owner per franchise.",
      "Review outliers weekly and trigger targeted operational support.",
    ],
    confidenceRange: [81, 92],
  },
];

const fallbackScenario: Scenario = {
  match: () => true,
  summaryTemplates: [
    "The prompt indicates a strategy decision that can be tested with low-risk operational experiments.",
    "This request can be translated into a short action plan with measurable weekly outcomes.",
  ],
  rationale: [
    "Clear hypotheses reduce execution ambiguity.",
    "Small experiments create evidence before broad rollout.",
    "Weekly metrics ensure fast iteration.",
  ],
  actions: [
    "Define one metric that indicates success in 7 days.",
    "Run one pilot workflow for a single branch or segment.",
    "Review results and decide scale, adjust, or stop.",
  ],
  confidenceRange: [74, 86],
};

const hashPrompt = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pickByHash = <T>(items: T[], hash: number) => {
  if (items.length === 0) {
    throw new Error("Cannot select from an empty list.");
  }
  return items[hash % items.length];
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export async function simulateAiStrategyResponse(
  prompt: string,
): Promise<SimulatedAiResponse> {
  const normalizedPrompt = prompt.trim();
  if (!normalizedPrompt) {
    throw new Error("Prompt is empty. Please enter a strategy prompt.");
  }

  const scenario =
    scenarios.find((entry) => entry.match(normalizedPrompt)) ?? fallbackScenario;
  const promptHash = hashPrompt(normalizedPrompt.toLowerCase());

  const simulatedLatencyMs = 600 + (promptHash % 900);
  await new Promise((resolve) => setTimeout(resolve, simulatedLatencyMs));

  const baseTemplate = pickByHash(scenario.summaryTemplates, promptHash);
  const confidenceOffset = promptHash % 7;
  const confidence = clamp(
    scenario.confidenceRange[0] + confidenceOffset,
    scenario.confidenceRange[0],
    scenario.confidenceRange[1],
  );

  return {
    summary: `${baseTemplate} Focus prompt: "${normalizedPrompt.slice(0, 140)}${normalizedPrompt.length > 140 ? "..." : ""}"`,
    confidence,
    rationale: scenario.rationale,
    nextActions: scenario.actions,
    generatedAt: new Date().toISOString(),
    simulatedLatencyMs,
    model: "kyochi-sim-v1",
  };
}
