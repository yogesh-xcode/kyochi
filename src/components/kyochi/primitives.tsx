import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { KIcon } from "@/components/kyochi/icons";
import type { AlertTone, AppointmentStatus, IconKey } from "@/types";

type InitialsAvatarProps = {
  initials: string;
  className?: string;
};

export function InitialsAvatar({ initials, className = "" }: InitialsAvatarProps) {
  return (
    <Avatar className={`k-brand-soft-bg after:border-transparent ${className}`}>
      <AvatarFallback className="k-brand-soft-bg font-bold k-brand-strong">{initials}</AvatarFallback>
    </Avatar>
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

  return (
    <Badge
      variant="outline"
      className={`h-auto border-transparent px-2 py-0.5 text-[10px] font-bold rounded-full ${styles[status]}`}
    >
      {status}
    </Badge>
  );
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
