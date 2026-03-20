"use client";

import billingData from "@/data/billing.json";
import feedbackData from "@/data/feedback.json";
import patientsData from "@/data/patients.json";
import therapistsData from "@/data/therapists.json";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { StatusPill } from "@/components/kyochi/primitives";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";
import {
  getActiveRole,
  getActiveTherapistId,
  scopeAppointmentsByRole,
} from "@/lib/roleScope";

const patientById = new Map(patientsData.map((patient) => [patient.id, patient]));
const therapistById = new Map(
  therapistsData.map((therapist) => [therapist.id, therapist]),
);
const invoiceByAppointmentId = new Map(
  billingData.map((invoice) => [invoice.appointment_id, invoice]),
);

const toDateLabel = (isoDate: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate));

export default function FeedbackPage() {
  const role = getActiveRole();
  const therapistId = getActiveTherapistId();
  const scopedFeedback = scopeAppointmentsByRole(
    feedbackData,
    role,
    therapistId,
  );
  const appointmentOptions = scopedFeedback.map((entry) => entry.appointment_id);
  const patientOptions = Array.from(new Set(scopedFeedback.map((entry) => patientById.get(entry.patient_id)?.full_name ?? "Unknown")));
  const therapistOptions = Array.from(new Set(scopedFeedback.map((entry) => therapistById.get(entry.therapist_id)?.full_name ?? "Unknown")));
  const invoiceOptions = Array.from(
    new Set(
      scopedFeedback.map(
        (entry) =>
          entry.invoice_id ||
          (invoiceByAppointmentId.get(entry.appointment_id)?.id?.toUpperCase() ?? "N/A"),
      ),
    ),
  );
  const ratingOptions = ["5/5", "4/5", "3/5", "2/5", "1/5", "-"];
  const feedbackStatusOptions = ["Pending", "Submitted"];

  const feedbackRows = scopedFeedback.map((entry) => {
    const patient = patientById.get(entry.patient_id);
    const therapist = therapistById.get(entry.therapist_id);
    const invoiceId =
      entry.invoice_id && entry.invoice_id !== "N/A"
        ? entry.invoice_id
        : (invoiceByAppointmentId.get(entry.appointment_id)?.id?.toUpperCase() ?? "N/A");

    return {
      id: entry.id,
      feedbackStatus: entry.status,
      cells: [
        entry.id,
        entry.appointment_id,
        patient?.full_name ?? "Unknown",
        therapist?.full_name ?? "Unknown",
        toDateLabel(entry.session_date),
        invoiceId,
        entry.rating,
        <StatusPill key={`${entry.id}-status`} status={entry.status} />,
      ],
      sortValues: [
        entry.id,
        entry.appointment_id,
        patient?.full_name ?? "Unknown",
        therapist?.full_name ?? "Unknown",
        entry.session_date,
        invoiceId,
        entry.rating,
        entry.status,
      ],
    };
  });

  const tableConfig = tableViewConfigs.feedback;
  const submittedCount = feedbackRows.filter((row) => row.feedbackStatus === "Submitted").length;
  const pendingCount = feedbackRows.length - submittedCount;
  const averageRating =
    submittedCount > 0
      ? (
          feedbackRows.reduce((sum, row) => {
            const ratingText = String(row.cells[6] ?? "0").replace("/5", "");
            return sum + (Number.isFinite(Number(ratingText)) ? Number(ratingText) : 0);
          }, 0) / submittedCount
        ).toFixed(1)
      : "0.0";

  return (
    <ManagementPageLayout
      title="Feedback"
      searchPlaceholder="Search feedback..."
      kpis={[
        {
          label: "Total Feedback Records",
          value: feedbackRows.length.toString(),
          delta: "Live",
          helper: "Feedback rows from all scoped sessions",
        },
        {
          label: "Average Rating",
          value: `${averageRating}/5`,
          delta: "Verified",
          helper: "Average across submitted feedback",
        },
        {
          label: "Role Scope",
          value: role === "therapist" ? therapistId : "All",
          delta: "Role",
          helper: "Current access scope",
        },
        {
          label: "Pending Feedback",
          value: pendingCount.toString(),
          delta: pendingCount > 0 ? "Queue" : "Clear",
          helper: "Sessions still awaiting feedback capture",
        },
      ]}
      columns={tableConfig.columns}
      centeredBodyColumns={tableConfig.centeredBodyColumns}
      formFieldConfigs={{
        "Appointment ID": {
          type: "select",
          options: appointmentOptions,
        },
        Patient: {
          type: "typeahead",
          options: patientOptions,
          placeholder: "Type patient name...",
          debounceMs: 250,
        },
        Therapist: {
          type: "select",
          options: therapistOptions,
        },
        "Session Date": {
          type: "date",
        },
        "Invoice No": {
          type: "select",
          options: invoiceOptions,
        },
        Rating: {
          type: "select",
          options: ratingOptions,
          defaultValue: ratingOptions[5],
        },
        Status: {
          type: "select",
          options: feedbackStatusOptions,
          defaultValue: feedbackStatusOptions[0],
        },
      }}
      rows={feedbackRows}
    />
  );
}
