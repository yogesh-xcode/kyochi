"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

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
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onMenuToggle}
              className="lg:hidden rounded-lg k-surface-muted k-text-body hover:text-[var(--k-color-brand)] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="size-4" />
            </Button>
            <h2 className="type-h3 text-[18px] md:text-[20px] leading-none k-text-strong">{headerTitle}</h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
          <Button className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--kyochi-gold-500)] text-[var(--kyochi-cream-100)] px-3 type-small font-bold hover:bg-[var(--kyochi-gold-600)] transition-colors">
            <Plus className="size-3.5" />
            Create Appointment
          </Button>
          <Button variant="outline" size="icon-sm" className="relative rounded-full border k-border-soft k-surface k-text-body hover:text-[var(--k-color-brand)] transition-colors">
            <Bell className="size-4" />
            <span className="absolute top-0.5 right-0.5 size-3 k-notify-bg rounded-full text-[8px] text-white font-bold inline-flex items-center justify-center">
              7
            </span>
          </Button>
          <Button variant="ghost" size="icon-sm" className="rounded-full k-avatar-bg k-text-body text-[10px] font-bold">
            AK
          </Button>
          <Button variant="outline" size="icon-sm" className="rounded-full border k-border-soft k-surface k-text-subtle hover:text-[var(--k-color-brand)] transition-colors">
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
