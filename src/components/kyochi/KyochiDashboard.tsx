"use client";

import { useMemo, useState } from "react";

import { buildDashboardData } from "@/components/kyochi/data";
import { FranchiseeDashboard } from "@/components/kyochi/FranchiseeDashboard";
import { InsightRecommendationCard } from "@/components/kyochi/InsightRecommendationCard";
import { KpiGrid } from "@/components/kyochi/KpiGrid";
import { DashboardPageSkeleton } from "@/components/kyochi/PageSkeletons";
import { PatientInflow } from "@/components/kyochi/PatientInflow";
import { PatientDashboard } from "@/components/kyochi/PatientDashboard";
import { RecentAppointmentsTable } from "@/components/kyochi/RecentAppointmentsTable";
import { RevenueSnapshot } from "@/components/kyochi/RevenueSnapshot";
import { TherapistDashboard } from "@/components/kyochi/TherapistDashboard";
import { useBootstrapData } from "@/lib/data/useBootstrapData";
import { resolveUserContext } from "@/lib/roleScope";
import type { RevenueRange } from "@/types";

export function KyochiDashboard() {
  const [revenueRange, setRevenueRange] = useState<RevenueRange>("Weekly");
  const { data, isLoading } = useBootstrapData();
  const context = resolveUserContext({
    users: data.users,
    currentUser: data.current_user,
  });

  const dashboard = useMemo(
    () =>
      buildDashboardData({
        data,
        role: context.role,
        therapistId: context.therapistId,
        patientId: context.patientId,
        franchiseId: context.franchiseId,
      }),
    [context.franchiseId, context.patientId, context.role, context.therapistId, data],
  );

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  if (context.role === "franchisee") {
    return <FranchiseeDashboard dashboard={dashboard} />;
  }

  if (context.role === "therapist") {
    return <TherapistDashboard dashboard={dashboard} />;
  }

  if (context.role === "patient") {
    return (
      <PatientDashboard
        data={data}
        patientId={context.patientId}
        patientName={context.user?.full_name ?? "Patient"}
      />
    );
  }

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

export default KyochiDashboard;
