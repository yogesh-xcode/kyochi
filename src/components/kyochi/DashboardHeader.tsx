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
    <header className="space-y-4">
      <div className="rounded-2xl border border-[#d4af35]/20 bg-gradient-to-r from-[#f8f4e8] via-[#fdfcf7] to-[#f3ecd8] px-4 sm:px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={onMenuToggle}
                className="lg:hidden size-8 rounded-lg bg-white/90 text-slate-600 hover:text-[#d4af35] transition-colors inline-flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                <MSO className="text-[20px]">menu</MSO>
              </button>
              <p className="type-body font-extrabold text-slate-900">
                {greeting}, <span className="text-[#d4af35]">Alex</span>
              </p>
            </div>
            <p className="type-small text-slate-500 mt-1 truncate">Karaikudi Unit · {dateLabel}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="size-9 rounded-xl border border-[#d4af35]/20 bg-white/80 text-slate-500 hover:text-[#d4af35] hover:border-[#d4af35]/40 transition-colors inline-flex items-center justify-center">
              <MSO className="text-[20px]">search</MSO>
            </button>
            <button className="relative size-9 rounded-xl border border-[#d4af35]/20 bg-white/80 text-slate-500 hover:text-[#d4af35] hover:border-[#d4af35]/40 transition-colors inline-flex items-center justify-center">
              <MSO className="text-[20px]">notifications</MSO>
              <span className="absolute top-2 right-2 size-1.5 bg-red-500 rounded-full" />
            </button>
            <button className="h-9 px-3 rounded-xl bg-[#d4af35] text-[#3d2d04] font-semibold text-sm hover:bg-[#e2be52] transition-colors inline-flex items-center gap-1.5">
              <MSO className="text-[18px]">download</MSO>
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="type-h1 text-slate-900 tracking-tight">{meta.title}</h2>
        <p className="type-body text-slate-500 mt-1">{meta.subtitle}</p>
      </div>
    </header>
  );
}
