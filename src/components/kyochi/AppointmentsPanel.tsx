import Link from "next/link";

import { InitialsAvatar, MSO, StatusPill } from "@/components/kyochi/primitives";
import type { Appointment } from "@/types";

type AppointmentsPanelProps = {
  appointments: Appointment[];
};

export function AppointmentsPanel({ appointments }: AppointmentsPanelProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <MSO className="text-[#d4af35]">event_upcoming</MSO>
          Today&apos;s Appointments
        </h4>
        <Link
          href="/appointments"
          className="inline-flex items-center justify-center size-8 rounded-lg text-slate-500 hover:text-[#d4af35] hover:bg-[#f3f0e6] transition-colors"
          aria-label="Open appointments page"
        >
          <MSO className="text-lg">north_east</MSO>
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="px-6 py-4 flex items-center gap-4 hover:bg-[#f3f0e6]/30 transition-colors"
          >
            <div className="text-center min-w-15">
              <p className="text-sm font-bold text-[#d4af35]">{appt.time}</p>
              <p className="text-[10px] text-slate-400 uppercase">{appt.period}</p>
            </div>
            <InitialsAvatar initials={appt.avatar} className="size-10 text-xs" />
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{appt.name}</p>
              <p className="text-xs text-slate-500">{appt.detail}</p>
            </div>
            <StatusPill status={appt.status} />
          </div>
        ))}
      </div>
    </section>
  );
}
