"use client";

import { type ComponentType } from "react";
import {
  ArrowUpRight,
  Building2,
  MessageSquare,
  Minus,
  Phone,
  Wallet,
} from "lucide-react";

import { emitKyochiAiPrompt } from "@/lib/aiBotEvents";

type Severity = "critical" | "warning" | "opportunity";

type Signal = {
  id: string;
  label: string;
  value: string;
  note: string;
  severity: Severity;
  prompt: string;
  icon: ComponentType<{ className?: string }>;
};

type Recommendation = {
  id: string;
  title: string;
  tag: string;
  tagTone: "success" | "warning";
  body: string;
  impact: string;
  prompt: string;
};

const signals: Signal[] = [
  {
    id: "uncollected-revenue",
    label: "Uncollected revenue",
    value: "Rs 3,200",
    note: "12 overdue invoices. 22% of all revenue raised is sitting unpaid.",
    severity: "critical",
    prompt:
      "Break down all 12 overdue Kyochi invoices - who owes what, how old each is, and the best recovery approach for each patient.",
    icon: Wallet,
  },
  {
    id: "retention-risk",
    label: "Patients dropping off",
    value: "7",
    note: "Stalled in waiting with no next booking. Each is Rs 800-1,500 LTV at risk.",
    severity: "warning",
    prompt:
      "Which Kyochi patients are at churn risk right now and what personalized message would bring each one back?",
    icon: Minus,
  },
  {
    id: "feedback-gap",
    label: "Missing feedback",
    value: "36",
    note: "Sessions completed with no review collected. 4.9 star rating is stalling.",
    severity: "critical",
    prompt:
      "36 Kyochi patients completed sessions but left no feedback. Design the fastest way to collect Google reviews from all of them now.",
    icon: MessageSquare,
  },
  {
    id: "franchise-visibility",
    label: "Franchises, zero data",
    value: "25",
    note: "No cross-location visibility. Biggest strategic blind spot in the business.",
    severity: "warning",
    prompt:
      "Kyochi has 25 franchise locations with no unified reporting. Design the minimum viable franchise intelligence system they need to build now.",
    icon: Building2,
  },
];

const recommendations: Recommendation[] = [
  {
    id: "feedback-automation",
    title: "Automate post-session feedback via WhatsApp",
    tag: "+20-30 reviews/month",
    tagTone: "success",
    body: "Your 4.9 star rating is your top acquisition asset, and it is stalling. 36 completed sessions generated zero reviews this cycle. A single WhatsApp message 2 hours post-session can double monthly review volume with almost no team effort.",
    impact: "Rs 0 cost - highest acquisition ROI available",
    prompt:
      "Write the exact WhatsApp automation sequence for Kyochi post-session feedback, including the Google review link prompt and follow-up message if no response in 24 hours.",
  },
  {
    id: "membership-bundle",
    title: "Launch a 5-session prepaid membership bundle",
    tag: "3x LTV uplift",
    tagTone: "success",
    body: "Repeat patients are already returning without incentive. A prepaid bundle (5 sessions plus 1 free) creates upfront cash, reduces no-shows, and builds therapy continuity. This becomes a differentiated offer in your current regional market.",
    impact: "Upfront cash + guaranteed retention",
    prompt:
      "Design the full Kyochi 5-session membership bundle: pricing, session validity, checkout positioning, and the WhatsApp message to announce it.",
  },
  {
    id: "corporate-deal",
    title: "Close one corporate wellness deal in Chennai this month",
    tag: "New B2B revenue stream",
    tagTone: "warning",
    body: "Chennai IT expansion is creating exactly the stress profile Kyochi serves. One corporate tie-up gives recurring B2B revenue that is less sensitive to walk-ins and social trends.",
    impact: "Rs 20,000-50,000/month per corporate client",
    prompt:
      "Write a 5-slide corporate wellness pitch deck for Kyochi targeting IT companies in Chennai, including service format, pricing tiers, and inclusive employer angle.",
  },
  {
    id: "franchise-reporting",
    title: "Build franchise reporting before adding new locations",
    tag: "Foundation for scale",
    tagTone: "warning",
    body: "25 locations across 11 cities with no unified performance reporting introduces major execution risk. Monthly reporting from each owner gives HQ visibility to intervene early and replicate what works.",
    impact: "Protects brand quality at scale",
    prompt:
      "Design the monthly franchise reporting template for Kyochi: required KPIs, submission format, and low-friction collection workflow.",
  },
];

const franchiseFootprint = [
  { city: "Chennai", count: "11 locations", width: "100%", color: "bg-[#b8960c]" },
  { city: "Coimbatore", count: "4 locations", width: "38%", color: "bg-[#ba7517]" },
  { city: "Madurai / Trichy / Salem", count: "1 each", width: "12%", color: "bg-[#639922]" },
  { city: "6 other cities", count: "1 each", width: "12%", color: "bg-[#b4b2a9]" },
];

const therapyDemand = [
  { therapy: "Relaxation Reflex.", count: 16, width: "100%", color: "bg-[#b8960c]" },
  { therapy: "De-Stress Reflex.", count: 14, width: "88%", color: "bg-[#ba7517]" },
  { therapy: "Chronic Pain", count: 14, width: "88%", color: "bg-[#ba7517]" },
  { therapy: "Sole Serenity", count: 10, width: "62%", color: "bg-[#d3d1c7]" },
];

const severityMap: Record<
  Severity,
  {
    label: string;
    cardTone: string;
    pillTone: string;
    iconTone: string;
  }
> = {
  critical: {
    label: "Critical",
    cardTone: "hover:border-[#b8960c]",
    pillTone: "bg-[#fcebeb] text-[#a32d2d]",
    iconTone: "bg-[#fcebeb] text-[#a32d2d]",
  },
  warning: {
    label: "Warning",
    cardTone: "hover:border-[#b8960c]",
    pillTone: "bg-[#faeeda] text-[#854f0b]",
    iconTone: "bg-[#faeeda] text-[#854f0b]",
  },
  opportunity: {
    label: "Opportunity",
    cardTone: "hover:border-[#b8960c]",
    pillTone: "bg-[#eaf3de] text-[#3b6d11]",
    iconTone: "bg-[#eaf3de] text-[#3b6d11]",
  },
};

export default function AiInsightsPage() {
  return (
    <div className="space-y-1.5 pb-1.5">
      <section className="p-0">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-1.5">
          <div>
            <h1 className="text-lg font-semibold text-[var(--k-color-text-strong)]">AI Strategy</h1>
            <p className="text-xs text-[var(--k-color-text-subtle)]">
              Kyochi Wellness Intelligence · March 2026
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#b8960c] bg-[#fdf6e3] px-2.5 py-1 text-[11px] font-medium text-[#854f0b]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#b8960c]" />
            Live · 54 appointments · 48 patients · 25 franchises
          </div>
        </div>

        <article className="mb-2.5 rounded-b-xl rounded-t-md border border-[var(--k-color-border-soft)] border-t-[3px] border-t-[#b8960c] bg-white px-3 py-2.5 md:px-4 md:py-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b8960c]">
            AI verdict - today
          </p>
          <p className="mb-2.5 text-sm leading-normal text-[var(--k-color-text-strong)]">
            Kyochi is growing fast but leaking in three places: <span className="font-semibold text-[#a32d2d]">Rs
            3,200 in uncollected invoices</span>, <span className="font-semibold text-[#854f0b]">7 patients
            stalling before rebooking</span>, and <span className="font-semibold text-[#854f0b]">36 completed
            sessions with zero feedback collected</span>. Fix these this week to protect cash flow and your 4.9
            star rating.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() =>
                emitKyochiAiPrompt(
                  "Draft personalized WhatsApp payment reminders for all 12 overdue Kyochi invoices by patient name and amount owed.",
                )
              }
              className="inline-flex h-[30px] items-center gap-1.5 rounded-md bg-[#b8960c] px-3 text-[11px] font-semibold text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              Send payment reminders
            </button>
            <button
              type="button"
              onClick={() =>
                emitKyochiAiPrompt(
                  "Design a post-session WhatsApp feedback and Google review automation flow for Kyochi.",
                )
              }
              className="inline-flex h-[30px] items-center rounded-md border border-[var(--k-color-border-soft)] bg-white px-3 text-[11px] font-medium text-[var(--k-color-text-strong)]"
            >
              Design feedback flow
            </button>
            <button
              type="button"
              onClick={() =>
                emitKyochiAiPrompt(
                  "Create a re-engagement script for the 7 Kyochi patients currently stuck in waiting status.",
                )
              }
              className="inline-flex h-[30px] items-center rounded-md border border-[var(--k-color-border-soft)] bg-white px-3 text-[11px] font-medium text-[var(--k-color-text-strong)]"
            >
              Re-engage waiting patients
            </button>
          </div>
        </article>

        <div className="mb-2.5 grid grid-cols-1 gap-2 xl:grid-cols-2 xl:items-stretch">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--k-color-text-subtle)]">
              Business signals - click any to deep dive
            </p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {signals.map((signal) => {
                const Icon = signal.icon;
                const tones = severityMap[signal.severity];
                return (
                  <button
                    key={signal.id}
                    type="button"
                    onClick={() => emitKyochiAiPrompt(signal.prompt)}
                    className={`rounded-xl border border-[var(--k-color-border-soft)] bg-white p-2.5 text-left transition ${tones.cardTone}`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${tones.iconTone}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tones.pillTone}`}>
                        {tones.label}
                      </span>
                    </div>
                    <p className="mb-0.5 text-[2rem] font-semibold leading-none text-[var(--k-color-text-strong)]">
                      {signal.value}
                    </p>
                    <p className="mb-0.5 text-xs font-semibold text-[var(--k-color-text-strong)]">{signal.label}</p>
                    <p className="text-[11px] leading-snug text-[var(--k-color-text-subtle)]">{signal.note}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--k-color-text-subtle)]">
              Strategic recommendations - next 30 days
            </p>
            <div className="flex flex-1 flex-col gap-2">
              {recommendations.map((rec, index) => {
                return (
                  <article
                    key={rec.id}
                    className="flex-1 overflow-hidden rounded-xl border border-[var(--k-color-border-soft)] bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => emitKyochiAiPrompt(rec.prompt)}
                      className="flex h-full w-full items-center gap-3 px-3 py-2 text-left"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#fdf6e3] text-[10px] font-semibold text-[#b8960c]">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm font-semibold text-[var(--k-color-text-strong)]">{rec.title}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          rec.tagTone === "success"
                            ? "bg-[#eaf3de] text-[#3b6d11]"
                            : "bg-[#faeeda] text-[#854f0b]"
                        }`}
                      >
                        {rec.tag}
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 text-[var(--k-color-text-subtle)]"
                      />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-1 gap-2 xl:grid-cols-2">
          <article className="rounded-xl border border-[var(--k-color-border-soft)] bg-white p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--k-color-text-subtle)]">
              Franchise footprint
            </p>
            <div className="space-y-1.5">
              {franchiseFootprint.map((item) => (
                <div key={item.city} className="flex items-center gap-2 border-b border-[var(--k-color-border-soft)] pb-1.5">
                  <span className="h-2 w-2 flex-none rounded-full bg-[#b8960c]" />
                  <p className="flex-1 text-xs font-semibold text-[var(--k-color-text-strong)]">{item.city}</p>
                  <p className="text-[11px] text-[var(--k-color-text-subtle)]">{item.count}</p>
                  <div className="h-1 w-14 rounded-full bg-[var(--k-color-surface-muted)]">
                    <div className={`h-1 rounded-full ${item.color}`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[var(--k-color-border-soft)] bg-white p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--k-color-text-subtle)]">
              Therapy demand
            </p>
            <div className="space-y-1.5">
              {therapyDemand.map((item) => (
                <div key={item.therapy} className="flex items-center gap-2 border-b border-[var(--k-color-border-soft)] pb-1.5">
                  <p className="flex-1 text-[11px] font-medium text-[var(--k-color-text-strong)]">{item.therapy}</p>
                  <div className="h-1.5 w-20 rounded-full bg-[var(--k-color-surface-muted)]">
                    <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: item.width }} />
                  </div>
                  <p className="min-w-5 text-right text-[11px] font-semibold text-[var(--k-color-text-subtle)]">
                    {item.count}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
