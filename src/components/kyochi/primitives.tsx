import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { KIcon } from "@/components/kyochi/icons";
import { Circle } from "lucide-react";
import type { AlertTone, IconKey } from "@/types";

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
  status: string;
};

export function StatusPill({ status }: StatusPillProps) {
  const toneByStatus: Record<string, string> = {
    completed: "bg-[#dcfce7] text-[#16a34a]",
    paid: "bg-[#dcfce7] text-[#16a34a]",
    submitted: "bg-[#dcfce7] text-[#16a34a]",
    active: "bg-[#dcfce7] text-[#16a34a]",
    "in progress": "bg-[#fef3c7] text-[#b45309]",
    waiting: "bg-[#fee2e2] text-[#ef4444]",
    pending: "bg-[#fee2e2] text-[#ef4444]",
    overdue: "bg-[#fee2e2] text-[#ef4444]",
    inactive: "bg-[#fee2e2] text-[#ef4444]",
    cancelled: "bg-[#fee2e2] text-[#ef4444]",
  };
  const normalizedStatus = status.trim().toLowerCase();
  const toneClass = toneByStatus[normalizedStatus] ?? "bg-[#fee2e2] text-[#ef4444]";

  return (
    <Badge
      variant="outline"
      className={`inline-flex h-auto items-center gap-1 rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold ${toneClass}`}
    >
      <Circle className="size-2 fill-current stroke-none" />
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
