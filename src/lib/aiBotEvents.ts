export const KYOCHI_AI_PROMPT_EVENT = "kyochi-ai-prompt";

export const emitKyochiAiPrompt = (prompt: string) => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<string>(KYOCHI_AI_PROMPT_EVENT, { detail: prompt }),
  );
};
