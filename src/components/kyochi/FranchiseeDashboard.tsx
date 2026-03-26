"use client";

import { useState } from "react";

import { InsightRecommendationCard } from "@/components/kyochi/InsightRecommendationCard";
import { KpiGrid } from "@/components/kyochi/KpiGrid";
import { PatientInflow } from "@/components/kyochi/PatientInflow";
import { RecentAppointmentsTable } from "@/components/kyochi/RecentAppointmentsTable";
import { RevenueSnapshot } from "@/components/kyochi/RevenueSnapshot";
import { buildDashboardData } from "@/components/kyochi/data";
import type { RevenueRange } from "@/types";

type FranchiseeDashboardProps = {
  dashboard: ReturnType<typeof buildDashboardData>;
};

export function FranchiseeDashboard({ dashboard }: FranchiseeDashboardProps) {
  const [revenueRange, setRevenueRange] = useState<RevenueRange>("Weekly");

  return (
    <div className="space-y-4">
      <KpiGrid cards={dashboard.kpiCards} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        <div className="xl:col-span-2">
          <RevenueSnapshot
            revenueBars={dashboard.revenueBars}
            revenueRange={revenueRange}
            onRevenueRangeChange={setRevenueRange}
          />
        </div>
        <div>
          <PatientInflow
            labels={dashboard.patientInflow.labels}
            points={dashboard.patientInflow.points}
            todayCount={dashboard.patientInflow.todayCount}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        <div className="xl:col-span-2">
          <RecentAppointmentsTable appointments={dashboard.recentAppointments} />
        </div>
        <div>
          <InsightRecommendationCard
            title={dashboard.aiInsightBanner.title}
            body={dashboard.aiInsightBanner.body}
            primaryAction={dashboard.aiInsightBanner.primaryAction}
            secondaryAction={dashboard.aiInsightBanner.secondaryAction}
          />
        </div>
      </div>
    </div>
  );
}

export default FranchiseeDashboard;
