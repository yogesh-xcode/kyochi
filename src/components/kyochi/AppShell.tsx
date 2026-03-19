"use client";

import { useState } from "react";

import { DashboardHeader } from "@/components/kyochi/DashboardHeader";
import { Sidebar } from "@/components/kyochi/Sidebar";
import type { NavSection, UserRole } from "@/types";

type AppShellProps = {
  navSections: NavSection[];
  role: UserRole;
  children: React.ReactNode;
};

export function AppShell({ navSections, role, children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="k-shell-bg k-text-strong flex min-h-screen overflow-hidden">
      <Sidebar
        navSections={navSections}
        role={role}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <main className="lg:ml-60 flex-1 pb-3 pt-0 md:pb-4 lg:pb-6 k-shell-bg min-h-screen">
        <DashboardHeader onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />
        <div className="px-3 md:px-4 lg:px-6 pt-[62px]">{children}</div>
      </main>
    </div>
  );
}
