"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Leaf, Send, Sparkles, X } from "lucide-react";

import {
  simulateAiStrategyResponse,
  type SimulatedAiResponse,
} from "@/lib/aiSimulationService";
import { KYOCHI_AI_PROMPT_EVENT } from "@/lib/aiBotEvents";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  meta?: string;
};

const starterPrompts = [
  "How can Kyochi recover overdue payments this week?",
  "Give me a 30-day plan to increase patient retention.",
  "How should Kyochi increase Google review volume?",
];

const formatAssistantText = (response: SimulatedAiResponse) => {
  const rationale = response.rationale.map((point) => `- ${point}`).join("\n");
  const actions = response.nextActions
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");
  return `${response.summary}\n\nWhy:\n${rationale}\n\nNext steps:\n${actions}`;
};

export function KyochiAiBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I am Kyochi AI. Ask me anything about strategy, growth, operations, or patient experience.",
      meta: "Simulation mode",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const canSend = input.trim().length > 0 && !isLoading;

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  const pushUserAndFetch = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    window.setTimeout(scrollToBottom, 0);

    try {
      const response = await simulateAiStrategyResponse(trimmed);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: formatAssistantText(response),
        meta: `${response.model} · ${response.confidence}% confidence · ${response.simulatedLatencyMs}ms`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        text:
          error instanceof Error
            ? error.message
            : "Simulation failed. Try another question.",
        meta: "Simulation error",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      window.setTimeout(scrollToBottom, 0);
    }
  }, [scrollToBottom]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await pushUserAndFetch(input);
  };

  useEffect(() => {
    const handlePromptEvent = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const prompt = customEvent.detail?.trim();
      if (!prompt) {
        return;
      }
      setOpen(true);
      void pushUserAndFetch(prompt);
    };

    window.addEventListener(KYOCHI_AI_PROMPT_EVENT, handlePromptEvent);
    return () => {
      window.removeEventListener(KYOCHI_AI_PROMPT_EVENT, handlePromptEvent);
    };
  }, [pushUserAndFetch]);

  return (
    <>
      {open ? (
        <section className="fixed bottom-20 right-4 z-50 w-[min(92vw,370px)] overflow-hidden rounded-2xl border border-[var(--k-color-border-soft)] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
          <header className="flex items-center justify-between border-b border-[var(--k-color-border-soft)] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--k-color-brand-border)] bg-[var(--k-color-brand-soft)] text-[var(--k-color-brand-strong)]">
                <Leaf className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--k-color-text-strong)]">
                  Kyochi AI
                </p>
                <p className="text-[10px] text-[var(--k-color-text-subtle)]">
                  Simulated responses for UI testing
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--k-color-text-subtle)] hover:bg-[var(--k-color-surface-muted)]"
              aria-label="Close Kyochi AI bot"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={scrollRef} className="max-h-[46vh] space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[92%] whitespace-pre-wrap rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  message.role === "assistant"
                    ? "bg-[var(--k-color-surface-muted)] text-[var(--k-color-text-strong)]"
                    : "ml-auto bg-[#b8960c] text-white"
                }`}
              >
                {message.text}
                {message.meta ? (
                  <p
                    className={`mt-1 text-[10px] ${
                      message.role === "assistant"
                        ? "text-[var(--k-color-text-subtle)]"
                        : "text-[#f6ebc6]"
                    }`}
                  >
                    {message.meta}
                  </p>
                ) : null}
              </div>
            ))}
            {isLoading ? (
              <div className="inline-flex items-center gap-1 rounded-xl bg-[var(--k-color-surface-muted)] px-3 py-2 text-xs text-[var(--k-color-text-subtle)]">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Kyochi AI is thinking...
              </div>
            ) : null}
          </div>

          <div className="border-t border-[var(--k-color-border-soft)] px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void pushUserAndFetch(prompt)}
                  disabled={isLoading}
                  className="rounded-full border border-[var(--k-color-brand-border)] bg-[var(--k-color-brand-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--k-color-brand-strong)] disabled:opacity-60"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask anything about Kyochi..."
                className="h-9 flex-1 rounded-lg border border-[var(--k-color-border-soft)] px-3 text-xs text-[var(--k-color-text-strong)] outline-none focus:border-[#b8960c]"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#b8960c] text-white disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Send chat message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <div className="fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--k-color-brand-border)] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
          aria-label="Open Kyochi AI bot"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--k-color-brand-soft)] text-[var(--k-color-brand-strong)]">
            <Leaf className="h-4 w-4" />
          </span>
        </button>
      </div>
    </>
  );
}
