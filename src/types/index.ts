export type IconKey =
  | "dashboard"
  | "group"
  | "medical_services"
  | "self_improvement"
  | "calendar_today"
  | "payments"
  | "psychology"
  | "analytics"
  | "person_add"
  | "monitoring"
  | "verified"
  | "pending_actions"
  | "feedback"
  | "done_all"
  | "event_upcoming"
  | "north_east"
  | "report_problem"
  | "auto_awesome";

export type AlertTone = "amber" | "red" | "blue" | "slate";
export type AppointmentStatus = "Completed" | "In Progress" | "Waiting";

export type KpiCard = {
  icon: IconKey;
  label: string;
  value: string;
  delta: string;
  deltaColor: string;
};

export type Appointment = {
  id: string;
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
  icon: IconKey;
  tone: AlertTone;
  title: string;
  time: string;
  body: string;
  action?: string;
  dimmed?: boolean;
};

export type NavItem = {
  icon: IconKey;
  label: string;
  href: string;
  pulse?: boolean;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export type UserRole = "admin" | "franchisee" | "therapist";

export type RevenueRange = "Weekly" | "Monthly";

export type PatientInflowData = {
  todayCount: number;
  labels: string[];
  points: number[];
};

export type AiInsightBannerData = {
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
};
