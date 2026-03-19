import type {
  AlertItem,
  Appointment,
  KpiCard,
  NavSection,
  RevenueBar,
} from "@/components/kyochi/types/index";

export const kpiCards: KpiCard[] = [
  {
    icon: "person_add",
    label: "New Patients",
    value: "1,284",
    delta: "+12.5%",
    deltaColor: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: "monitoring",
    label: "Monthly Revenue",
    value: "$42,500",
    delta: "+4.2%",
    deltaColor: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: "verified",
    label: "Success Rate",
    value: "94.8%",
    delta: "Stable",
    deltaColor: "text-slate-400 bg-transparent",
  },
  {
    icon: "pending_actions",
    label: "Pending Feedback",
    value: "28",
    delta: "High",
    deltaColor: "text-amber-600 bg-amber-50",
  },
];

export const appointments: Appointment[] = [
  {
    time: "09:00",
    period: "AM",
    name: "Eleanor Shellstrop",
    detail: "CBT Therapy with Dr. Aris",
    status: "Completed",
    avatar: "ES",
  },
  {
    time: "10:30",
    period: "AM",
    name: "Tahani Al-Jamil",
    detail: "Wellness Consultation with Dr. M",
    status: "In Progress",
    avatar: "TA",
  },
  {
    time: "11:45",
    period: "AM",
    name: "Chidi Anagonye",
    detail: "Anxiety Management",
    status: "Waiting",
    avatar: "CA",
  },
];

export const revenueBars: RevenueBar[] = [
  { day: "Mon", pct: 40, label: "$12k" },
  { day: "Tue", pct: 65, label: "$18k" },
  { day: "Wed", pct: 50, label: "$15k" },
  { day: "Thu", pct: 85, label: "$24k" },
  { day: "Fri", pct: 70, label: "$20k" },
  { day: "Sat", pct: 95, label: "$28k" },
  { day: "Sun", pct: 60, label: "$17k" },
];

export const alerts: AlertItem[] = [
  {
    icon: "feedback",
    tone: "amber",
    title: "Feedback Pending",
    time: "2h ago",
    body: "5 patients completed therapy sessions but haven't received post-care surveys.",
    action: "Automate Now",
  },
  {
    icon: "payments",
    tone: "red",
    title: "Unpaid Invoices",
    time: "5h ago",
    body: "Invoice #KY-9921 for 'Chidi Anagonye' is 3 days overdue ($240.00).",
    action: "Send Reminder",
  },
  {
    icon: "psychology",
    tone: "blue",
    title: "AI Trend Detected",
    time: "Yesterday",
    body: "Anxiety-related symptoms have increased by 15% in the downtown region.",
    action: "View Analytics",
  },
  {
    icon: "done_all",
    tone: "slate",
    title: "System Update",
    time: "1d ago",
    body: "Core engine updated to v2.4.1. Security patches applied successfully.",
    dimmed: true,
  },
];

export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { icon: "dashboard", label: "Dashboard", active: true },
      { icon: "group", label: "Patients" },
      { icon: "medical_services", label: "Therapists" },
      { icon: "self_improvement", label: "Therapies" },
    ],
  },
  {
    label: "Clinical",
    items: [
      { icon: "calendar_today", label: "Appointments" },
      { icon: "payments", label: "Billing" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { icon: "psychology", label: "AI Insights", pulse: true },
      { icon: "analytics", label: "Analytics" },
    ],
  },
];
