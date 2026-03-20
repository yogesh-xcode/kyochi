"use client";

import { Circle, EllipsisVertical } from "lucide-react";

import appointmentsData from "@/data/appointments.json";
import billingData from "@/data/billing.json";
import patientsData from "@/data/patients.json";
import therapiesData from "@/data/therapies.json";

import { KyochiDataTable, type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { tableViewConfigs } from "@/components/kyochi/tableConfigs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const patientById = new Map(patientsData.map((patient) => [patient.id, patient]));
const appointmentById = new Map(appointmentsData.map((appointment) => [appointment.id, appointment]));
const therapyById = new Map(therapiesData.map((therapy) => [therapy.id, therapy]));

const toCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const statusClassByInvoiceStatus: Record<string, string> = {
  paid: "bg-[#dcfce7] text-[#16a34a]",
  pending: "bg-[#fee2e2] text-[#ef4444]",
  overdue: "bg-[#fee2e2] text-[#ef4444]",
};

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
  const patient = patientById.get(invoice.patient_id);
  const status = formatInvoiceStatus(invoice.status);

  return {
    id: invoice.id,
    sortValues: [
      therapy?.name ?? "Therapy Session",
      therapy?.duration_min ?? 45,
      invoice.amount,
      status,
    ],
    cells: [
      <div key={`${invoice.id}-therapy`} className="flex flex-col gap-0.5">
        <span className="font-semibold text-[#1e293b]">{therapy?.name ?? "Therapy Session"}</span>
        <span className="text-[11px] text-[#94a3b8]">ID: #{invoice.id.toUpperCase()} • {patient?.full_name ?? "Unknown Patient"}</span>
      </div>,
      `${therapy?.duration_min ?? 45} mins`,
      toCurrency(invoice.amount, invoice.currency),
      <span
        key={`${invoice.id}-status`}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClassByInvoiceStatus[invoice.status] ?? "k-status-waiting"}`}
      >
        <Circle className="size-2 fill-current stroke-none" />
        {status}
      </span>,
    ],
    actions: (
      <div className="inline-flex items-center gap-2">
        {invoice.status === "paid" ? (
          <>
            <Button type="button" variant="link" size="xs" className="h-auto px-0 text-[11px]">
              Generate Receipt
            </Button>
            <Button type="button" variant="ghost" size="icon-xs">
              <EllipsisVertical className="size-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="default"
              size="xs"
            >
              Accept Payment
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
            >
              Close Appointment
            </Button>
          </>
        )}
      </div>
    ),
  };
});

export default function BillingPage() {
  const tableConfig = tableViewConfigs.billing;

  return (
    <div className="space-y-4">
      <Card className="k-surface rounded-xl border k-border-soft shadow-sm py-0 ring-0 gap-0">
        <CardHeader className="px-5 py-4 border-b k-border-soft">
          <CardTitle className="type-h3 text-[18px] k-text-strong">Billing & Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <KyochiDataTable
            columns={tableConfig.columns}
            rows={billingRows}
            minTableWidthClassName="min-w-[760px]"
            centeredBodyColumns={tableConfig.centeredBodyColumns}
            showSelection={false}
            tone="soft"
          />
        </CardContent>
      </Card>
    </div>
  );
}
