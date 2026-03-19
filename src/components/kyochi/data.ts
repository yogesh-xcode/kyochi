import aiInsightsData from "../../../data/ai_insights.json";
import appointmentsData from "../../../data/appointments.json";
import billingData from "../../../data/billing.json";
import patientsData from "../../../data/patients.json";
import therapiesData from "../../../data/therapies.json";
import therapistsData from "../../../data/therapists.json";

import type {
  AiInsightBannerData,
  AlertItem,
  Appointment,
  AppointmentStatus,
  KpiCard,
  NavSection,
  PatientInflowData,
  RevenueBar,
} from "@/types";

const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const therapistById = new Map(therapistsData.map((therapist) => [therapist.id, therapist]));
const therapyById = new Map(therapiesData.map((therapy) => [therapy.id, therapy]));
const patientById = new Map(patientsData.map((patient) => [patient.id, patient]));

const toCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    amount,
  );

const toInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const toAppointmentStatus = (status: string): AppointmentStatus => {
  if (status === "completed") {
    return "Completed";
  }
  if (status === "in_progress") {
    return "In Progress";
  }
  if (status === "cancelled") {
    return "Cancelled";
  }
  return "Pending";
};

const toTimeLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, "0");
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return {
    time: `${hour12.toString().padStart(2, "0")}:${minute}`,
    period,
  };
};

const newPatients = patientsData.length;
const monthlyRevenue = billingData.reduce((sum, invoice) => sum + invoice.amount, 0);

const completedAppointments = appointmentsData.filter((appointment) => appointment.status === "completed").length;
const overdueInvoices = billingData.filter((invoice) => invoice.status === "overdue");
const totalAppointments = appointmentsData.length;
const successRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

export const kpiCards: KpiCard[] = [
  {
    icon: "person_add",
    label: "New Patients",
    value: new Intl.NumberFormat("en-US").format(newPatients),
    delta: `${patientsData.length} Total`,
    deltaColor: "k-delta-positive",
    accentTone: "positive",
  },
  {
    icon: "monitoring",
    label: "Monthly Revenue",
    value: toCurrency(monthlyRevenue),
    delta: `${billingData.length} Invoices`,
    deltaColor: "k-delta-positive",
    accentTone: "positive",
  },
  {
    icon: "verified",
    label: "Success Rate",
    value: `${successRate.toFixed(1)}%`,
    delta: "Live",
    deltaColor: "k-delta-neutral",
    accentTone: "neutral",
  },
  {
    icon: "pending_actions",
    label: "Pending Feedback",
    value: completedAppointments.toString(),
    delta: completedAppointments > 0 ? "High" : "Low",
    deltaColor: "k-delta-alert",
    accentTone: "alert",
  },
];

export const appointments: Appointment[] = appointmentsData
  .slice()
  .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
  .map((entry) => {
    const patient = patientById.get(entry.patient_id);
    const therapist = therapistById.get(entry.therapist_id);
    const therapy = therapyById.get(entry.therapy_id);
    const { time, period } = toTimeLabel(entry.starts_at);

    return {
      id: entry.id,
      time,
      period,
      name: patient?.full_name ?? "Unknown Patient",
      detail: `${therapy?.name ?? "Therapy Session"} with ${therapist?.full_name ?? "Assigned Therapist"}`,
      status: toAppointmentStatus(entry.status),
      avatar: toInitials(patient?.full_name ?? "UP"),
    };
  });

const revenueByWeekday = weekdayOrder.reduce<Record<(typeof weekdayOrder)[number], number>>(
  (acc, day) => ({ ...acc, [day]: 0 }),
  { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
);

for (const invoice of billingData) {
  const day = new Date(invoice.due_date).toLocaleDateString("en-US", { weekday: "short" }) as
    | (typeof weekdayOrder)[number]
    | undefined;
  if (day && revenueByWeekday[day] !== undefined) {
    revenueByWeekday[day] += invoice.amount;
  }
}

const maxRevenueDay = Math.max(...Object.values(revenueByWeekday), 1);

export const revenueBars: RevenueBar[] = weekdayOrder.map((day) => {
  const value = revenueByWeekday[day];
  return {
    day,
    pct: Math.max(12, Math.round((value / maxRevenueDay) * 100)),
    label: toCurrency(value),
  };
});

const inflowLabels = ["08:00", "12:00", "16:00", "20:00"];
const inflowHourBuckets = [8, 12, 16, 20];
const inflowCounts = inflowHourBuckets.map((bucketHour, index) => {
  const nextHour = inflowHourBuckets[index + 1] ?? 24;
  return appointmentsData.filter((entry) => {
    const hour = new Date(entry.starts_at).getHours();
    return hour >= bucketHour && hour < nextHour;
  }).length;
});
const maxInflowCount = Math.max(...inflowCounts, 1);

export const patientInflow: PatientInflowData = {
  todayCount: appointmentsData.length,
  labels: inflowLabels,
  points: inflowCounts.map((count) => Math.max(8, Math.round((count / maxInflowCount) * 100))),
};

const overdueAlert = overdueInvoices[0];
const overduePatient = overdueAlert ? patientById.get(overdueAlert.patient_id) : undefined;

export const alerts: AlertItem[] = [
  {
    icon: "feedback",
    tone: "amber",
    title: "Feedback Pending",
    time: "Live",
    body: `${completedAppointments} completed sessions are waiting for post-care survey feedback.`,
    action: "Automate Now",
  },
  ...(overdueAlert
    ? [
      {
        icon: "payments" as const,
        tone: "red" as const,
        title: "Unpaid Invoices",
        time: "Today",
        body: `Invoice ${overdueAlert.id.toUpperCase()} for '${overduePatient?.full_name ?? "Patient"}' is overdue (${toCurrency(overdueAlert.amount)}).`,
        action: "Send Reminder",
      },
    ]
    : []),
  ...aiInsightsData.map((insight) => ({
    icon: "psychology" as const,
    tone: "blue" as const,
    title: insight.title,
    time: insight.detected_on,
    body: `${insight.metric.replaceAll("_", " ")} changed by ${insight.change_pct}% in ${insight.region}.`,
    action: "View Analytics",
  })),
  {
    icon: "done_all",
    tone: "slate",
    title: "System Update",
    time: "1d ago",
    body: "Core engine updated and synced with local dataset references.",
    dimmed: true,
  },
];

const recommendationInsight = aiInsightsData.find((insight) => insight.type === "recommendation");

export const aiInsightBanner: AiInsightBannerData = {
  title: recommendationInsight?.title ?? "Wellness Optimization",
  body: recommendationInsight
    ? `${recommendationInsight.metric.replaceAll("_", " ")} changed by ${recommendationInsight.change_pct}% in ${recommendationInsight.region}. Prioritize allocation around this signal to improve outcomes.`
    : "Review latest AI insights to optimize therapist allocation and reduce wait times.",
  primaryAction: "Apply Recommendation",
  secondaryAction: "View Full Analysis",
};

export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
      { icon: "group", label: "Patients", href: "/patients" },
      { icon: "medical_services", label: "Therapists", href: "/therapists" },
      { icon: "self_improvement", label: "Therapies", href: "/therapies" },
    ],
  },
  {
    label: "Clinical",
    items: [
      { icon: "calendar_today", label: "Appointments", href: "/appointments" },
      { icon: "payments", label: "Billing", href: "/billing" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { icon: "psychology", label: "AI Insights", href: "/ai-insights", pulse: true },
      { icon: "analytics", label: "Analytics", href: "/analytics" },
    ],
  },
];
