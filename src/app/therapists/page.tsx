"use client";

import therapistsData from "@/data/therapists.json";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { InitialsAvatar } from "@/components/kyochi/primitives";

const specialtyCount = new Set(therapistsData.map((therapist) => therapist.specialty)).size;
const activeCount = therapistsData.filter((therapist) => therapist.status === "active").length;

const toInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export default function TherapistsPage() {
  return (
    <ManagementPageLayout
      title="Therapist Management"
      searchPlaceholder="Search therapists..."
      kpis={[
        { label: "Total Therapists", value: therapistsData.length.toString(), delta: "Live", helper: "Available practitioners" },
        { label: "Active Therapists", value: activeCount.toString(), delta: `${Math.round((activeCount / therapistsData.length) * 100)}%`, helper: "Enabled for assignments" },
        { label: "Specialties", value: specialtyCount.toString(), delta: "Coverage", helper: "Distinct therapy specializations" },
        { label: "Credentialed", value: therapistsData.length.toString(), delta: "Verified", helper: "Licensed profile count" },
      ]}
      columns={["ID", "Name", "Specialty", "Email", "License"]}
      centeredBodyColumns={[0]}
      rows={therapistsData.map((therapist) => ({
        id: therapist.id,
        cells: [
          therapist.id,
          <div key={`${therapist.id}-name`} className="flex items-center gap-2">
            <InitialsAvatar initials={toInitials(therapist.full_name)} className="size-8 text-[11px]" />
            <span>{therapist.full_name}</span>
          </div>,
          therapist.specialty,
          therapist.email,
          therapist.license_no,
        ],
      }))}
    />
  );
}
