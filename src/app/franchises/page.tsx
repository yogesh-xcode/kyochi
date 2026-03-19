"use client";

import franchisesData from "@/data/franchises.json";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";

const regionCounts = Object.entries(
  franchisesData.reduce<Record<string, number>>((acc, franchise) => {
    acc[franchise.region] = (acc[franchise.region] ?? 0) + 1;
    return acc;
  }, {}),
).sort((a, b) => b[1] - a[1]);

const chennaiCount = franchisesData.filter((franchise) => franchise.region === "Chennai").length;
const chennaiCoverage = `${Math.round((chennaiCount / franchisesData.length) * 100)}%`;

export default function FranchisesPage() {
  const tableConfig = tableViewConfigs.franchises;

  return (
    <ManagementPageLayout
      title="Franchise Directory"
      searchPlaceholder="Search franchise locations..."
      kpis={[
        { label: "Total Franchises", value: franchisesData.length.toString(), delta: "+100%", helper: "Active locations in network" },
        { label: "Regions Covered", value: regionCounts.length.toString(), delta: "Stable", helper: "Distinct operational zones" },
        { label: "Chennai Coverage", value: chennaiCoverage, delta: "Leader", helper: "Share of total outlets" },
        { label: "Top Region", value: regionCounts[0]?.[0] ?? "N/A", delta: `${regionCounts[0]?.[1] ?? 0} units`, helper: "Highest concentration today" },
      ]}
      columns={tableConfig.columns}
      centeredBodyColumns={tableConfig.centeredBodyColumns}
      rows={franchisesData.map((franchise) => ({
        id: franchise.id,
        cells: [
          franchise.id,
          <span key={`${franchise.id}-name`} className="font-semibold">{franchise.name}</span>,
          <span key={`${franchise.id}-address`} className="type-small k-text-body whitespace-normal">{franchise.address}</span>,
          franchise.city,
          franchise.region,
          <a key={`${franchise.id}-phone`} href={`tel:${franchise.phone}`} className="text-[var(--k-color-cta)] hover:underline">
            {franchise.phone}
          </a>,
        ],
      }))}
    />
  );
}
