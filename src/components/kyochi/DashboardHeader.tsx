"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { MSO } from "@/components/kyochi/primitives";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Admin Intelligence Dashboard",
    subtitle: "Daily system health and operational summary.",
  },
  "/dashboard": {
    title: "Admin Intelligence Dashboard",
    subtitle: "Daily system health and operational summary.",
  },
  "/patients": {
    title: "Patient Dashboard",
    subtitle: "Track patient wellbeing, progress, and care details.",
  },
  "/therapists": {
    title: "Therapist Directory",
    subtitle: "Manage therapist profiles, availability, and assignment load.",
  },
  "/therapies": {
    title: "Therapy Catalog",
    subtitle: "Review therapy programs and session frameworks.",
  },
  "/appointments": {
    title: "Appointment Details",
    subtitle: "Monitor upcoming sessions and scheduling operations.",
  },
  "/billing": {
    title: "Billing Overview",
    subtitle: "Track invoices, payment status, and financial summaries.",
  },
  "/ai-insights": {
    title: "Wellness Intelligence",
    subtitle: "Explore AI-driven trends and recommendations.",
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "Measure performance with operational and clinical metrics.",
  },
};

type DashboardHeaderProps = {
  onMenuToggle?: () => void;
};

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? pageMeta["/dashboard"];
  const isDashboard = pathname === "/" || pathname === "/dashboard";
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    }
    if (hour < 17) {
      return "Good afternoon";
    }
    return "Good evening";
  }, []);
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  return (
    <header className="bg-white border border-slate-200/70 rounded-2xl px-4 md:px-6 py-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuToggle}
              className="lg:hidden size-8 rounded-lg bg-[#f3f0e6] text-slate-600 hover:text-[#d4af35] transition-colors inline-flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              <MSO className="text-[20px]">menu</MSO>
            </button>
            <h2 className="text-[22px] leading-tight font-extrabold tracking-tight text-slate-900">
              {isDashboard ? `${greeting}, Alex!` : meta.title}
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-0.5 truncate">
            {isDashboard ? "Here's what's happening with your clinic today" : meta.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#f8f7f6] px-3 py-2 text-sm text-slate-700">
            <MSO className="text-[18px] text-slate-500">calendar_today</MSO>
            <span className="font-semibold">{dateLabel}</span>
          </div>
          <button className="relative size-9 rounded-full border border-slate-200 bg-[#f8f7f6] text-slate-600 hover:text-[#d4af35] transition-colors inline-flex items-center justify-center">
            <MSO className="text-[20px]">notifications</MSO>
            <span className="absolute top-1 right-1 size-4 bg-[#ff6a6a] rounded-full text-[10px] text-white font-bold inline-flex items-center justify-center">
              7
            </span>
          </button>
          <button className="size-9 rounded-full bg-slate-900 text-white text-xs font-bold inline-flex items-center justify-center">
            AK
          </button>
          <button className="size-9 rounded-full border border-slate-200 bg-[#f8f7f6] text-slate-500 hover:text-[#d4af35] transition-colors inline-flex items-center justify-center">
            <MSO className="text-[20px]">expand_more</MSO>
          </button>
        </div>
      </div>
    </header>
  );
}
