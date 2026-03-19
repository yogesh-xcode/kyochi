import Link from "next/link";

import { StatusPill } from "@/components/kyochi/primitives";
import type { Appointment } from "@/types";

type RecentAppointmentsTableProps = {
  appointments: Appointment[];
};

export function RecentAppointmentsTable({ appointments }: RecentAppointmentsTableProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-3.5 md:px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2.5">
        <div>
          <h4 className="font-bold text-slate-900">Recent Appointments</h4>
          <p className="text-[10px] text-slate-500 mt-1">Latest schedule activity from the last 30 days.</p>
        </div>
        <Link
          href="/appointments"
          className="text-[10px] font-bold text-[#d4af35] hover:underline whitespace-nowrap"
        >
          Open Full Schedule
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="text-left bg-[#f8f7f6]">
              <th className="px-3.5 md:px-4 py-2 text-[9px] uppercase tracking-wider text-slate-400">Time</th>
              <th className="px-3.5 md:px-4 py-2 text-[9px] uppercase tracking-wider text-slate-400">Patient</th>
              <th className="px-3.5 md:px-4 py-2 text-[9px] uppercase tracking-wider text-slate-400">Session</th>
              <th className="px-3.5 md:px-4 py-2 text-[9px] uppercase tracking-wider text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-t border-slate-100 hover:bg-[#f3f0e6]/30 transition-colors">
                <td className="px-3.5 md:px-4 py-2 text-[12px] font-semibold text-slate-700">
                  {appt.time} <span className="text-slate-400 text-[10px]">{appt.period}</span>
                </td>
                <td className="px-3.5 md:px-4 py-2 text-[12px] font-semibold text-slate-900">{appt.name}</td>
                <td className="px-3.5 md:px-4 py-2 text-[12px] text-slate-500">{appt.detail}</td>
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
