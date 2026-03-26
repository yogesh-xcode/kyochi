export type FeedbackFieldType =
  | "range"
  | "radio"
  | "text"
  | "multiselect"
  | "dropdown"
  | "checkbox"
  | "boolean"
  | "date";

export type TherapyFeedbackSchema = Record<string, FeedbackFieldType>;

const supportedFieldTypes: FeedbackFieldType[] = [
  "range",
  "radio",
  "text",
  "multiselect",
  "dropdown",
  "checkbox",
  "boolean",
  "date",
];

const isSupportedFieldType = (value: unknown): value is FeedbackFieldType =>
  typeof value === "string" && supportedFieldTypes.includes(value as FeedbackFieldType);

export const normalizeTherapySchemaKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const DEFAULT_THERAPY_FEEDBACK_SCHEMAS: Record<string, TherapyFeedbackSchema> = {
  relaxation: {
    Q1_stress_before: "range",
    Q1_stress_after: "range",
    Q2_circulation_improvement: "radio",
    Q3_rested_score: "range",
    Q4_therapist_note: "text",
  },
  destress: {
    Q1_mental_calm_score: "range",
    Q2_physical_tension_relief: "radio",
    Q3_energy_before: "range",
    Q3_energy_after: "range",
    Q4_peace_contributor: "text",
  },
  chronic_pain: {
    Q1_pain_area: "multiselect",
    Q2_pain_before: "range",
    Q2_pain_after: "range",
    Q3_mobility_improvement: "radio",
    Q4_sessions_completed: "dropdown",
    Q4_cumulative_improvement: "radio",
  },
  soul_serenity: {
    Q1_mental_stillness: "radio",
    Q2_emotional_balance_score: "range",
    Q3_standout_element: "checkbox",
    Q3_standout_note: "text",
    Q4_therapist_connection_score: "range",
  },
  reflexology_detox: {
    Q1_lightness_or_release: "radio",
    Q2_digestion_energy_change: "radio",
    Q2_cumulative_score: "range",
    Q3_refreshed_score: "range",
    Q4_water_intake: "boolean",
  },
  face_detox_reflexology: {
    Q1_skin_sensation: "radio",
    Q2_circulation_glow: "radio",
    Q3_rejuvenation_score: "range",
    Q4_combine_next_time: "boolean",
    Q4_combine_therapy_choice: "dropdown",
  },
  nasal_reflexology: {
    Q1_breathing_ease: "radio",
    Q2_sinus_relief: "radio",
    Q3_respiratory_before: "range",
    Q3_respiratory_after: "range",
    Q4_sinus_frequency: "dropdown",
  },
  vita_flex_mens_health: {
    Q1_vitality_score: "range",
    Q2_muscle_tension_relief: "radio",
    Q3_mood_tag: "multiselect",
    Q4_cumulative_improvement: "radio",
  },
  femme_cycle: {
    Q1_cramp_hormonal_relief: "radio",
    Q2_emotional_balance_score: "range",
    Q3_cycle_compliance: "boolean",
    Q3_last_cycle_date: "date",
    Q4_menstrual_regularity_change: "radio",
  },
  little_feet_children: {
    Q1_child_calm_score: "range",
    Q2_symptom_relief: "radio",
    Q3_child_mood_score: "range",
    Q4_followup_scheduled: "boolean",
  },
};

const THERAPY_SCHEMA_ALIASES: Record<string, string> = {
  relaxation_reflexology: "relaxation",
  de_stress_reflexology: "destress",
  de_stress: "destress",
  chronic_pain_reflexology: "chronic_pain",
  sole_serenity_therapy: "soul_serenity",
  detox_reflexology: "reflexology_detox",
  femme_cycle_reflexology: "femme_cycle",
  little_feet_reflexology_kids: "little_feet_children",
  vita_flex_reflexology: "vita_flex_mens_health",
};

export const sanitizeTherapyFeedbackSchema = (value: unknown): TherapyFeedbackSchema | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const entries = Object.entries(value as Record<string, unknown>).filter(
    ([questionKey, questionType]) => typeof questionKey === "string" && isSupportedFieldType(questionType),
  ) as Array<[string, FeedbackFieldType]>;

  if (entries.length === 0) {
    return null;
  }

  return Object.fromEntries(entries);
};

export const resolveTherapyFeedbackSchema = ({
  therapyName,
  feedbackSchema,
}: {
  therapyName: string;
  feedbackSchema: unknown;
}): TherapyFeedbackSchema => {
  const sanitized = sanitizeTherapyFeedbackSchema(feedbackSchema);
  if (sanitized) {
    return sanitized;
  }

  const normalizedKey = normalizeTherapySchemaKey(therapyName);
  const resolvedKey = THERAPY_SCHEMA_ALIASES[normalizedKey] ?? normalizedKey;
  return DEFAULT_THERAPY_FEEDBACK_SCHEMAS[resolvedKey] ?? DEFAULT_THERAPY_FEEDBACK_SCHEMAS.relaxation;
};

export const groupSchemaQuestionsByStep = (schema: TherapyFeedbackSchema) => {
  const grouped = new Map<number, Array<[string, FeedbackFieldType]>>();

  Object.entries(schema)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([questionKey, questionType]) => {
      const match = questionKey.match(/^Q(\d+)_/i);
      const stepIndex = match ? Number(match[1]) : 1;
      const current = grouped.get(stepIndex) ?? [];
      current.push([questionKey, questionType]);
      grouped.set(stepIndex, current);
    });

  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([step, fields]) => ({ step, fields }));
};

export const toReadableQuestionLabel = (questionKey: string) => {
  const withoutPrefix = questionKey.replace(/^Q\d+_/, "");
  return withoutPrefix
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const defaultOptionsForField = (questionKey: string): string[] => {
  const key = questionKey.toLowerCase();

  if (key.includes("circulation") || key.includes("relief") || key.includes("improvement") || key.includes("ease")) {
    return ["High", "Moderate", "Low"];
  }
  if (key.includes("pain_area")) {
    return ["Neck", "Shoulder", "Back", "Knee", "Ankle", "Head"];
  }
  if (key.includes("mood")) {
    return ["Calm", "Light", "Energetic", "Balanced"];
  }
  if (key.includes("frequency")) {
    return ["Rarely", "Monthly", "Weekly", "Daily"];
  }
  if (key.includes("sessions_completed")) {
    return ["1-2", "3-5", "6-10", "10+"];
  }
  if (key.includes("combine_therapy_choice")) {
    return ["Relaxation", "Destress", "Femme Cycle", "Nasal Reflexology"];
  }
  if (key.includes("standout")) {
    return ["Pressure points", "Breathing support", "Music", "Aroma", "Therapist guidance"];
  }

  return ["Yes", "Somewhat", "No"];
};
