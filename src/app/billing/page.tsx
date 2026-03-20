"use client";

import { Check, EllipsisVertical, ReceiptText, X } from "lucide-react";

import appointmentsData from "@/data/appointments.json";
import billingData from "@/data/billing.json";
import therapiesData from "@/data/therapies.json";

import { ManagementPageLayout } from "@/components/kyochi/ManagementPageLayout";
import { type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { StatusPill } from "@/components/kyochi/primitives";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";
import { Button } from "@/components/ui/button";

const appointmentById = new Map(appointmentsData.map((appointment) => [appointment.id, appointment]));
const therapyById = new Map(therapiesData.map((therapy) => [therapy.id, therapy]));

const toCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatInvoiceStatus = (status: string) => {
  if (status === "paid") {
    return "Paid";
  }
  if (status === "pending") {
    return "Pending";
  }
  if (status === "overdue") {
    return "Overdue";
  }
  return status;
};

const billingRows: KyochiTableRow[] = billingData.map((invoice) => {
  const appointment = appointmentById.get(invoice.appointment_id);
  const therapy = appointment ? therapyById.get(appointment.therapy_id) : undefined;
  const status = formatInvoiceStatus(invoice.status);

  return {
    id: invoice.id,
    sortValues: [
      invoice.id.toUpperCase(),
      therapy?.name ?? "Therapy Session",
      therapy?.duration_min ?? 45,
      invoice.amount,
      status,
    ],
    cells: [
      <span key={`${invoice.id}-id`} className="font-medium text-[#334155]">
        {invoice.id.toUpperCase()}
      </span>,
      <span key={`${invoice.id}-therapy`} className="font-semibold text-[#1e293b]">
        {therapy?.name ?? "Therapy Session"}
      </span>,
      `${therapy?.duration_min ?? 45} mins`,
      toCurrency(invoice.amount),
      <StatusPill key={`${invoice.id}-status`} status={status} />,
    ],
    actions: (
      <div className="inline-flex items-center gap-2">
        {invoice.status === "paid" ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              aria-label="Generate Receipt"
              title="Generate Receipt"
            >
              <ReceiptText className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              aria-label="More Actions"
              title="More Actions"
            >
              <EllipsisVertical className="size-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="default"
              size="icon-xs"
              aria-label="Accept Payment"
              title="Accept Payment"
            >
              <Check className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="destructive-outline"
              size="icon-xs"
              aria-label="Close Appointment"
              title="Close Appointment"
            >
              <X className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    ),
  };
});

export default function BillingPage() {
  const tableConfig = tableViewConfigs.billing;
  const therapyOptions = therapiesData.map((therapy) => therapy.name);
  const durationOptions = Array.from(new Set(therapiesData.map((therapy) => `${therapy.duration_min} mins`)));
  const billingStatusOptions = ["Paid", "Pending", "Overdue"];
  const paidInvoices = billingData.filter((invoice) => invoice.status === "paid");
  const pendingInvoices = billingData.filter((invoice) => invoice.status === "pending");
  const overdueInvoices = billingData.filter((invoice) => invoice.status === "overdue");
  const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstandingAmount = [...pendingInvoices, ...overdueInvoices].reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );
  const collectionRate = billingData.length > 0 ? Math.round((paidInvoices.length / billingData.length) * 100) : 0;

  return (
    <ManagementPageLayout
      title="Billing & Invoices"
      searchPlaceholder="Search invoices..."
      kpis={[
        { label: "Total Invoices", value: billingData.length.toString(), delta: "Live", helper: "All generated invoices" },
        { label: "Collected Revenue", value: toCurrency(totalRevenue), delta: `${paidInvoices.length} Paid`, helper: "Revenue from paid invoices" },
        { label: "Outstanding", value: toCurrency(outstandingAmount), delta: `${pendingInvoices.length + overdueInvoices.length} Due`, helper: "Pending and overdue balance" },
        { label: "Collection Rate", value: `${collectionRate}%`, delta: "Verified", helper: "Paid invoice ratio" },
      ]}
      columns={tableConfig.columns}
      centeredBodyColumns={tableConfig.centeredBodyColumns}
      formFieldConfigs={{
        "Therapy Name": {
          type: "select",
          options: therapyOptions,
        },
        Duration: {
          type: "select",
          options: durationOptions,
        },
        Price: {
          type: "text",
          placeholder: "Enter amount in INR",
        },
        Status: {
          type: "select",
          options: billingStatusOptions,
          defaultValue: billingStatusOptions[0],
        },
      }}
      rows={billingRows}
    />
  );
}
