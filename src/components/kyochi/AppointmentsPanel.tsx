import { InitialsAvatar, MSO, StatusPill } from "@/components/kyochi/primitives";
import type { Appointment } from "@/components/kyochi/types/index";

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
        <div className="flex items-center gap-2">
          <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">
            Live Status
          </span>
        </div>
      </div>
      <div className="divide-y divide-slate-50">
        {appointments.map((appt) => (
          <div
            key={appt.name}
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
