"use client";
import appointmentsData from "@/data/appointments.json";
import billingData from "@/data/billing.json";
import patientsData from "@/data/patients.json";
import therapiesData from "@/data/therapies.json";

import { KyochiDataTable, type KyochiTableRow } from "@/components/kyochi/KyochiDataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const patientById = new Map(patientsData.map((patient) => [patient.id, patient]));
const appointmentById = new Map(appointmentsData.map((appointment) => [appointment.id, appointment]));
const therapyById = new Map(therapiesData.map((therapy) => [therapy.id, therapy]));

const toCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const statusClassByInvoiceStatus: Record<string, string> = {
  paid: "bg-[#22c55e] text-white",
  pending: "bg-[#f59e0b] text-white",
  overdue: "bg-[#ef4444] text-white",
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
    cells: [
      <div key={`${invoice.id}-therapy`} className="flex flex-col">
        <span className="type-small font-bold k-text-strong">{therapy?.name ?? "Therapy Session"}</span>
        <span className="type-label normal-case tracking-normal k-text-subtle text-[10px]">
          {invoice.id.toUpperCase()} • {patient?.full_name ?? "Unknown Patient"}
        </span>
      </div>,
      `${therapy?.duration_min ?? 45} mins`,
      <span key={`${invoice.id}-amount`} className="type-small font-bold k-text-strong">
        {toCurrency(invoice.amount, invoice.currency)}
      </span>,
      <span
        key={`${invoice.id}-status`}
        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusClassByInvoiceStatus[invoice.status] ?? "k-status-waiting"}`}
      >
        {status}
      </span>,
    ],
    actions: (
      <div className="inline-flex items-center gap-2">
        <Button variant="ghost" className="h-auto px-2 py-1 type-small font-bold k-brand hover:underline bg-transparent hover:bg-transparent">
          View
        </Button>
        <Button
          variant="ghost"
          className="h-auto px-2 py-1 type-small font-bold k-text-body hover:underline bg-transparent hover:bg-transparent"
        >
          {status === "Overdue" ? "Send Reminder" : "Details"}
        </Button>
      </div>
    ),
  };
});

export default function BillingPage() {
  return (
    <div className="space-y-4">
      <Card className="k-surface rounded-xl border k-border-soft shadow-sm py-0 ring-0 gap-0">
        <CardHeader className="px-5 py-4 border-b k-border-soft">
          <CardTitle className="type-h3 text-[18px] k-text-strong">Billing & Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <KyochiDataTable
            columns={["Therapy Name", "Duration", "Price", "Status"]}
            rows={billingRows}
            minTableWidthClassName="min-w-[760px]"
            centeredBodyColumns={[2, 3]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
