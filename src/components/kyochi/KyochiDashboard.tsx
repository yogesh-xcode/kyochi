"use client";

import { useState } from "react";

import { alerts, appointments, kpiCards, navSections, revenueBars } from "@/components/kyochi/data";
import { AiInsightBanner } from "@/components/kyochi/AiInsightBanner";
import { AlertsPanel } from "@/components/kyochi/AlertsPanel";
import { AppointmentsPanel } from "@/components/kyochi/AppointmentsPanel";
import { DashboardHeader } from "@/components/kyochi/DashboardHeader";
import { KpiGrid } from "@/components/kyochi/KpiGrid";
import { PatientInflow } from "@/components/kyochi/PatientInflow";
import { RevenueSnapshot } from "@/components/kyochi/RevenueSnapshot";
import { Sidebar } from "@/components/kyochi/Sidebar";
import type { RevenueRange } from "@/components/kyochi/types";

export function KyochiDashboard() {
  const [revenueRange, setRevenueRange] = useState<RevenueRange>("Weekly");

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div
        className="flex min-h-screen overflow-hidden bg-[#f8f7f6] text-slate-900"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        <Sidebar navSections={navSections} />

        <main className="ml-72 flex-1 p-8 space-y-8 bg-[#f8f7f6] min-h-screen">
          <DashboardHeader />
          <KpiGrid cards={kpiCards} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <AppointmentsPanel appointments={appointments} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <RevenueSnapshot
                  revenueBars={revenueBars}
                  revenueRange={revenueRange}
                  onRevenueRangeChange={setRevenueRange}
                />
                <PatientInflow />
              </div>
            </div>

            <div className="space-y-8">
              <AlertsPanel alerts={alerts} />
            </div>
          </div>

          <AiInsightBanner />
        </main>
      </div>
    </>
  );
}

export default KyochiDashboard;
