import appointmentsData from "../../../data/appointments.json";
import billingData from "../../../data/billing.json";
import patientsData from "../../../data/patients.json";
import therapiesData from "../../../data/therapies.json";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

const billingRows = billingData.map((invoice) => {
  const appointment = appointmentById.get(invoice.appointment_id);
  const therapy = appointment ? therapyById.get(appointment.therapy_id) : undefined;
  const patient = patientById.get(invoice.patient_id);

  return {
    id: invoice.id,
    therapyName: therapy?.name ?? "Therapy Session",
    patientName: patient?.full_name ?? "Unknown Patient",
    duration: `${therapy?.duration_min ?? 45} mins`,
    price: toCurrency(invoice.amount, invoice.currency),
    status: formatInvoiceStatus(invoice.status),
    statusClass: statusClassByInvoiceStatus[invoice.status] ?? "k-status-waiting",
  };
});

export default function BillingPage() {
  return (
    <div className="space-y-4">
      <Card className="k-surface rounded-xl border k-border-soft shadow-sm py-0 ring-0 gap-0">
        <CardHeader className="px-5 py-4 border-b k-border-soft">
          <CardTitle className="type-h3 text-[18px] k-text-strong">Billing & Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-b-xl">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="k-surface-muted hover:bg-transparent">
                  <TableHead className="px-5 py-3 type-label normal-case tracking-normal k-text-subtle h-auto">Therapy Name</TableHead>
                  <TableHead className="px-5 py-3 type-label normal-case tracking-normal k-text-subtle h-auto">Duration</TableHead>
                  <TableHead className="px-5 py-3 type-label normal-case tracking-normal k-text-subtle h-auto">Price</TableHead>
                  <TableHead className="px-5 py-3 type-label normal-case tracking-normal k-text-subtle h-auto">Status</TableHead>
                  <TableHead className="px-5 py-3 type-label normal-case tracking-normal k-text-subtle h-auto text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingRows.map((row) => (
                  <TableRow key={row.id} className="k-row-hover transition-colors">
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="type-small font-bold k-text-strong">{row.therapyName}</span>
                        <span className="type-label normal-case tracking-normal k-text-subtle text-[10px]">
                          {row.id.toUpperCase()} • {row.patientName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 type-small k-text-body">{row.duration}</TableCell>
                    <TableCell className="px-5 py-4 type-small font-bold k-text-strong">{row.price}</TableCell>
                    <TableCell className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${row.statusClass}`}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button variant="ghost" className="h-auto px-2 py-1 type-small font-bold k-brand hover:underline bg-transparent hover:bg-transparent">
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-auto px-2 py-1 type-small font-bold k-text-body hover:underline bg-transparent hover:bg-transparent"
                        >
                          {row.status === "Overdue" ? "Send Reminder" : "Details"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
