"use client";

import { useState } from "react";

import { alerts, appointments, kpiCards, revenueBars } from "@/components/kyochi/data";
import { AiInsightBanner } from "@/components/kyochi/AiInsightBanner";
import { AlertsPanel } from "@/components/kyochi/AlertsPanel";
import { AppointmentsPanel } from "@/components/kyochi/AppointmentsPanel";
import { KpiGrid } from "@/components/kyochi/KpiGrid";
import { PatientInflow } from "@/components/kyochi/PatientInflow";
import { RevenueSnapshot } from "@/components/kyochi/RevenueSnapshot";
import type { RevenueRange } from "@/components/kyochi/types/index";

export function KyochiDashboard() {
  const [revenueRange, setRevenueRange] = useState<RevenueRange>("Weekly");

  return (
    <>
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
    </>
  );
}

export default KyochiDashboard;
