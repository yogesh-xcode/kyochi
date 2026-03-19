"use client";

import { useEffect, useMemo, useState } from "react";
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

export function DashboardHeader() {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? pageMeta["/dashboard"];
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsCollapsed(window.scrollY > 40);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  return (
    <header className="space-y-4">
      <div className="sticky top-4 z-30">
        <div
          className={`bg-[#273b57] text-[#f7f2de] rounded-2xl px-5 md:px-6 border border-[#314869] shadow-sm transition-all duration-300 flex items-center justify-between ${
            isCollapsed ? "h-12" : "h-[72px]"
          }`}
        >
          <div className="min-w-0">
            <div className="type-body font-extrabold leading-tight text-[#f7f2de]">
              {isCollapsed ? "Kyochi · Karaikudi Outlet" : `${greeting}, `}
              {!isCollapsed && <span className="text-[#d4af35]">Arun</span>}
            </div>
            {!isCollapsed && (
              <p className="type-small text-[#f7f2de]/70 truncate mt-0.5">
                Karaikudi Outlet · {dateLabel || "Loading date..."}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="size-9 rounded-lg border border-[#f7f2de]/20 text-[#f7f2de]/80 hover:text-white hover:border-[#f7f2de]/40 transition-colors inline-flex items-center justify-center">
              <MSO className="text-[20px]">search</MSO>
            </button>
            <button className="relative size-9 rounded-lg border border-[#f7f2de]/20 text-[#f7f2de]/80 hover:text-white hover:border-[#f7f2de]/40 transition-colors inline-flex items-center justify-center">
              <MSO className="text-[20px]">notifications</MSO>
              <span className="absolute top-1.5 right-1.5 size-1.5 bg-red-500 rounded-full" />
            </button>
            <button className="h-9 px-3 rounded-lg bg-[#d4af35] text-[#3d2d04] font-semibold hover:bg-[#e2be52] transition-colors inline-flex items-center gap-1.5">
              <MSO className="text-[18px]">arrow_downward</MSO>
              {isCollapsed && <span className="text-xs">Export</span>}
            </button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div>
          <h2 className="type-h1 text-slate-900 tracking-tight">{meta.title}</h2>
          <p className="type-body text-slate-500 mt-1">{meta.subtitle}</p>
        </div>
      )}
    </header>
  );
}
