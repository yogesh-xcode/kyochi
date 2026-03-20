import { KIcon } from "@/components/kyochi/icons";
import type { AlertTone, AppointmentStatus, IconKey } from "@/types";

type InitialsAvatarProps = {
  initials: string;
  className?: string;
};

export function InitialsAvatar({ initials, className = "" }: InitialsAvatarProps) {
  return (
    <div
      className={`rounded-full k-brand-soft-bg flex items-center justify-center font-bold k-brand-strong shrink-0 ${className}`}
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
    Completed: "k-status-completed",
    "In Progress": "k-status-progress animate-pulse",
    Waiting: "k-status-waiting",
  };

  return <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${styles[status]}`}>{status}</span>;
}

type AlertIconProps = {
  tone: AlertTone;
  icon: IconKey;
};

export function AlertIcon({ tone, icon }: AlertIconProps) {
  const styles: Record<AlertTone, string> = {
    amber: "k-tone-amber",
    red: "k-tone-red",
    blue: "k-tone-blue",
    slate: "k-tone-slate",
  };

  return (
    <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${styles[tone]}`}>
      <KIcon name={icon} className="size-4" />
    </div>
  );
}
