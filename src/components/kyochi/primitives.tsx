import type { AlertTone, AppointmentStatus } from "@/components/kyochi/types";

type MSOProps = {
  children: string;
  className?: string;
};

export function MSO({ children, className = "" }: MSOProps) {
  return <span className={`material-symbols-outlined ${className}`}>{children}</span>;
}

type InitialsAvatarProps = {
  initials: string;
  className?: string;
};

export function InitialsAvatar({ initials, className = "" }: InitialsAvatarProps) {
  return (
    <div
      className={`rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800 shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}

type StatusPillProps = {
  status: AppointmentStatus;
};

export function StatusPill({ status }: StatusPillProps) {
  const styles: Record<AppointmentStatus, string> = {
    Completed: "bg-emerald-100 text-emerald-700",
    "In Progress": "bg-amber-100 text-amber-700 animate-pulse",
    Waiting: "bg-slate-100 text-slate-500",
  };

  return <span className={`px-3 py-1 text-xs font-bold rounded-full ${styles[status]}`}>{status}</span>;
}

type AlertIconProps = {
  tone: AlertTone;
  icon: string;
};

export function AlertIcon({ tone, icon }: AlertIconProps) {
  const styles: Record<AlertTone, string> = {
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${styles[tone]}`}>
      <MSO>{icon}</MSO>
    </div>
  );
}
