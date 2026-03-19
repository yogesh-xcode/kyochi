"use client";

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
  const headerTitle = isDashboard ? "Dashboard" : meta.title;

  return (
    <header className="bg-white border-b border-slate-200/80 h-[68px] px-3.5 md:px-5 lg:px-7 flex items-center">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="min-w-0 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuToggle}
              className="lg:hidden size-7 rounded-lg bg-[#f3f0e6] text-slate-600 hover:text-[#d4af35] transition-colors inline-flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              <MSO className="text-[18px]">menu</MSO>
            </button>
            <h2 className="text-[20px] leading-tight font-extrabold tracking-tight text-slate-900">{headerTitle}</h2>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-[560px]">
          <div className="relative w-full">
            <MSO className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[17px]">search</MSO>
            <input
              className="w-full h-9 pl-9 pr-20 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#d4af35]/50"
              placeholder="Search dashboard or type a command"
              type="text"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
              Ctrl + K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button className="hidden sm:inline-flex h-9 items-center gap-2 rounded-lg bg-[#2f66db] px-3.5 text-white text-[13px] font-semibold hover:bg-[#2a5ccd] transition-colors">
            <MSO className="text-[16px]">add</MSO>
            Create Appointment
            <MSO className="text-[16px]">expand_more</MSO>
          </button>
          <button className="relative size-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-[#d4af35] transition-colors inline-flex items-center justify-center">
            <MSO className="text-[18px]">notifications</MSO>
            <span className="absolute top-1 right-1 size-3.5 bg-[#ff6a6a] rounded-full text-[9px] text-white font-bold inline-flex items-center justify-center">
              7
            </span>
          </button>
          <button className="size-8 rounded-full bg-[#f1f1f1] text-slate-700 text-[11px] font-bold inline-flex items-center justify-center">
            AK
          </button>
          <button className="size-8 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-[#d4af35] transition-colors inline-flex items-center justify-center">
            <MSO className="text-[18px]">expand_more</MSO>
          </button>
        </div>
      </div>
    </header>
  );
}
