import Link from "next/link";
import { ArrowUpRight, CalendarClock } from "lucide-react";

import { InitialsAvatar, StatusPill } from "@/components/kyochi/primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment } from "@/types";

type AppointmentsPanelProps = {
  appointments: Appointment[];
};

export function AppointmentsPanel({ appointments }: AppointmentsPanelProps) {
  return (
    <Card className="k-surface rounded-xl shadow-sm border k-border-soft overflow-hidden py-0 ring-0 gap-0">
      <CardHeader className="px-6 py-4 border-b k-border-soft flex flex-row items-center justify-between">
        <CardTitle className="type-h3 text-[18px] k-text-strong flex items-center gap-2">
          <CalendarClock className="size-4 k-brand" />
          Today&apos;s Appointments
        </CardTitle>
        <Link
          href="/appointments"
          className="inline-flex size-8 items-center justify-center rounded-lg k-text-body hover:k-brand hover:bg-[var(--k-color-surface-muted)] transition-colors"
          aria-label="Open appointments page"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
      <div className="divide-y k-border-soft">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="px-6 py-4 flex items-center gap-4 k-row-hover transition-colors"
          >
            <div className="text-center min-w-15">
              <p className="type-small font-bold k-brand">{appt.time}</p>
              <p className="type-label normal-case tracking-normal text-[10px] k-text-subtle">{appt.period}</p>
            </div>
            <InitialsAvatar initials={appt.avatar} className="size-10 text-xs" />
            <div className="flex-1">
              <p className="type-small font-bold k-text-strong">{appt.name}</p>
              <p className="type-small text-[12px] k-text-body">{appt.detail}</p>
            </div>
            <StatusPill status={appt.status} />
          </div>
        ))}
      </div>
      </CardContent>
    </Card>
  );
}
