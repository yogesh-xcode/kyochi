"use client";

import patientsData from "@/data/patients.json";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { InitialsAvatar } from "@/components/kyochi/primitives";

const avgWellness =
  patientsData.length > 0
    ? (patientsData.reduce((sum, patient) => sum + patient.wellness_score, 0) / patientsData.length).toFixed(1)
    : "0";
const highRiskCount = patientsData.filter((patient) => patient.wellness_score < 70).length;
const activeCount = patientsData.filter((patient) => patient.status === "active").length;

const toInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export default function PatientsPage() {
  return (
    <ManagementPageLayout
      title="Patient Records"
      searchPlaceholder="Search patients..."
      kpis={[
        { label: "Total Patients", value: patientsData.length.toString(), delta: "Live", helper: "Registered patient profiles" },
        { label: "Avg Wellness", value: avgWellness, delta: "Score", helper: "Average wellness index" },
        { label: "Active Patients", value: activeCount.toString(), delta: `${Math.round((activeCount / patientsData.length) * 100)}%`, helper: "Currently active in system" },
        { label: "High Risk", value: highRiskCount.toString(), delta: "Needs review", helper: "Wellness score below 70" },
      ]}
      columns={["ID", "Name", "Email", "Phone", "Wellness"]}
      rows={patientsData.map((patient) => ({
        id: patient.id,
        cells: [
          patient.id,
          <div key={`${patient.id}-name`} className="flex items-center gap-2">
            <InitialsAvatar initials={toInitials(patient.full_name)} className="size-8 text-[11px]" />
            <span>{patient.full_name}</span>
          </div>,
          patient.email,
          patient.phone,
          `${patient.wellness_score}`,
        ],
      }))}
    />
  );
}
