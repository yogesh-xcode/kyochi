"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, Clock3, Star, StickyNote } from "lucide-react";

import { buildDashboardData } from "@/components/kyochi/data";
import { KpiGrid } from "@/components/kyochi/KpiGrid";
import { StatusPill } from "@/components/kyochi/primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TherapistDashboardProps = {
  dashboard: ReturnType<typeof buildDashboardData>;
};

export function TherapistDashboard({ dashboard }: TherapistDashboardProps) {
  const toDateTag = (isoLike: string) => {
    if (!isoLike) {
      return "Recent";
    }
    const source = new Date(isoLike);
    if (Number.isNaN(source.getTime())) {
      return "Recent";
    }
    const today = new Date();
    const sourceDate = new Date(source.getFullYear(), source.getMonth(), source.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.round((todayDate.getTime() - sourceDate.getTime()) / 86400000);
    if (diffDays <= 0) {
      return "Today";
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    return source.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const toRelativeAge = (isoLike: string) => {
    if (!isoLike) {
      return "recent";
    }
    const source = new Date(isoLike);
    if (Number.isNaN(source.getTime())) {
      return "recent";
    }
    const minutes = Math.max(1, Math.round((Date.now() - source.getTime()) / 60000));
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.round(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.round(hours / 24);
    if (days <= 7) {
      return `${days}d ago`;
    }
    return source.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const scheduleItems = useMemo(
    () => dashboard.recentAppointments.slice(0, 5),
    [dashboard.recentAppointments],
  );
  const pendingFeedbackCount = useMemo(() => {
    const pendingFeedbackCard = dashboard.kpiCards.find(
      (card) => card.label.toLowerCase() === "pending feedback",
    );
    return Number.parseInt(pendingFeedbackCard?.value ?? "0", 10) || 0;
  }, [dashboard.kpiCards]);

  const completedCount = scheduleItems.filter(
    (item) => item.status.trim().toLowerCase() === "completed",
  ).length;
  const upcomingCount = scheduleItems.filter((item) => {
    const status = item.status.trim().toLowerCase();
    return status === "scheduled" || status === "waiting" || status === "in progress";
  }).length;
  const totalSessions = Math.max(dashboard.patientInflow.todayCount, completedCount + upcomingCount, 1);
  const progressPct = Math.min(100, Math.round((completedCount / totalSessions) * 100));

  const ringRadius = 43;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference - (progressPct / 100) * ringCircumference;

  return (
    <div className="space-y-4">
      <KpiGrid cards={dashboard.kpiCards} />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Card className="k-surface rounded-xl shadow-sm border k-border-soft py-0 ring-0 gap-0 overflow-hidden">
          <CardHeader className="px-3.5 py-3 border-b k-border-soft flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[14px] font-semibold k-text-strong">Today&apos;s Schedule</CardTitle>
              <p className="text-[11px] mt-0.5 k-text-subtle">Live session timeline</p>
            </div>
            <Link href="/appointments" className="text-[11px] font-semibold k-brand inline-flex items-center gap-1">
              Full Calendar
              <ChevronRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="px-0 py-0">
            {scheduleItems.length === 0 ? (
              <div className="px-4 py-7 text-center">
                <p className="text-[13px] font-semibold k-text-strong">No sessions yet</p>
                <p className="text-[11px] mt-1 k-text-body">Today&apos;s appointments will appear here.</p>
              </div>
            ) : (
              scheduleItems.map((item) => (
                <div key={`sched-${item.id}`} className="px-3.5 py-2.5 border-b last:border-b-0 k-border-soft flex items-center gap-2.5">
                  <div className="min-w-[60px] rounded-lg bg-[var(--k-color-surface-muted)] px-2 py-1.5 text-center">
                    <p className="text-[12px] font-semibold leading-none k-text-strong">{item.time}</p>
                    <p className="text-[9px] mt-0.5 font-medium k-text-subtle">{item.period}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold truncate k-text-strong">{item.name}</p>
                    <p className="text-[11px] truncate k-text-body">{item.detail}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="k-surface rounded-xl shadow-sm border k-border-soft py-0 ring-0 gap-0 overflow-hidden">
          <CardHeader className="px-3.5 py-3 border-b k-border-soft flex flex-row items-center justify-between">
            <CardTitle className="text-[14px] font-semibold k-text-strong">Sessions Today</CardTitle>
            <span className="text-[11px] font-semibold k-brand">+{dashboard.patientInflow.todayCount} inflow</span>
          </CardHeader>
          <CardContent className="px-3.5 pt-3 pb-2">
            <div className="flex items-center justify-center">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={ringRadius} fill="none" stroke="#eee7d7" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r={ringRadius}
                  fill="none"
                  stroke="#c8993a"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringDashOffset}
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="56" textAnchor="middle" className="fill-[var(--k-color-text-strong)] text-[22px] font-semibold">
                  {completedCount}
                </text>
                <text x="60" y="72" textAnchor="middle" className="fill-[var(--k-color-text-subtle)] text-[9px]">
                  of {totalSessions} sessions
                </text>
              </svg>
            </div>
            <div className="grid grid-cols-2 border rounded-lg overflow-hidden mt-1.5 k-border-soft">
              <div className="py-2 text-center border-r k-border-soft">
                <p className="text-[17px] font-semibold leading-none k-text-strong">{completedCount}</p>
                <p className="text-[10px] mt-1 k-text-subtle">Completed</p>
              </div>
              <div className="py-2 text-center">
                <p className="text-[17px] font-semibold leading-none k-text-strong">{upcomingCount}</p>
                <p className="text-[10px] mt-1 k-text-subtle">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.4fr_1fr_1fr]">
        <Card className="k-surface rounded-xl shadow-sm border k-border-soft py-0 ring-0 gap-0 overflow-hidden">
          <CardHeader className="px-3.5 py-3 border-b k-border-soft flex flex-row items-center justify-between">
            <CardTitle className="text-[14px] font-semibold k-text-strong">Recent Appointments</CardTitle>
            <Link href="/appointments" className="text-[11px] font-semibold k-brand">Open full schedule</Link>
          </CardHeader>
          <CardContent className="px-0 py-0">
            {dashboard.recentAppointments.map((item) => (
              <div key={`recent-${item.id}`} className="px-3.5 py-2.5 border-b last:border-b-0 k-border-soft flex items-center gap-2.5">
                <div className="min-w-[60px] rounded-lg bg-[var(--k-color-surface-muted)] px-2 py-1.5 text-center">
                  <p className="text-[12px] font-semibold leading-none k-text-strong">{item.time}</p>
                  <p className="text-[9px] mt-0.5 font-medium k-text-subtle">{item.period}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold truncate k-text-strong">{item.name}</p>
                  <p className="text-[11px] truncate k-text-body">{item.detail}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="k-surface rounded-xl shadow-sm border k-border-soft py-0 ring-0 gap-0 overflow-hidden">
          <CardHeader className="px-3.5 py-3 border-b k-border-soft flex flex-row items-center justify-between">
            <CardTitle className="text-[14px] font-semibold k-text-strong inline-flex items-center gap-1.5">
              <StickyNote className="size-3.5" />
              Patient Feedback
            </CardTitle>
            <span className="text-[11px] font-semibold k-brand">Add note</span>
          </CardHeader>
          <CardContent className="px-0 py-0">
            {dashboard.therapistNotes.length === 0 ? (
              <div className="px-4 py-7 text-center">
                <p className="text-[13px] font-semibold k-text-strong">No patient notes</p>
                <p className="text-[11px] mt-1 k-text-body">Session notes will appear after feedback updates.</p>
              </div>
            ) : (
              dashboard.therapistNotes.map((note) => (
                <div key={`note-${note.id}`} className="px-3.5 py-2.5 border-b last:border-b-0 k-border-soft">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-[var(--k-color-brand-soft)] k-brand-strong text-[10px] font-bold inline-flex items-center justify-center">
                      {note.patientAvatar}
                    </div>
                    <p className="text-[12px] font-semibold k-text-strong">{note.patientName}</p>
                    <span className="ml-auto text-[10px] k-text-subtle">{toDateTag(note.observedAt)}</span>
                  </div>
                  <p className="text-[11px] mt-1.5 leading-[1.45] k-text-body pl-8">
                    {note.note}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="k-surface rounded-xl shadow-sm border k-border-soft py-0 ring-0 gap-0 overflow-hidden">
          <CardHeader className="px-3.5 py-3 border-b k-border-soft flex flex-row items-center justify-between">
            <CardTitle className="text-[14px] font-semibold k-text-strong">Pending Feedback</CardTitle>
            <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 bg-[#f5dede] text-[#995050]">
              {pendingFeedbackCount} new
            </span>
          </CardHeader>
          <CardContent className="px-0 py-0">
            {dashboard.pendingFeedbackItems.length === 0 ? (
              <div className="px-4 py-7 text-center">
                <p className="text-[13px] font-semibold k-text-strong">No feedback records</p>
                <p className="text-[11px] mt-1 k-text-body">Feedback activity will appear here.</p>
              </div>
            ) : (
              dashboard.pendingFeedbackItems.map((item) => (
                <div key={`feedback-${item.id}`} className="px-3.5 py-2.5 border-b last:border-b-0 k-border-soft flex items-center gap-2.5">
                  <div className="size-7 rounded-full bg-[var(--k-color-surface-muted)] text-[10px] font-bold k-text-body inline-flex items-center justify-center">
                    {item.patientAvatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold truncate k-text-strong">{item.patientName}</p>
                    <p className="text-[11px] truncate k-text-body">{item.therapyName}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="inline-flex items-center gap-0.5 text-[#c8993a]">
                      {Array.from({ length: 5 }).map((_, starIndex) => {
                        const filled = (item.rating ?? 0) >= starIndex + 1;
                        return (
                          <Star
                            key={`${item.id}-star-${starIndex}`}
                            className={`size-3 ${filled ? "fill-current stroke-current" : "stroke-current"}`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-[10px] k-text-subtle mt-0.5 inline-flex items-center gap-1">
                      <Clock3 className="size-3" />
                      {toRelativeAge(item.observedAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TherapistDashboard;
