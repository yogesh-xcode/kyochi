"use client";

import therapiesData from "@/data/therapies.json";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";

const activeTherapies = therapiesData.filter((therapy) => therapy.status === "active").length;
const averageDuration =
  therapiesData.length > 0
    ? Math.round(
        therapiesData.reduce((sum, therapy) => sum + therapy.duration_min, 0) /
          therapiesData.length,
      )
    : 0;
const categoryCount = new Set(therapiesData.map((therapy) => therapy.category)).size;
const totalSessions = therapiesData.reduce(
  (sum, therapy) => sum + therapy.session_count,
  0,
);

export default function TherapiesPage() {
  const tableConfig = tableViewConfigs.therapies;
  const therapyNameOptions = therapiesData.map((therapy) => therapy.name);
  const categoryOptions = Array.from(new Set(therapiesData.map((therapy) => therapy.category)));
  const durationOptions = Array.from(new Set(therapiesData.map((therapy) => `${therapy.duration_min} mins`)));
  const sessionOptions = Array.from(new Set(therapiesData.map((therapy) => therapy.session_count.toString())));
  const statusOptions = ["Active", "Inactive"];

  return (
    <ManagementPageLayout
      title="Therapy Programs"
      searchPlaceholder="Search therapies..."
      kpis={[
        {
          label: "Total Therapies",
          value: therapiesData.length.toString(),
          delta: "Live",
          helper: "Available reflexology treatments",
        },
        {
          label: "Active Therapies",
          value: activeTherapies.toString(),
          delta: `${Math.round(
            (activeTherapies / Math.max(therapiesData.length, 1)) * 100,
          )}%`,
          helper: "Currently available for booking",
        },
        {
          label: "Avg Duration",
          value: `${averageDuration} mins`,
          delta: "Stable",
          helper: "Typical session length",
        },
        {
          label: "Category Coverage",
          value: categoryCount.toString(),
          delta: `${totalSessions} plans`,
          helper: "Distinct therapy categories",
        },
      ]}
      columns={tableConfig.columns}
      centeredBodyColumns={tableConfig.centeredBodyColumns}
      formFieldConfigs={{
        "Therapy Name": {
          type: "typeahead",
          options: therapyNameOptions,
          placeholder: "Type therapy name...",
          debounceMs: 250,
        },
        Category: {
          type: "select",
          options: categoryOptions,
        },
        Duration: {
          type: "select",
          options: durationOptions,
        },
        Sessions: {
          type: "select",
          options: sessionOptions,
        },
        Status: {
          type: "select",
          options: statusOptions,
          defaultValue: statusOptions[0],
        },
      }}
      rows={therapiesData.map((therapy) => ({
        id: therapy.id,
        cells: [
          therapy.id,
          therapy.name,
          therapy.category,
          `${therapy.duration_min} mins`,
          therapy.session_count.toString(),
          <StatusPill
            key={`${therapy.id}-status`}
            status={therapy.status === "active" ? "Active" : "Inactive"}
          />,
        ],
      }))}
    />
  );
}
