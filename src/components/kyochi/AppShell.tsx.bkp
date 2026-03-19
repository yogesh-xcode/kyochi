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
      <main className="lg:ml-72 flex-1 px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 space-y-6 bg-[#f8f7f6] min-h-screen">
        <DashboardHeader onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />
        {children}
      </main>
    </div>
  );
}
