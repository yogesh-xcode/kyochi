"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import type { BootstrapData } from "@/lib/supabase/types";

type PatientDashboardProps = {
  data: BootstrapData;
  patientId: string;
  patientName: string;
};

const ringStroke = (pct: number, radius = 24) => {
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = circumference - (clamped / 100) * circumference;
  return { circumference, offset };
};

const toDateLabel = (isoLike: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoLike));

const toDateTimeLabel = (isoLike: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoLike));

const toDateShort = (isoLike: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(isoLike));

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

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getTherapyEmoji = (therapyName: string) => {
  const text = therapyName.toLowerCase();
  if (text.includes("femme")) return "🌸";
  if (text.includes("detox")) return "💧";
  return "🌿";
};

export function PatientDashboard({ data, patientId, patientName }: PatientDashboardProps) {
  const therapyById = useMemo(
    () => new Map(data.therapies.map((entry) => [entry.id, entry])),
    [data.therapies],
  );
  const therapistById = useMemo(
    () => new Map(data.therapists.map((entry) => [entry.id, entry])),
    [data.therapists],
  );

  const patient = useMemo(
    () => data.patients.find((entry) => entry.id === patientId),
    [data.patients, patientId],
  );

  const patientAppointments = useMemo(
    () =>
      data.appointments
        .filter((entry) => entry.patient_id === patientId)
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()),
    [data.appointments, patientId],
  );

  const patientFeedback = useMemo(
    () =>
      data.feedback
        .filter((entry) => entry.patient_id === patientId)
        .sort(
          (a, b) =>
            new Date(b.submitted_at ?? b.session_date ?? "1970-01-01").getTime() -
            new Date(a.submitted_at ?? a.session_date ?? "1970-01-01").getTime(),
        ),
    [data.feedback, patientId],
  );

  const ratings = patientFeedback
    .map((entry) => (entry.rating == null ? null : Number(entry.rating)))
    .filter((entry): entry is number => entry != null && Number.isFinite(entry))
    .map((entry) => Math.max(0, Math.min(10, entry * 2)));

  const persistedWellnessScore = asNumber(patient?.wellness_score);
  const latestAiWellness = patientFeedback
    .map((entry) => asNumber(entry.feedback_payload?.ai_wellness_score))
    .find((value): value is number => value !== null);
  const effectiveWellnessScore = persistedWellnessScore ?? latestAiWellness ?? 0;
  const overallRating = effectiveWellnessScore / 10;
  const oldestRating = ratings.length > 0 ? ratings[ratings.length - 1] : overallRating;
  const reliefDelta = oldestRating - overallRating;
  const latestAiReliefDelta = patientFeedback
    .map((entry) => asNumber(entry.feedback_payload?.ai_relief_delta))
    .find((value): value is number => value !== null);
  const latestAiRecoveryOutlook = patientFeedback
    .map((entry) => asNumber(entry.feedback_payload?.ai_recovery_outlook))
    .find((value): value is number => value !== null);
  const displayedReliefDelta = latestAiReliefDelta ?? reliefDelta;
  const progressPct = oldestRating > 0 ? ((overallRating - oldestRating) / oldestRating) * 100 : 0;
  const completedAppointments = patientAppointments.filter((entry) => entry.status === "completed");
  const upcomingAppointments = patientAppointments.filter((entry) =>
    ["waiting", "scheduled", "in_progress"].includes(entry.status),
  );

  const nextAppointment = upcomingAppointments[0] ?? null;
  const progressOutlookFallback = Math.round(clamp(50 + progressPct * 1.2, 15, 90));
  const recoveryOutlook = Math.round(
    clamp(
      latestAiRecoveryOutlook ?? (effectiveWellnessScore * 0.75 + progressOutlookFallback * 0.25),
      0,
      100,
    ),
  );
  const recoveryBadge =
    recoveryOutlook >= 75
      ? "strong trajectory"
      : recoveryOutlook >= 50
        ? "steady recovery"
        : "watch closely";

  const wellnessPct = Math.max(0, Math.min(100, Math.round(effectiveWellnessScore)));
  const overallDelta = progressPct >= 0 ? `+${progressPct.toFixed(0)}% this month` : `${progressPct.toFixed(0)}% this month`;

  const completedWithFeedback = completedAppointments
    .map((entry) => {
      const feedback = patientFeedback.find((fb) => fb.appointment_id === entry.id);
      if (feedback?.rating == null) return null;
      const score = Number(feedback.rating);
      if (!Number.isFinite(score)) return null;
      return {
        appointment: entry,
        score: Math.max(0, Math.min(10, score * 2)),
      };
    })
    .filter((entry): entry is { appointment: (typeof completedAppointments)[number]; score: number } => entry != null)
    .sort((a, b) => new Date(a.appointment.starts_at).getTime() - new Date(b.appointment.starts_at).getTime());

  const ratingSeries = completedWithFeedback.slice(-5).map((entry) => Number(entry.score.toFixed(1)));

  const displayName = patientName || patient?.full_name || "Patient";
  const firstName = displayName.split(" ")[0] ?? "Patient";
  const therapyName = nextAppointment ? therapyById.get(nextAppointment.therapy_id)?.name ?? "Upcoming session" : "No upcoming session";
  const therapistName = nextAppointment ? therapistById.get(nextAppointment.therapist_id)?.full_name ?? "Therapist TBD" : "Book a session to get started";
  const upcomingDateTime = nextAppointment ? toDateTimeLabel(nextAppointment.starts_at) : null;
  const lastCompletedDate = completedAppointments.length > 0
    ? toDateLabel(completedAppointments[completedAppointments.length - 1].starts_at)
    : "—";

  const kpis = [
    {
      label: "Recovery outlook",
      value: String(recoveryOutlook),
      unit: "/100",
      pct: recoveryOutlook,
      color: "#3a7a8c",
      badge: recoveryBadge,
      badgeTone: "green",
    },
    {
      label: "Relief delta",
      value: `${displayedReliefDelta >= 0 ? "-" : "+"}${Math.abs(displayedReliefDelta).toFixed(1)}`,
      unit: "pts",
      pct: Math.min(100, Math.round(Math.abs(displayedReliefDelta) * 20)),
      color: "#3fa060",
      badge: "↓ best yet",
      badgeTone: "green",
    },
    {
      label: "Session streak",
      value: String(completedAppointments.length),
      unit: "sessions",
      pct: Math.min(100, Math.round((completedAppointments.length / Math.max(patientAppointments.length, 1)) * 100)),
      color: "#d4af35",
      badge: "● active",
      badgeTone: "gold",
    },
    {
      label: "Progress",
      value: `${progressPct >= 0 ? "+" : ""}${progressPct.toFixed(0)}`,
      unit: "%",
      pct: Math.min(100, Math.round(Math.abs(progressPct))),
      color: "#3fa060",
      badge: "↑ trending",
      badgeTone: "green",
    },
  ];

  const historicalTrend = ratingSeries.slice(-2);
  const trendPoints =
    historicalTrend.length === 2
      ? [historicalTrend[0], historicalTrend[1], overallRating]
      : historicalTrend.length === 1
        ? [historicalTrend[0], historicalTrend[0], overallRating]
        : [overallRating, overallRating, overallRating];
  const trendLabels = trendPoints.map((_, index) =>
    index === trendPoints.length - 1 ? "Now" : `S${index + 1}`,
  );
  const recentCompleted = completedAppointments
    .slice()
    .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <section className="rounded-[14px] border border-[#ddd8cc] bg-white px-5 py-5">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[auto_1fr_320px]">
          <div className="flex justify-center lg:justify-start">
            <div className="relative h-[108px] w-[108px]">
              {(() => {
                const { circumference, offset } = ringStroke(wellnessPct, 42);
                return (
                  <svg width="108" height="108" viewBox="0 0 108 108" aria-hidden="true">
                    <circle cx="54" cy="54" r="42" fill="none" stroke="#ede8dc" strokeWidth="10" />
                    <circle
                      cx="54"
                      cy="54"
                      r="42"
                      fill="none"
                      stroke="#c8993a"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      transform="rotate(-90 54 54)"
                    />
                  </svg>
                );
              })()}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="display-heading text-[26px] leading-none text-[#2c2416]">{wellnessPct}%</p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a09080]">wellness</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c8993a]">Overall wellness score</p>
            <p className="display-heading mt-1 text-[22px] italic leading-[1.18] text-[#2c2416]">
              You&apos;re making great
              <br />
              progress, {firstName}
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-[#ede8dc]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#c8993a] to-[#e8c970]" style={{ width: `${wellnessPct}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f0ede6] px-2.5 py-1 text-[12px] font-medium text-[#7a6a52]">
                {completedAppointments.length} sessions completed
              </span>
              <span className="rounded-full bg-[#f0ede6] px-2.5 py-1 text-[12px] font-medium text-[#7a6a52]">
                Last: {lastCompletedDate}
              </span>
              <span className="rounded-full bg-[#f5dede] px-2.5 py-1 text-[12px] font-medium text-[#995050]">
                {overallDelta}
              </span>
            </div>
          </div>

          <div className="w-full lg:w-[320px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a09080]">Upcoming session</p>
            <p className="display-heading mt-1 text-[18px] leading-[1.2] text-[#2c2416]">{therapyName}</p>
            <p className="mt-1 text-[12px] text-[#7a6a52]">
              {nextAppointment ? `${therapistName} · 60 min · KO City Tower` : therapistName}
            </p>
            {upcomingDateTime ? (
              <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-[#eaf0ff] px-3 py-1.5 text-[12px] font-semibold text-[#3a5ab5]">
                <span>📅</span>
                <span>Upcoming: {upcomingDateTime}</span>
              </div>
            ) : null}
            <div className="mt-3">
              <Link href={`/appointments?create=1&patient=${encodeURIComponent(patientId)}&patientName=${encodeURIComponent(displayName)}`}>
                <Button className="h-11 w-full rounded-[9px] bg-[#2c2416] text-[13px] font-medium text-[#f7f4ee] hover:bg-[#c8993a]">
                  {nextAppointment ? "Book another session →" : "Book session →"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => {
          const { circumference, offset } = ringStroke(kpi.pct, 28);
          const tagClass =
            index === 0
              ? "bg-[#d4e8d8] text-[#3a6a50]"
              : index === 1
                ? "bg-[#f5dede] text-[#995050]"
                : index === 2
                  ? "bg-[#fdf3dc] text-[#a07020]"
                  : "bg-[#d4ebf0] text-[#2a6a7c]";
          return (
            <article key={kpi.label} className="rounded-[12px] border border-[#ddd8cc] bg-white p-4 text-center">
              <div className="relative mx-auto h-[72px] w-[72px]">
                <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#ede8dc" strokeWidth="7" />
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke={index === 0 || index === 2 ? "#c8993a" : index === 1 ? "#4e8060" : "#3a7a8c"}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 36 36)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="display-heading text-[17px] leading-none text-[#2c2416]">{kpi.value}</p>
                  <p className="mt-0.5 text-[8px] text-[#a09080]">{kpi.unit}</p>
                </div>
              </div>
              <p className="mt-2 text-[13px] font-medium text-[#2c2416]">{kpi.label}</p>
              <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${tagClass}`}>{kpi.badge}</p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_380px]">
        <article className="overflow-hidden rounded-[12px] border border-[#ddd8cc] bg-white">
          <div className="flex items-start justify-between border-b border-[#ede8dc] px-4 py-3">
            <div>
              <p className="text-[13px] font-medium text-[#2c2416]">Wellness over time</p>
              <p className="text-[11px] text-[#a09080]">All therapies · {completedAppointments.length} sessions</p>
            </div>
            <span className="text-[11px] font-medium text-[#c8993a]">
              {progressPct >= 0 ? "+" : ""}
              {progressPct.toFixed(0)}% overall
            </span>
          </div>
          <div className="px-4 py-4">
            <div className="flex h-[150px] items-end gap-2">
              {trendPoints.map((point, index) => {
                const height = Math.max(24, Math.round((Math.max(0, Math.min(10, point)) / 10) * 118));
                const isNow = index === trendPoints.length - 1;
                return (
                  <div key={`trend-${index}`} className="flex-1">
                    <p className="mb-1 text-center text-[11px] font-medium text-[#6a5e50]">{point.toFixed(1)}</p>
                    <div className="flex h-[118px] items-end">
                      <div className={`w-full rounded-t-md ${isNow ? "bg-[#d9d5cb]" : "bg-[#5a9a6a]"}`} style={{ height: `${height}px` }} />
                    </div>
                    <p className={`mt-1 text-center text-[10px] ${isNow ? "text-[#c8993a]" : "text-[#a09080]"}`}>{trendLabels[index]}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between border-t border-[#f0ede6] bg-[#fdfcf9] px-4 py-2 text-[11px] text-[#7a6a52]">
            <span>Started <span className="font-medium text-[#2c2416]">{trendPoints[0]?.toFixed(1) ?? "—"}</span></span>
            <span><span className="font-medium text-[#2c2416]">{new Set(completedAppointments.map((entry) => entry.therapy_id)).size}</span> therapies</span>
            <span>Now <span className="font-medium text-[#c8993a]">{trendPoints[trendPoints.length - 1]?.toFixed(1) ?? "—"} ↑</span></span>
          </div>
        </article>

        <article className="overflow-hidden rounded-[12px] border border-[#ddd8cc] bg-white">
          <div className="flex items-start justify-between border-b border-[#ede8dc] px-4 py-3">
            <div>
              <p className="text-[13px] font-medium text-[#2c2416]">Session history</p>
              <p className="text-[11px] text-[#a09080]">{completedAppointments.length} completed</p>
            </div>
            <span className="text-[11px] font-medium text-[#c8993a]">All done</span>
          </div>
          <div>
            {recentCompleted.length === 0 ? (
              <div className="px-4 py-8 text-center text-[14px] text-[#a09080]">No completed sessions yet.</div>
            ) : (
              recentCompleted.map((entry) => {
                const therapy = therapyById.get(entry.therapy_id)?.name ?? "Therapy";
                const therapist = therapistById.get(entry.therapist_id)?.full_name ?? "Therapist";
                const feedback = patientFeedback.find((fb) => fb.appointment_id === entry.id);
                const score = feedback?.rating != null ? Number(feedback.rating) * 2 : null;
                return (
                  <div key={`history-${entry.id}`} className="flex items-center gap-3 border-b border-[#f0ede6] px-4 py-3 last:border-b-0">
                    <div className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#f0ede6] text-[16px]">
                      {getTherapyEmoji(therapy)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[#2c2416]">{therapy}</p>
                      <p className="truncate text-[11px] text-[#a09080]">{therapist} · {toDateShort(entry.starts_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="display-heading text-[18px] leading-none text-[#c8993a]">{score != null ? score.toFixed(1) : "—"}</p>
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3a6a50]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3a6a50]" />
                        done
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

export default PatientDashboard;
