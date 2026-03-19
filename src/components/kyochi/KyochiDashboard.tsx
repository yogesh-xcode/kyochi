"use client";

import { useState } from "react";

import {
  aiInsightBanner,
  alerts,
  appointments,
  kpiCards,
  patientInflow,
  revenueBars,
} from "@/components/kyochi/data";
import { AiInsightBanner } from "@/components/kyochi/AiInsightBanner";
import { AlertsPanel } from "@/components/kyochi/AlertsPanel";
import { AppointmentsPanel } from "@/components/kyochi/AppointmentsPanel";
import { KpiGrid } from "@/components/kyochi/KpiGrid";
import { PatientInflow } from "@/components/kyochi/PatientInflow";
import { RevenueSnapshot } from "@/components/kyochi/RevenueSnapshot";
import type { RevenueRange } from "@/types";

export function KyochiDashboard() {
  const [revenueRange, setRevenueRange] = useState<RevenueRange>("Weekly");

  return (
    <>
      <KpiGrid cards={kpiCards} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <AppointmentsPanel appointments={appointments.slice(0, 3)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RevenueSnapshot
              revenueBars={revenueBars}
              revenueRange={revenueRange}
              onRevenueRangeChange={setRevenueRange}
            />
            <PatientInflow
              labels={patientInflow.labels}
              points={patientInflow.points}
              todayCount={patientInflow.todayCount}
            />
          </div>
        </div>

        <div className="space-y-8">
          <AlertsPanel alerts={alerts} />
        </div>
      </div>

      <AiInsightBanner
        title={aiInsightBanner.title}
        body={aiInsightBanner.body}
        primaryAction={aiInsightBanner.primaryAction}
        secondaryAction={aiInsightBanner.secondaryAction}
      />
    </>
  );
}

export default KyochiDashboard;
