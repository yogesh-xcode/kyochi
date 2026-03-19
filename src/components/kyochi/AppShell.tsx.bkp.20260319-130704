"use client";

import { useState } from "react";

import { DashboardHeader } from "@/components/kyochi/DashboardHeader";
import { Sidebar } from "@/components/kyochi/Sidebar";
import type { NavSection } from "@/types";

type AppShellProps = {
  navSections: NavSection[];
  children: React.ReactNode;
};

export function AppShell({ navSections, children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#f8f7f6] text-slate-900">
      <Sidebar
        navSections={navSections}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <main className="lg:ml-64 flex-1 pb-3.5 pt-0 md:pb-5 lg:pb-7 bg-[#f8f7f6] min-h-screen">
        <DashboardHeader onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />
        <div className="px-3.5 md:px-5 lg:px-7 pt-5">{children}</div>
      </main>
    </div>
  );
}
