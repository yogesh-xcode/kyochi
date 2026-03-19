export type AlertTone = "amber" | "red" | "blue" | "slate";
export type AppointmentStatus = "Completed" | "In Progress" | "Waiting";

export type KpiCard = {
  icon: string;
  label: string;
  value: string;
  delta: string;
  deltaColor: string;
};

export type Appointment = {
  time: string;
  period: string;
  name: string;
  detail: string;
  status: AppointmentStatus;
  avatar: string;
};

export type RevenueBar = {
  day: string;
  pct: number;
  label: string;
};

export type AlertItem = {
  icon: string;
  tone: AlertTone;
  title: string;
  time: string;
  body: string;
  action?: string;
  dimmed?: boolean;
};

export type NavItem = {
  icon: string;
  label: string;
  href: string;
  pulse?: boolean;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export type RevenueRange = "Weekly" | "Monthly";
