"use client";

import { useState } from "react";

import {
  aiInsightBanner,
  appointments,
  kpiCards,
  patientInflow,
  revenueBars,
} from "@/components/kyochi/data";
import { InsightRecommendationCard } from "@/components/kyochi/InsightRecommendationCard";
import { KpiGrid } from "@/components/kyochi/KpiGrid";
import { PatientInflow } from "@/components/kyochi/PatientInflow";
import { RecentAppointmentsTable } from "@/components/kyochi/RecentAppointmentsTable";
import { RevenueSnapshot } from "@/components/kyochi/RevenueSnapshot";
import type { RevenueRange } from "@/types";

export function KyochiDashboard() {
  const [revenueRange, setRevenueRange] = useState<RevenueRange>("Weekly");

  return (
    <div className="space-y-4">
      <KpiGrid cards={kpiCards} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        <div className="xl:col-span-2">
          <RevenueSnapshot
            revenueBars={revenueBars}
            revenueRange={revenueRange}
            onRevenueRangeChange={setRevenueRange}
          />
        </div>
        <div>
          <PatientInflow
            labels={patientInflow.labels}
            points={patientInflow.points}
            todayCount={patientInflow.todayCount}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        <div className="xl:col-span-2">
          <RecentAppointmentsTable appointments={appointments.slice(0, 3)} />
        </div>
        <div>
          <InsightRecommendationCard
            title={aiInsightBanner.title}
            body={aiInsightBanner.body}
            primaryAction={aiInsightBanner.primaryAction}
            secondaryAction={aiInsightBanner.secondaryAction}
          />
        </div>
      </div>
    </div>
  );
}

export default KyochiDashboard;
