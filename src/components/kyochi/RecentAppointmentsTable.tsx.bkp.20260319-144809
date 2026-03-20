import Link from "next/link";

import { StatusPill } from "@/components/kyochi/primitives";
import type { Appointment } from "@/types";

type RecentAppointmentsTableProps = {
  appointments: Appointment[];
};

export function RecentAppointmentsTable({ appointments }: RecentAppointmentsTableProps) {
  return (
    <section className="k-surface rounded-xl shadow-sm border k-border-soft overflow-hidden">
      <div className="px-3.5 md:px-4 py-3 border-b k-border-soft flex items-center justify-between gap-2.5">
        <div>
          <h4 className="type-h3 text-[18px] k-text-strong">Recent Appointments</h4>
          <p className="type-small k-text-body mt-1">Latest schedule activity from the last 30 days.</p>
        </div>
        <Link
          href="/appointments"
          className="type-small font-bold k-brand hover:underline whitespace-nowrap"
        >
          Open Full Schedule
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="text-left k-surface-muted">
              <th className="px-3.5 md:px-4 py-2 type-label text-[9px] k-text-subtle">Time</th>
              <th className="px-3.5 md:px-4 py-2 type-label text-[9px] k-text-subtle">Patient</th>
              <th className="px-3.5 md:px-4 py-2 type-label text-[9px] k-text-subtle">Session</th>
              <th className="px-3.5 md:px-4 py-2 type-label text-[9px] k-text-subtle">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-t k-border-soft k-row-hover transition-colors">
                <td className="px-3.5 md:px-4 py-2 type-small font-semibold k-text-body">
                  {appt.time} <span className="type-label normal-case tracking-normal k-text-subtle text-[10px]">{appt.period}</span>
                </td>
                <td className="px-3.5 md:px-4 py-2 type-small font-semibold k-text-strong">{appt.name}</td>
                <td className="px-3.5 md:px-4 py-2 type-small k-text-body">{appt.detail}</td>
                <td className="px-3.5 md:px-4 py-2">
                  <StatusPill status={appt.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
