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

export function DashboardHeader() {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? pageMeta["/dashboard"];

  return (
    <header className="flex items-center justify-between">
      <div>
        <h2 className="type-h1 text-slate-900 tracking-tight">{meta.title}</h2>
        <p className="type-body text-slate-500 mt-1">{meta.subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <MSO className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</MSO>
          <input
            className="pl-10 pr-4 py-2.5 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#d4af35] w-64 text-sm outline-none"
            placeholder="Search data points..."
            type="text"
          />
        </div>
        <button className="relative p-2.5 rounded-xl bg-white shadow-sm text-slate-600 hover:text-[#d4af35] transition-colors">
          <MSO>notifications</MSO>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
