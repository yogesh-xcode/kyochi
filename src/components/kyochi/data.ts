import type {
  AiInsightBannerData,
  AlertItem,
  Appointment,
  AppointmentStatus,
  NavSection,
  PatientInflowData,
  RevenueBar,
  UserRole,
} from "@/types";
import {
  buildDashboardKpiCards,
  computeDashboardFormulaMetrics,
  formatCurrencyINR,
} from "@/lib/metrics";
import { scopeAppointmentsByRole } from "@/lib/roleScope";
import type { BootstrapData } from "@/lib/supabase/types";

const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type DashboardBundle = {
  kpiCards: ReturnType<typeof buildDashboardKpiCards>;
  recentAppointments: Appointment[];
  revenueBars: RevenueBar[];
  patientInflow: PatientInflowData;
  aiInsightBanner: AiInsightBannerData;
  alerts: AlertItem[];
  therapistNotes: {
    id: string;
    patientName: string;
    patientAvatar: string;
    note: string;
    observedAt: string;
  }[];
  pendingFeedbackItems: {
    id: string;
    patientName: string;
    patientAvatar: string;
    therapyName: string;
    rating: number | null;
    observedAt: string;
  }[];
};

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
  if (status === "scheduled") {
    return "Scheduled";
  }
  return "Waiting";
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

const toDateKey = (dateLike: string) => new Date(dateLike).toISOString().slice(0, 10);

const toFeedbackNoteText = (notes: unknown) => {
  if (notes == null) {
    return "";
  }
  if (typeof notes === "string") {
    return notes.trim();
  }
  try {
    return JSON.stringify(notes);
  } catch {
    return "";
  }
};

export const buildDashboardData = ({
  data,
  role,
  therapistId,
  patientId,
  franchiseId,
}: {
  data: BootstrapData;
  role: UserRole;
  therapistId: string;
  patientId: string;
  franchiseId: string;
}): DashboardBundle => {
  const therapistById = new Map(
    data.therapists.map((therapist) => [therapist.id, therapist]),
  );
  const therapyById = new Map(data.therapies.map((therapy) => [therapy.id, therapy]));
  const patientById = new Map(data.patients.map((patient) => [patient.id, patient]));

  const scopedAppointments = scopeAppointmentsByRole(
    data.appointments,
    role,
    therapistId,
    patientId,
    franchiseId,
  );
  const scopedAppointmentIds = new Set(scopedAppointments.map((entry) => entry.id));
  const appointmentById = new Map(scopedAppointments.map((entry) => [entry.id, entry]));
  const scopedPatientIds = new Set(scopedAppointments.map((entry) => entry.patient_id));

  const scopedPatients =
    role === "therapist"
      ? data.patients.filter((patient) => scopedPatientIds.has(patient.id))
      : role === "patient"
        ? data.patients.filter((patient) => scopedPatientIds.has(patient.id))
      : role === "franchisee"
        ? data.patients.filter((patient) => patient.franchise_id === franchiseId)
        : data.patients;

  const scopedTherapists =
    role === "therapist"
      ? data.therapists.filter((therapist) => therapist.id === therapistId)
      : role === "patient"
        ? data.therapists.filter((therapist) =>
            scopedAppointments.some(
              (appointment) => appointment.therapist_id === therapist.id,
            ),
          )
      : role === "franchisee"
        ? data.therapists.filter((therapist) => therapist.franchise_id === franchiseId)
        : data.therapists;

  const scopedBilling = data.billing.filter((invoice) =>
    scopedAppointmentIds.has(invoice.appointment_id),
  );

  const scopedFeedback = data.feedback.filter((entry) =>
    scopedAppointmentIds.has(entry.appointment_id),
  );

  const scopedFranchises =
    role === "franchisee"
      ? data.franchises.filter((franchise) => franchise.id === franchiseId)
      : role === "patient"
        ? data.franchises.filter((franchise) =>
            scopedAppointments.some(
              (appointment) => appointment.franchise_id === franchise.id,
            ),
          )
      : role === "therapist"
        ? data.franchises.filter((franchise) =>
            scopedAppointments.some(
              (appointment) => appointment.franchise_id === franchise.id,
            ),
          )
        : data.franchises;

  const dashboardMetrics = computeDashboardFormulaMetrics({
    appointments: scopedAppointments,
    billing: scopedBilling,
    feedback: scopedFeedback,
    patients: scopedPatients,
    therapists: scopedTherapists,
    franchises: scopedFranchises,
  });

  const {
    activeMonthKey,
    collectionRateThisMonth,
    highRiskRatio,
    invoicesThisMonth,
    overdueInvoices,
    pendingFeedbackCountTotal,
    successRateThisMonth,
    therapistUtilizationThisMonth,
    topRegion,
  } = dashboardMetrics;

  const kpiCards = buildDashboardKpiCards({
    metrics: dashboardMetrics,
    totalPatients: scopedPatients.length,
  });

  const recentAppointments: Appointment[] = scopedAppointments
    .slice()
    .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime())
    .slice(0, 3)
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

  const revenueByWeekday = weekdayOrder.reduce<
    Record<(typeof weekdayOrder)[number], number>
  >((acc, day) => ({ ...acc, [day]: 0 }), {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  });

  for (const invoice of invoicesThisMonth) {
    if (!invoice.due_date) {
      continue;
    }
    const day = new Date(`${invoice.due_date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    }) as (typeof weekdayOrder)[number] | undefined;
    if (day && revenueByWeekday[day] !== undefined) {
      revenueByWeekday[day] += invoice.amount;
    }
  }

  const maxRevenueDay = Math.max(...Object.values(revenueByWeekday), 1);

  const revenueBars: RevenueBar[] = weekdayOrder.map((day) => {
    const value = revenueByWeekday[day];
    return {
      day,
      pct: Math.max(12, Math.round((value / maxRevenueDay) * 100)),
      label: formatCurrencyINR(value),
    };
  });

  const latestAppointmentDateKey =
    scopedAppointments.length > 0
      ? toDateKey(
          scopedAppointments.reduce((latest, entry) =>
            new Date(entry.starts_at).getTime() > new Date(latest.starts_at).getTime()
              ? entry
              : latest,
          ).starts_at,
        )
      : toDateKey(new Date().toISOString());

  const appointmentsForLatestDay = scopedAppointments.filter(
    (entry) => toDateKey(entry.starts_at) === latestAppointmentDateKey,
  );

  const inflowLabels = ["08:00", "12:00", "16:00", "20:00"];
  const inflowHourBuckets = [8, 12, 16, 20];
  const inflowCounts = inflowHourBuckets.map((bucketHour, index) => {
    const nextHour = inflowHourBuckets[index + 1] ?? 24;
    return appointmentsForLatestDay.filter((entry) => {
      const hour = new Date(entry.starts_at).getHours();
      return hour >= bucketHour && hour < nextHour;
    }).length;
  });
  const maxInflowCount = Math.max(...inflowCounts, 1);

  const patientInflow: PatientInflowData = {
    todayCount: appointmentsForLatestDay.length,
    labels: inflowLabels,
    points: inflowCounts.map((count) =>
      Math.max(8, Math.round((count / maxInflowCount) * 100)),
    ),
  };

  const overdueAlert = overdueInvoices[0];
  const overduePatient = overdueAlert
    ? patientById.get(overdueAlert.patient_id)
    : undefined;

  const derivedInsights = [
    {
      title: "Collection Trend",
      metric: "collection_rate",
      change_pct: Math.round(collectionRateThisMonth),
      region: topRegion || "network",
      detected_on: activeMonthKey,
      action: "Review Billing",
    },
    {
      title: "Therapist Utilization",
      metric: "sessions_per_therapist",
      change_pct: Math.round(therapistUtilizationThisMonth * 10) / 10,
      region: "all",
      detected_on: activeMonthKey,
      action: "Balance Capacity",
    },
    {
      title: "Wellness Risk Watch",
      metric: "high_risk_patients",
      change_pct: Math.round(highRiskRatio),
      region: "all",
      detected_on: activeMonthKey,
      action: "Plan Follow-up",
    },
  ];

  const alerts: AlertItem[] = [
    {
      icon: "feedback",
      tone: "amber",
      title: "Feedback Pending",
      time: "Live",
      body: `${pendingFeedbackCountTotal} completed sessions are waiting for post-care survey feedback.`,
      action: "Automate Now",
    },
    ...(overdueAlert
      ? [
          {
            icon: "payments" as const,
            tone: "red" as const,
            title: "Unpaid Invoices",
            time: "Today",
            body: `Invoice ${overdueAlert.id.toUpperCase()} for '${overduePatient?.full_name ?? "Patient"}' is overdue (${formatCurrencyINR(overdueAlert.amount)}).`,
            action: "Send Reminder",
          },
        ]
      : []),
    ...derivedInsights.map((insight) => ({
      icon: "psychology" as const,
      tone: "blue" as const,
      title: insight.title,
      time: insight.detected_on,
      body: `${insight.metric.replaceAll("_", " ")} is at ${insight.change_pct}% for ${insight.region}.`,
      action: insight.action,
    })),
    {
      icon: "done_all",
      tone: "slate",
      title: "System Update",
      time: "Live",
      body: "Dashboard signals now run from formula-based metrics across all 7 core datasets.",
      dimmed: true,
    },
  ];

  const recommendationTitle =
    pendingFeedbackCountTotal > 0
      ? "Close the Feedback Gap"
      : overdueInvoices.length > 0
        ? "Accelerate Invoice Recovery"
        : "Scale High-Demand Capacity";

  const recommendationBody =
    pendingFeedbackCountTotal > 0
      ? `${pendingFeedbackCountTotal} completed sessions still have no submitted feedback. Trigger same-day nudges to improve follow-up completion and care continuity.`
      : overdueInvoices.length > 0
        ? `${overdueInvoices.length} invoices are overdue with ${formatCurrencyINR(overdueInvoices.reduce((sum, invoice) => sum + invoice.amount, 0))} at risk. Prioritize aging buckets and reminder automation.`
        : `Current completion is ${successRateThisMonth.toFixed(1)}% with ${therapistUtilizationThisMonth.toFixed(1)} completed sessions per active therapist. Expand slots in top-demand regions to sustain throughput.`;

  const recommendationSecondaryAction =
    pendingFeedbackCountTotal > 0
      ? "Open Feedback Queue"
      : overdueInvoices.length > 0
        ? "Open Billing Queue"
        : "Open Appointment Plan";

  const aiInsightBanner: AiInsightBannerData = {
    title: recommendationTitle,
    body: recommendationBody,
    primaryAction: "Apply Recommendation",
    secondaryAction: recommendationSecondaryAction,
  };

  const therapistNotes = scopedFeedback
    .filter((entry) => toFeedbackNoteText(entry.notes).length > 0)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.submitted_at ?? b.session_date ?? "1970-01-01").getTime() -
        new Date(a.submitted_at ?? a.session_date ?? "1970-01-01").getTime(),
    )
    .slice(0, 3)
    .map((entry) => {
      const appointment = appointmentById.get(entry.appointment_id);
      const patient = patientById.get(entry.patient_id);
      return {
        id: entry.id,
        patientName: patient?.full_name ?? "Unknown Patient",
        patientAvatar: toInitials(patient?.full_name ?? "UP"),
        note: toFeedbackNoteText(entry.notes),
        observedAt: entry.submitted_at ?? entry.session_date ?? appointment?.starts_at ?? "",
      };
    });

  const pendingFeedbackItems = scopedFeedback
    .slice()
    .sort(
      (a, b) =>
        new Date(b.submitted_at ?? b.session_date ?? "1970-01-01").getTime() -
        new Date(a.submitted_at ?? a.session_date ?? "1970-01-01").getTime(),
    )
    .slice(0, 4)
    .map((entry) => {
      const appointment = appointmentById.get(entry.appointment_id);
      const patient = patientById.get(entry.patient_id);
      const therapyName = appointment ? therapyById.get(appointment.therapy_id)?.name : undefined;
      return {
        id: entry.id,
        patientName: patient?.full_name ?? "Unknown Patient",
        patientAvatar: toInitials(patient?.full_name ?? "UP"),
        therapyName: therapyName ?? "Therapy Session",
        rating: entry.rating,
        observedAt: entry.submitted_at ?? entry.session_date ?? appointment?.starts_at ?? "",
      };
    });

  return {
    kpiCards,
    recentAppointments,
    revenueBars,
    patientInflow,
    aiInsightBanner,
    alerts,
    therapistNotes,
    pendingFeedbackItems,
  };
};

const adminNavSections: NavSection[] = [
  {
    label: "Overview",
    items: [{ icon: "dashboard", label: "Dashboard", href: "/dashboard" }],
  },
  {
    label: "Operations",
    items: [
      { icon: "calendar_today", label: "Appointments", href: "/appointments" },
      { icon: "group", label: "Patients", href: "/patients" },
      { icon: "payments", label: "Billing", href: "/billing" },
      { icon: "feedback", label: "Feedback", href: "/feedback" },
    ],
  },
  {
    label: "People & Services",
    items: [
      { icon: "medical_services", label: "Therapists", href: "/therapists" },
      { icon: "self_improvement", label: "Therapies", href: "/therapies" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { icon: "psychology", label: "Wellness Intelligence", href: "/wellness-intelligence", pulse: true },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: "group", label: "Franchises", href: "/franchises" },
      { icon: "pending_actions", label: "Access Manager", href: "/access-manager" },
    ],
  },
];

const franchiseeNavSections: NavSection[] = [
  {
    label: "Overview",
    items: [{ icon: "dashboard", label: "Dashboard", href: "/dashboard" }],
  },
  {
    label: "Operations",
    items: [
      { icon: "calendar_today", label: "Appointments", href: "/appointments" },
      { icon: "group", label: "Patients", href: "/patients" },
      { icon: "payments", label: "Billing", href: "/billing" },
      { icon: "feedback", label: "Feedback", href: "/feedback" },
    ],
  },
  {
    label: "People & Services",
    items: [
      { icon: "medical_services", label: "Therapists", href: "/therapists" },
      { icon: "self_improvement", label: "Therapies", href: "/therapies" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { icon: "psychology", label: "Wellness Intelligence", href: "/wellness-intelligence", pulse: true },
    ],
  },
];

const therapistNavSections: NavSection[] = [
  {
    label: "Overview",
    items: [{ icon: "dashboard", label: "Dashboard", href: "/dashboard" }],
  },
  {
    label: "My Work",
    items: [
      { icon: "calendar_today", label: "My Appointments", href: "/appointments" },
      { icon: "group", label: "My Patients", href: "/patients" },
    ],
  },
  {
    label: "Actions",
    items: [{ icon: "feedback", label: "Feedback", href: "/feedback" }],
  },
];

const patientNavSections: NavSection[] = [
  {
    label: "Overview",
    items: [{ icon: "dashboard", label: "Dashboard", href: "/dashboard" }],
  },
  {
    label: "My Care",
    items: [
      { icon: "calendar_today", label: "Appointments", href: "/appointments" },
      { icon: "payments", label: "Billing", href: "/billing" },
      { icon: "feedback", label: "Feedback", href: "/feedback" },
    ],
  },
];

export const roleNavSections: Record<UserRole, NavSection[]> = {
  admin: adminNavSections,
  franchisee: franchiseeNavSections,
  therapist: therapistNavSections,
  patient: patientNavSections,
};
