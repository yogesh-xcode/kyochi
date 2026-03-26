"use client";

import { type ComponentType, useMemo } from "react";
import {
  Building2,
  MessageSquare,
  Plus,
  TrendingUp,
  UserCheck,
  Wallet,
} from "lucide-react";

import { FeaturePlaceholder } from "@/components/kyochi/FeaturePlaceholder";
import { AiInsightsSkeleton } from "@/components/kyochi/PageSkeletons";
import { emitKyochiAiPrompt } from "@/lib/aiBotEvents";
import { useBootstrapData } from "@/lib/data/useBootstrapData";
import { formatCurrencyINR, computeDashboardFormulaMetrics } from "@/lib/metrics";
import { resolveUserContext } from "@/lib/roleScope";

type Severity = "critical" | "warning";

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
  tagTone: "green" | "gold" | "teal" | "stone";
  prompt: string;
};


const tagToneMap: Record<Recommendation["tagTone"], string> = {
  green: "k-status-completed",
  gold: "k-status-progress",
  teal: "k-tone-blue",
  stone: "k-status-waiting",
};

export default function WellnessIntelligencePage() {
  const { data, isLoading } = useBootstrapData();
  const context = useMemo(() => resolveUserContext({
    users: data?.users ?? [],
    currentUser: data?.current_user,
  }), [data]);
  const viewRole = context.role; // Now it's dynamic

  const { overdueInvoices, pendingFeedbackCountTotal, appointmentsThisMonth } = useMemo(() => {
    if (!data) return { overdueInvoices: [], pendingFeedbackCountTotal: 0, appointmentsThisMonth: [] };
    const dashboardMetrics = computeDashboardFormulaMetrics({
      appointments: data.appointments,
      billing: data.billing,
      feedback: data.feedback,
      patients: data.patients,
      therapists: data.therapists,
      franchises: data.franchises,
    });
    return {
      overdueInvoices: dashboardMetrics.overdueInvoices,
      pendingFeedbackCountTotal: dashboardMetrics.pendingFeedbackCountTotal,
      appointmentsThisMonth: dashboardMetrics.appointmentsThisMonth,
    };
  }, [data]);

  const uncollectedRevenue = useMemo(() => {
    return overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  }, [overdueInvoices]);

  const patientsAtRiskCount = useMemo(() => {
    if (!data) return 0;
    return data.patients.filter(p => p.wellness_score < 70).length; // Assuming wellness_score < 70 is "at risk"
  }, [data]);

  const signals: Signal[] = useMemo(() => {
    if (!data) return [];

    return [
      {
        id: "uncollected-revenue",
        label: "Uncollected revenue",
        value: formatCurrencyINR(uncollectedRevenue),
        note: `${overdueInvoices.length} overdue invoices. ${Math.round((uncollectedRevenue / data.billing.reduce((sum, inv) => sum + inv.amount, 1)) * 100)}% of total revenue is unpaid.`,
        severity: "critical",
        prompt: `Break down all ${overdueInvoices.length} overdue Kyochi invoices - who owes what, how old each is, and the best recovery approach for each patient.`,
        icon: Wallet,
      },
      {
        id: "retention-risk",
        label: "Patients dropping off",
        value: patientsAtRiskCount.toString(),
        note: `${patientsAtRiskCount} patients below wellness score 70.`,
        severity: "warning",
        prompt: `Which Kyochi patients are at churn risk right now and what personalized message would bring each one back?`,
        icon: UserCheck,
      },
      {
        id: "feedback-gap",
        label: "Missing feedback",
        value: pendingFeedbackCountTotal.toString(),
        note: `${pendingFeedbackCountTotal} sessions completed with no review collected.`,
        severity: "critical",
        prompt: `${pendingFeedbackCountTotal} Kyochi patients completed sessions but left no feedback. Design the fastest way to collect Google reviews from all of them now.`,
        icon: MessageSquare,
      },
      {
        id: "franchise-visibility",
        label: "Franchises",
        value: data.franchises.length.toString(),
        note: `Total active franchises: ${data.franchises.length}.`,
        severity: "warning",
        prompt: `Kyochi has ${data.franchises.length} franchise locations. Design the minimum viable franchise intelligence system they need to build now.`,
        icon: Building2,
      },
    ];
  }, [data, overdueInvoices, pendingFeedbackCountTotal]);

  const recommendations: Recommendation[] = useMemo(() => {
    if (!data) return [];
    // These are currently static, as they represent strategic recommendations
    // which might not be directly derivable from real-time data in this context.
    // They can be made dynamic later based on more sophisticated AI/business logic.
    return [
      {
        id: "feedback-automation",
        title: "Automate post-session feedback via WhatsApp",
        tag: "+20–30 reviews/mo",
        tagTone: "green",
        prompt: "Write the exact WhatsApp automation sequence for Kyochi post-session feedback, including the Google review link prompt and follow-up message if no response in 24 hours.",
      },
      {
        id: "membership-bundle",
        title: "Launch a 5-session prepaid membership bundle",
        tag: "3x LTV uplift",
        tagTone: "gold",
        prompt: "Design the full Kyochi 5-session membership bundle: pricing, session validity, checkout positioning, and the WhatsApp message to announce it.",
      },
      {
        id: "corporate-deal",
        title: "Close one corporate wellness deal in Chennai this month",
        tag: "New B2B stream",
        tagTone: "teal",
        prompt: "Write a 5-slide corporate wellness pitch deck for Kyochi targeting IT companies in Chennai, including service format, pricing tiers, and inclusive employer angle.",
      },
      {
        id: "franchise-reporting",
        title: "Build franchise reporting before adding new locations",
        tag: "Foundation for scale",
        tagTone: "stone",
        prompt: "Design the monthly franchise reporting template for Kyochi: required KPIs, submission format, and low-friction collection workflow.",
      },
    ];
  }, [data]);

  // Dynamic franchise footprint
  const franchiseFootprint = useMemo(() => {
    if (!data) return [];
    const regionCounts = data.franchises.reduce((acc, f) => {
      acc[f.region] = (acc[f.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalFranchises = data.franchises.length;
    if (totalFranchises === 0) return [];

    const sortedRegions = Object.entries(regionCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3);

    // Assign colors dynamically or from a predefined palette
    const colors = [
      "var(--kyochi-gold-400)",
      "var(--kyochi-green-400)",
      "var(--kyochi-gold-600)",
    ];

    return sortedRegions.map(([region, count], index) => ({
      city: region,
      count: `${count} locations`,
      width: `${Math.round((count / totalFranchises) * 100)}%`,
      color: colors[index % colors.length], // Cycle through colors
    }));
  }, [data]);

  // Dynamic therapy demand
  const therapyDemand = useMemo(() => {
    if (!data) return [];
    
    const validStatuses = ["completed", "scheduled", "in_progress"];
    
    const filteredAppointments = appointmentsThisMonth.filter(app => 
      validStatuses.includes(app.status.toLowerCase())
    );

    const therapyCounts = filteredAppointments.reduce((acc, app) => {
      const therapy = data.therapies.find(t => t.id === app.therapy_id);
      if (therapy) {
        acc[therapy.name] = (acc[therapy.name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const totalActiveAppointments = filteredAppointments.length;
    if (totalActiveAppointments === 0) return [];

    const sortedTherapies = Object.entries(therapyCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3);

    // Assign colors dynamically or from a predefined palette
    const colors = [
      "var(--kyochi-green-400)",
      "var(--kyochi-green-400)",
      "var(--kyochi-green-400)",
    ];

    return sortedTherapies.map(([therapyName, count], index) => ({
      therapy: therapyName,
      count: count,
      width: `${Math.round((count / totalActiveAppointments) * 100)}%`,
      color: colors[index % colors.length], // Cycle through colors
    }));
  }, [data, appointmentsThisMonth]);

  if (isLoading) {
    return <AiInsightsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 font-sans text-foreground">
      {/* VERDICT BANNER */}
      <div className="relative overflow-hidden rounded-xl border k-border-soft k-surface px-6 py-4 shadow-sm">
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-primary to-primary/60" />
        <div className="mb-2 flex items-center gap-2">
          <span className="type-label k-brand text-[10px]">
            AI Verdict · Today
          </span>
          <span className="rounded-full k-surface-muted px-2 py-0.5 text-[10px] k-text-subtle font-medium">
            {new Date().toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="mb-4 text-[14px] leading-relaxed k-text-strong">
          {viewRole === "admin" ? (
            <>
              System health stable across all {data?.franchises.length ?? 0} franchises. Key actions:{" "}
              <span className="font-semibold text-destructive">
                resolve {overdueInvoices.length} overdue invoices ({formatCurrencyINR(uncollectedRevenue)})
              </span>
              ,{" "}
              <span className="font-semibold k-brand">
                automate feedback for {pendingFeedbackCountTotal} sessions
              </span>
              , and{" "}
              <span className="font-semibold k-brand-strong">
                review franchise performance
              </span>
              .
            </>
          ) : (
            <>
              Kyochi is growing fast but has areas for improvement:{" "}
              <span className="font-semibold text-destructive">{formatCurrencyINR(uncollectedRevenue)} uncollected</span>,{" "}
              <span className="font-semibold k-brand">{patientsAtRiskCount} patients at risk</span>
              , and{" "}
              <span className="font-semibold k-brand-strong">
                {pendingFeedbackCountTotal} sessions with zero feedback
              </span>
              . Focus on these to protect cash flow and enhance patient experience.
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              emitKyochiAiPrompt(
                `Draft personalized WhatsApp payment reminders for all ${overdueInvoices.length} overdue Kyochi invoices by patient name and amount owed.`,
              )
            }
            className="k-btn k-btn-dark k-btn-sm"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Send reminders
          </button>
          <button
            onClick={() =>
              emitKyochiAiPrompt(
                `Design a post-session WhatsApp feedback and Google review automation flow for Kyochi for ${pendingFeedbackCountTotal} sessions.`,
              )
            }
            className="k-btn k-btn-secondary k-btn-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Feedback flow
          </button>
          <button
            onClick={() =>
              emitKyochiAiPrompt(
                `Create a re-engagement script for the ${patientsAtRiskCount} Kyochi patients currently identified as at risk.`,
              )
            }
            className="k-btn k-btn-secondary k-btn-sm"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Re-engage
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* SIGNALS */}
        <div className="flex flex-col gap-3">
          <div className="type-label k-text-subtle px-1">
            Business signals · click to dive
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {signals.map((signal) => {
              const Icon = signal.icon;
              return (
                <button
                  key={signal.id}
                  onClick={() => emitKyochiAiPrompt(signal.prompt)}
                  className={`k-card relative flex flex-col justify-center p-4 text-left transition-all ${
                    signal.severity === "critical" ? "border-l-[3px] border-l-destructive" : "border-l-[3px] border-l-primary"
                  }`}
                >
                  <div className="mb-3 flex w-full items-center justify-between">
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-lg ${
                        signal.severity === "critical"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span
                      className={`k-badge text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.05em] ${
                        signal.severity === "critical"
                          ? "k-badge-negative"
                          : "k-badge-gold"
                      }`}
                    >
                      {signal.severity === "critical" ? "Critical" : "Warning"}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.07em] k-text-subtle">{signal.label}</p>
                  <div className="mb-0.5 display-heading text-2xl k-text-strong">
                    {signal.value}
                  </div>
                  <div className="text-[11px] leading-relaxed k-text-body line-clamp-2">{signal.note}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="flex flex-col gap-3">
          <div className="type-label k-text-subtle px-1">
            Strategic recommendations · 30 days
          </div>
          <div className="grid flex-1 grid-cols-1 gap-2">
            {recommendations.map((rec, idx) => (
              <button
                key={rec.id}
                onClick={() => emitKyochiAiPrompt(rec.prompt)}
                className="k-card flex items-center gap-3 p-3 text-left transition-all hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-muted/50 font-sans text-xs font-bold k-text-subtle">
                  {idx + 1}
                </span>
                <span className="flex-1 text-[13px] font-semibold leading-snug k-text-strong">
                  {rec.title}
                </span>
                <span
                  className={`flex-none k-badge text-[9px] font-bold uppercase tracking-wider ${tagToneMap[rec.tagTone]}`}
                >
                  {rec.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* FRANCHISE FOOTPRINT */}
        <div className="k-card overflow-hidden">
          <div className="flex items-center justify-between border-b k-border-soft k-surface-muted px-4 py-2.5">
            <span className="text-[12px] font-bold k-text-strong uppercase tracking-wider">Franchise footprint</span>
            <span className="text-[11px] k-text-subtle font-medium">{data?.franchises.length ?? 0} locations</span>
          </div>
          <div className="divide-y k-border-soft">
            {franchiseFootprint.map((item) => (
              <div key={item.city} className="flex items-center gap-3 px-4 py-2.5 hover:k-row-hover transition-colors">
                <span className="h-2 w-2 flex-none rounded-full" style={{ backgroundColor: item.color }} />
                <span className="flex-1 text-[12px] font-medium k-text-strong truncate">{item.city}</span>
                <span className="whitespace-nowrap text-[11px] k-text-subtle">{item.count}</span>
                <div className="k-progress w-20 flex-none bg-muted">
                  <div className="k-progress-fill h-full" style={{ width: item.width, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* THERAPY DEMAND */}
        <div className="k-card overflow-hidden">
          <div className="flex items-center justify-between border-b k-border-soft k-surface-muted px-4 py-2.5">
            <span className="text-[12px] font-bold k-text-strong uppercase tracking-wider">Therapy demand</span>
            <span className="text-[11px] k-text-subtle font-medium">This month</span>
          </div>
          <div className="divide-y k-border-soft">
            {therapyDemand.map((item) => (
              <div key={item.therapy} className="flex items-center gap-3 px-4 py-2.5 hover:k-row-hover transition-colors">
                <span className="flex-1 text-[12px] font-medium k-text-strong truncate">{item.therapy}</span>
                <div className="k-progress w-24 flex-none bg-muted">
                  <div className="k-progress-fill h-full" style={{ width: item.width, backgroundColor: item.color }} />
                </div>
                <span className="w-6 flex-none text-right text-[11px] font-bold k-text-strong">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
