"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu, Plus, Search } from "lucide-react";

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
    <header className="k-surface border-b k-border-soft h-[62px] px-3 md:px-4 lg:px-6 flex items-center">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="min-w-0 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuToggle}
              className="lg:hidden size-7 rounded-lg k-surface-muted k-text-body hover:text-[var(--k-color-brand)] transition-colors inline-flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              <Menu className="size-4" />
            </button>
            <h2 className="text-[18px] leading-tight font-extrabold tracking-tight k-text-strong">{headerTitle}</h2>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-[500px]">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 k-text-subtle size-4" />
            <input
              className="w-full h-8 pl-8 pr-16 rounded-lg border k-border-soft k-surface text-[12px] k-text-body placeholder:k-text-subtle outline-none focus:border-[var(--k-color-brand)]"
              placeholder="Search dashboard or type a command"
              type="text"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border k-border-soft k-surface-muted px-1.5 py-0.5 text-[10px] font-semibold k-text-subtle">
              Ctrl + K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-lg k-cta-bg px-3 text-white text-[12px] font-semibold transition-colors">
            <Plus className="size-3.5" />
            Create Appointment
            <ChevronDown className="size-3.5" />
          </button>
          <button className="relative size-7 rounded-full border k-border-soft k-surface k-text-body hover:text-[var(--k-color-brand)] transition-colors inline-flex items-center justify-center">
            <Bell className="size-4" />
            <span className="absolute top-0.5 right-0.5 size-3 k-notify-bg rounded-full text-[8px] text-white font-bold inline-flex items-center justify-center">
              7
            </span>
          </button>
          <button className="size-7 rounded-full k-avatar-bg k-text-body text-[10px] font-bold inline-flex items-center justify-center">
            AK
          </button>
          <button className="size-7 rounded-full border k-border-soft k-surface k-text-subtle hover:text-[var(--k-color-brand)] transition-colors inline-flex items-center justify-center">
            <ChevronDown className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
