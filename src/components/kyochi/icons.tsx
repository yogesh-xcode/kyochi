import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BadgeCheck,
  Brain,
  CalendarClock,
  CalendarDays,
  ChartColumn,
  ChartNoAxesColumnIncreasing,
  CheckCheck,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquareMore,
  Sparkles,
  Stethoscope,
  TriangleAlert,
  UserPlus,
  Users,
  Waves,
} from "lucide-react";

import type { IconKey } from "@/types";

const ICON_MAP: Record<IconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  group: Users,
  medical_services: Stethoscope,
  self_improvement: Waves,
  calendar_today: CalendarDays,
  payments: CreditCard,
  psychology: Brain,
  analytics: ChartColumn,
  person_add: UserPlus,
  monitoring: ChartNoAxesColumnIncreasing,
  verified: BadgeCheck,
  pending_actions: ClipboardList,
  feedback: MessageSquareMore,
  done_all: CheckCheck,
  event_upcoming: CalendarClock,
  north_east: ArrowUpRight,
  report_problem: TriangleAlert,
  auto_awesome: Sparkles,
};

type KIconProps = {
  name: IconKey;
  className?: string;
  strokeWidth?: number;
};

export function KIcon({ name, className, strokeWidth = 2 }: KIconProps) {
  const Icon = ICON_MAP[name];
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
