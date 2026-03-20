import Link from "next/link";

import { StatusPill } from "@/components/kyochi/primitives";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Appointment } from "@/types";

type RecentAppointmentsTableProps = {
  appointments: Appointment[];
};

export function RecentAppointmentsTable({ appointments }: RecentAppointmentsTableProps) {
  return (
    <Card className="k-surface rounded-xl shadow-sm border k-border-soft overflow-hidden py-0 ring-0 gap-0">
      <CardHeader className="px-3.5 md:px-4 py-3 border-b k-border-soft flex flex-row items-center justify-between gap-2.5">
        <div>
          <CardTitle className="type-h3 text-[18px] k-text-strong">Recent Appointments</CardTitle>
          <CardDescription className="type-small k-text-body mt-1">Latest schedule activity from the last 30 days.</CardDescription>
        </div>
        <Link
          href="/appointments"
          className="type-small font-bold k-brand hover:underline whitespace-nowrap"
        >
          Open Full Schedule
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <Table className="min-w-[560px]">
          <TableHeader>
            <TableRow className="text-left k-surface-muted border-b-0 hover:bg-transparent">
              <TableHead className="px-3.5 md:px-4 py-2 type-label text-[9px] k-text-subtle h-auto">Time</TableHead>
              <TableHead className="px-3.5 md:px-4 py-2 type-label text-[9px] k-text-subtle h-auto">Patient</TableHead>
              <TableHead className="px-3.5 md:px-4 py-2 type-label text-[9px] k-text-subtle h-auto">Session</TableHead>
              <TableHead className="px-3.5 md:px-4 py-2 type-label text-[9px] k-text-subtle h-auto">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id} className="h-[42px] border-t k-border-soft k-row-hover transition-colors hover:bg-transparent">
                <TableCell className="align-middle px-3.5 md:px-4 py-2 text-[12px] leading-[1.3] font-semibold k-text-body">
                  {appt.time} <span className="type-label normal-case tracking-normal k-text-subtle text-[10px]">{appt.period}</span>
                </TableCell>
                <TableCell className="align-middle px-3.5 md:px-4 py-2 text-[12px] leading-[1.3] font-semibold k-text-strong">{appt.name}</TableCell>
                <TableCell className="align-middle px-3.5 md:px-4 py-2 text-[12px] leading-[1.3] k-text-body">{appt.detail}</TableCell>
                <TableCell className="align-middle px-3.5 md:px-4 py-2">
                  <StatusPill status={appt.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
