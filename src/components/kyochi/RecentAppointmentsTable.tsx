import Link from "next/link";
import { Clock3 } from "lucide-react";

import { StatusPill } from "@/components/kyochi/primitives";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { Appointment } from "@/types";

type RecentAppointmentsTableProps = {
  appointments: Appointment[];
};

export function RecentAppointmentsTable({ appointments }: RecentAppointmentsTableProps) {
  return (
    <Card className="k-surface rounded-xl shadow-sm border k-border-soft overflow-hidden py-0 ring-0 gap-0 h-full">
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
      <CardContent className="p-3.5 md:p-4 flex h-full flex-col">
        {appointments.length === 0 ? (
          <div className="rounded-xl border border-dashed k-border-soft bg-[var(--k-color-surface-muted)] px-4 py-7 text-center">
            <p className="text-[13px] font-semibold k-text-strong">No recent appointments</p>
            <p className="mt-1 text-[12px] k-text-body">
              Scheduled sessions from the last 30 days will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {appointments.map((appt) => (
              <article
                key={appt.id}
                className="rounded-xl border k-border-soft bg-[var(--k-color-surface-muted)] p-3 transition-colors hover:bg-[var(--k-color-surface)]"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold leading-[1.35] k-text-strong">{appt.name}</p>
                  <StatusPill status={appt.status} />
                </div>

                <p className="text-[12px] leading-[1.45] line-clamp-2 k-text-body">{appt.detail}</p>

                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border k-border-soft px-2.5 py-1 text-[11px] font-semibold k-text-body">
                  <Clock3 className="size-3.5" />
                  {appt.time} {appt.period}
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
