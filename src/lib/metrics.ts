import type { KpiCard, UserRole } from "@/types";

type PatientRow = {
  id: string;
  wellness_score: number;
  status: string;
};

type TherapistRow = {
  id: string;
  status: string;
  specialty: string;
};

type TherapyRow = {
  id: string;
  status: string;
  category: string;
  duration_min: number;
  session_count: number;
};

type AppointmentRow = {
  id: string;
  patient_id: string;
  therapy_id: string;
  therapist_id: string;
  starts_at: string;
  status: string;
};

type BillingRow = {
  id: string;
  appointment_id: string;
  patient_id: string;
  amount: number;
  status: string;
  due_date: string | null;
};

type FeedbackRow = {
  id: string;
  appointment_id: string;
  status: string;
  rating: number | null;
  session_date?: string | null;
};

type FranchiseRow = {
  id: string;
  region: string;
};

export type ManagementKpi = {
  label: string;
  value: string;
  delta: string;
  helper: string;
};

export type DashboardFormulaMetrics = {
  newPatientsThisMonth: number;
  monthlyRevenuePaid: number;
  successRateThisMonth: number;
  pendingFeedbackCountThisMonth: number;
  pendingFeedbackCountTotal: number;
  collectionRateThisMonth: number;
  therapistUtilizationThisMonth: number;
  avgWellnessScore: number;
  highRiskRatio: number;
  topRegion: string;
  topRegionCount: number;
  activeMonthKey: string;
  invoicesThisMonth: BillingRow[];
  appointmentsThisMonth: AppointmentRow[];
  overdueInvoices: BillingRow[];
};

type KpiAudience = "admin" | "therapist" | "patient";

const resolveKpiAudience = (role?: UserRole): KpiAudience => {
  if (role === "therapist") {
    return "therapist";
  }
  if (role === "patient") {
    return "patient";
  }
  return "admin";
};

const toMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const isSameMonth = (dateLike: string, monthKey: string) =>
  toMonthKey(new Date(dateLike)) === monthKey;

export const formatCurrencyINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const computeDashboardFormulaMetrics = ({
  appointments,
  billing,
  feedback,
  patients,
  therapists,
  franchises,
  now = Date.now(),
}: {
  appointments: AppointmentRow[];
  billing: BillingRow[];
  feedback: FeedbackRow[];
  patients: PatientRow[];
  therapists: TherapistRow[];
  franchises: FranchiseRow[];
  now?: number;
}): DashboardFormulaMetrics => {
  const latestEventTimestamp = Math.max(
    ...appointments.map((appointment) => new Date(appointment.starts_at).getTime()),
    ...billing
      .filter((invoice) => invoice.due_date != null)
      .map((invoice) => new Date(`${invoice.due_date}T00:00:00`).getTime()),
    now,
  );

  const activeMonthKey = toMonthKey(new Date(latestEventTimestamp));

  const appointmentsThisMonth = appointments.filter((appointment) =>
    isSameMonth(appointment.starts_at, activeMonthKey),
  );
  const invoicesThisMonth = billing.filter(
    (invoice) => invoice.due_date != null && isSameMonth(invoice.due_date, activeMonthKey),
  );

  const completedAppointmentsThisMonth = appointmentsThisMonth.filter(
    (appointment) => appointment.status === "completed",
  );
  const completedAppointmentsCountThisMonth = completedAppointmentsThisMonth.length;
  const pendingFeedbackCountThisMonth = feedback.filter(
    (entry) =>
      entry.status.toLowerCase() === "pending" &&
      isSameMonth(entry.session_date ?? new Date().toISOString(), activeMonthKey),
  ).length;
  const pendingFeedbackCountTotal = feedback.filter(
    (entry) => entry.status.toLowerCase() === "pending",
  ).length;

  const monthlyRevenuePaid = invoicesThisMonth
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const totalAppointmentsThisMonth = appointmentsThisMonth.length;
  const successRateThisMonth =
    totalAppointmentsThisMonth > 0
      ? (completedAppointmentsCountThisMonth / totalAppointmentsThisMonth) * 100
      : 0;

  const newPatientsThisMonth = new Set(
    appointmentsThisMonth.map((appointment) => appointment.patient_id),
  ).size;

  const collectionRateThisMonth =
    invoicesThisMonth.length > 0
      ? (invoicesThisMonth.filter((invoice) => invoice.status === "paid").length /
          invoicesThisMonth.length) *
        100
      : 0;

  const activeTherapistCount = therapists.filter(
    (therapist) => therapist.status === "active",
  ).length;
  const therapistUtilizationThisMonth =
    activeTherapistCount > 0
      ? completedAppointmentsCountThisMonth / activeTherapistCount
      : 0;

  const avgWellnessScore =
    patients.length > 0
      ? patients.reduce((sum, patient) => sum + patient.wellness_score, 0) /
        patients.length
      : 0;
  const highRiskCount = patients.filter(
    (patient) => patient.wellness_score < 70,
  ).length;
  const highRiskRatio =
    patients.length > 0 ? (highRiskCount / patients.length) * 100 : 0;

  const regionCounts = franchises.reduce<Record<string, number>>(
    (acc, franchise) => {
      acc[franchise.region] = (acc[franchise.region] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const [topRegion = "N/A", topRegionCount = 0] = Object.entries(
    regionCounts,
  ).sort((a, b) => b[1] - a[1])[0] ?? ["N/A", 0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueInvoices = billing.filter((invoice) => {
    if (invoice.status !== "unpaid" || !invoice.due_date) {
      return false;
    }
    return new Date(`${invoice.due_date}T00:00:00`) < today;
  });

  return {
    newPatientsThisMonth,
    monthlyRevenuePaid,
    successRateThisMonth,
    pendingFeedbackCountThisMonth,
    pendingFeedbackCountTotal,
    collectionRateThisMonth,
    therapistUtilizationThisMonth,
    avgWellnessScore,
    highRiskRatio,
    topRegion,
    topRegionCount,
    activeMonthKey,
    invoicesThisMonth,
    appointmentsThisMonth,
    overdueInvoices,
  };
};

export const buildDashboardKpiCards = ({
  metrics,
  totalPatients,
}: {
  metrics: DashboardFormulaMetrics;
  totalPatients: number;
}): KpiCard[] => [
  {
    icon: "person_add",
    label: "New Patients",
    value: new Intl.NumberFormat("en-US").format(metrics.newPatientsThisMonth),
    delta: `${totalPatients} Total`,
    deltaColor: "k-delta-positive",
  },
  {
    icon: "monitoring",
    label: "Monthly Revenue",
    value: formatCurrencyINR(metrics.monthlyRevenuePaid),
    delta: `${metrics.invoicesThisMonth.length} Invoices`,
    deltaColor: "k-delta-positive",
  },
  {
    icon: "verified",
    label: "Success Rate",
    value: `${metrics.successRateThisMonth.toFixed(1)}%`,
    delta: metrics.activeMonthKey,
    deltaColor: "k-delta-neutral",
  },
  {
    icon: "pending_actions",
    label: "Pending Feedback",
    value: metrics.pendingFeedbackCountTotal.toString(),
    delta: metrics.pendingFeedbackCountTotal > 0 ? "High" : "Low",
    deltaColor: "k-delta-warning",
  },
];

export const buildPatientsKpis = (
  patients: PatientRow[],
  role?: UserRole,
): ManagementKpi[] => {
  const audience = resolveKpiAudience(role);
  const avgWellness =
    patients.length > 0
      ? (
          patients.reduce((sum, patient) => sum + patient.wellness_score, 0) /
          patients.length
        ).toFixed(1)
      : "0.0";
  const highRiskCount = patients.filter(
    (patient) => patient.wellness_score < 70,
  ).length;
  const activeCount = patients.filter((patient) => patient.status === "active").length;
  const activeRatio = Math.round((activeCount / Math.max(patients.length, 1)) * 100);
  const primaryPatient = patients[0];
  const primaryWellness = primaryPatient ? primaryPatient.wellness_score.toFixed(1) : "0.0";
  const primaryRisk = primaryPatient && primaryPatient.wellness_score < 70 ? "High" : "Normal";
  const primaryStatus =
    primaryPatient?.status?.toLowerCase() === "active" ? "Active" : "Inactive";

  if (audience === "patient") {
    return [
      {
        label: "My Profile",
        value: primaryPatient ? "Linked" : "Pending",
        delta: primaryPatient ? "Ready" : "Setup",
        helper: "Patient profile linkage status",
      },
      {
        label: "My Wellness",
        value: primaryWellness,
        delta: "Score",
        helper: "Latest personal wellness index",
      },
      {
        label: "Risk Flag",
        value: primaryRisk,
        delta: primaryRisk === "High" ? "Review" : "Stable",
        helper: "Based on wellness threshold",
      },
      {
        label: "Profile Status",
        value: primaryStatus,
        delta: "Current",
        helper: "Account activity state",
      },
    ];
  }

  if (audience === "therapist") {
    return [
      {
        label: "Assigned Patients",
        value: patients.length.toString(),
        delta: "Live",
        helper: "Patients visible in therapist scope",
      },
      {
        label: "Active Cases",
        value: activeCount.toString(),
        delta: `${activeRatio}%`,
        helper: "Patients currently active",
      },
      {
        label: "Avg Wellness",
        value: avgWellness,
        delta: "Score",
        helper: "Average wellness across assigned patients",
      },
      {
        label: "Needs Attention",
        value: highRiskCount.toString(),
        delta: highRiskCount > 0 ? "Queue" : "Clear",
        helper: "Patients below wellness score 70",
      },
    ];
  }

  return [
    {
      label: "Total Patients",
      value: patients.length.toString(),
      delta: "Live",
      helper: "Registered patient profiles",
    },
    {
      label: "Avg Wellness",
      value: avgWellness,
      delta: "Score",
      helper: "Average wellness index",
    },
    {
      label: "Active Patients",
      value: activeCount.toString(),
      delta: `${activeRatio}%`,
      helper: "Currently active in system",
    },
    {
      label: "High Risk",
      value: highRiskCount.toString(),
      delta: "Needs review",
      helper: "Wellness score below 70",
    },
  ];
};

export const buildTherapistsKpis = (
  therapists: TherapistRow[],
  role?: UserRole,
): ManagementKpi[] => {
  const audience = resolveKpiAudience(role);
  const activeCount = therapists.filter(
    (therapist) => therapist.status === "active",
  ).length;
  const specialtyCount = new Set(
    therapists.map((therapist) => therapist.specialty),
  ).size;
  const activeRatio = Math.round((activeCount / Math.max(therapists.length, 1)) * 100);

  if (audience === "therapist") {
    return [
      {
        label: "Team Therapists",
        value: therapists.length.toString(),
        delta: "Visible",
        helper: "Therapists in your operational scope",
      },
      {
        label: "Active Team",
        value: activeCount.toString(),
        delta: `${activeRatio}%`,
        helper: "Active therapists currently enabled",
      },
      {
        label: "Specialty Coverage",
        value: specialtyCount.toString(),
        delta: "Network",
        helper: "Distinct specialties in team",
      },
      {
        label: "Credentialed Team",
        value: therapists.length.toString(),
        delta: "Verified",
        helper: "Licensed therapist profiles in scope",
      },
    ];
  }

  if (audience === "patient") {
    return [
      {
        label: "Available Therapists",
        value: therapists.length.toString(),
        delta: "Visible",
        helper: "Therapists available for booking",
      },
      {
        label: "Active Therapists",
        value: activeCount.toString(),
        delta: `${activeRatio}%`,
        helper: "Therapists open for care sessions",
      },
      {
        label: "Specialties",
        value: specialtyCount.toString(),
        delta: "Coverage",
        helper: "Wellness specialties available to you",
      },
      {
        label: "Credentialed",
        value: therapists.length.toString(),
        delta: "Verified",
        helper: "Licensed therapist profile count",
      },
    ];
  }

  return [
    {
      label: "Total Therapists",
      value: therapists.length.toString(),
      delta: "Live",
      helper: "Available practitioners",
    },
    {
      label: "Active Therapists",
      value: activeCount.toString(),
      delta: `${activeRatio}%`,
      helper: "Enabled for assignments",
    },
    {
      label: "Specialties",
      value: specialtyCount.toString(),
      delta: "Coverage",
      helper: "Distinct therapy specializations",
    },
    {
      label: "Credentialed",
      value: therapists.length.toString(),
      delta: "Verified",
      helper: "Licensed profile count",
    },
  ];
};

export const buildTherapiesKpis = (
  therapies: TherapyRow[],
  role?: UserRole,
): ManagementKpi[] => {
  const audience = resolveKpiAudience(role);
  const activeCount = therapies.filter((therapy) => therapy.status === "active").length;
  const averageDuration =
    therapies.length > 0
      ? Math.round(
          therapies.reduce((sum, therapy) => sum + therapy.duration_min, 0) /
            therapies.length,
        )
      : 0;
  const categoryCount = new Set(therapies.map((therapy) => therapy.category)).size;
  const totalPlans = therapies.reduce(
    (sum, therapy) => sum + therapy.session_count,
    0,
  );
  const activeRatio = Math.round((activeCount / Math.max(therapies.length, 1)) * 100);

  if (audience === "therapist") {
    return [
      {
        label: "Therapies in Scope",
        value: therapies.length.toString(),
        delta: "Live",
        helper: "Therapies available to therapist operations",
      },
      {
        label: "Active Therapies",
        value: activeCount.toString(),
        delta: `${activeRatio}%`,
        helper: "Therapies currently available for sessions",
      },
      {
        label: "Avg Duration",
        value: `${averageDuration} mins`,
        delta: "Standard",
        helper: "Typical treatment duration",
      },
      {
        label: "Session Plans",
        value: totalPlans.toString(),
        delta: `${categoryCount} categories`,
        helper: "Combined sessions across therapy plans",
      },
    ];
  }

  if (audience === "patient") {
    return [
      {
        label: "Bookable Therapies",
        value: activeCount.toString(),
        delta: `${therapies.length} listed`,
        helper: "Therapies currently open for booking",
      },
      {
        label: "Category Coverage",
        value: categoryCount.toString(),
        delta: "Options",
        helper: "Distinct therapy categories",
      },
      {
        label: "Avg Duration",
        value: `${averageDuration} mins`,
        delta: "Expected",
        helper: "Typical session length",
      },
      {
        label: "Plan Depth",
        value: totalPlans.toString(),
        delta: "Sessions",
        helper: "Total sessions across available plans",
      },
    ];
  }

  return [
    {
      label: "Total Therapies",
      value: therapies.length.toString(),
      delta: "Live",
      helper: "Available reflexology treatments",
    },
    {
      label: "Active Therapies",
      value: activeCount.toString(),
      delta: `${activeRatio}%`,
      helper: "Currently available for booking",
    },
    {
      label: "Avg Duration",
      value: `${averageDuration} mins`,
      delta: "Stable",
      helper: "Typical session length",
    },
    {
      label: "Category Coverage",
      value: categoryCount.toString(),
      delta: `${totalPlans} plans`,
      helper: "Distinct therapy categories",
    },
  ];
};

export const buildAppointmentsKpis = (
  appointments: AppointmentRow[],
  role?: UserRole,
): ManagementKpi[] => {
  const audience = resolveKpiAudience(role);
  const completedCount = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;
  const inProgressCount = appointments.filter(
    (appointment) => appointment.status === "in_progress",
  ).length;
  const waitingCount = appointments.filter(
    (appointment) =>
      appointment.status === "waiting" || appointment.status === "scheduled",
  ).length;
  const completionRate = Math.round(
    (completedCount / Math.max(appointments.length, 1)) * 100,
  );

  if (audience === "therapist") {
    return [
      {
        label: "Assigned Sessions",
        value: appointments.length.toString(),
        delta: "Live",
        helper: "Sessions in therapist queue",
      },
      {
        label: "Completed by Me",
        value: completedCount.toString(),
        delta: `${completionRate}%`,
        helper: "Completion ratio in assigned sessions",
      },
      {
        label: "In Session",
        value: inProgressCount.toString(),
        delta: "Active",
        helper: "Sessions currently in progress",
      },
      {
        label: "Upcoming Queue",
        value: waitingCount.toString(),
        delta: "Waiting",
        helper: "Waiting or scheduled sessions",
      },
    ];
  }

  if (audience === "patient") {
    return [
      {
        label: "My Sessions",
        value: appointments.length.toString(),
        delta: "Total",
        helper: "All your appointments",
      },
      {
        label: "Completed Sessions",
        value: completedCount.toString(),
        delta: `${completionRate}%`,
        helper: "Sessions you have completed",
      },
      {
        label: "Upcoming Sessions",
        value: waitingCount.toString(),
        delta: "Scheduled",
        helper: "Waiting or scheduled sessions",
      },
      {
        label: "In Progress",
        value: inProgressCount.toString(),
        delta: "Active",
        helper: "Sessions currently ongoing",
      },
    ];
  }

  return [
    {
      label: "Total Appointments",
      value: appointments.length.toString(),
      delta: "Live",
      helper: "All scheduled sessions",
    },
    {
      label: "Completed",
      value: completedCount.toString(),
      delta: `${completionRate}%`,
      helper: "Completion ratio across sessions",
    },
    {
      label: "In Progress",
      value: inProgressCount.toString(),
      delta: "Active",
      helper: "Sessions currently ongoing",
    },
    {
      label: "Waiting",
      value: waitingCount.toString(),
      delta: "Queue",
      helper: "Patients waiting for consultation",
    },
  ];
};

export const buildBillingKpis = (
  invoices: BillingRow[],
  role?: UserRole,
): ManagementKpi[] => {
  const audience = resolveKpiAudience(role);
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const unpaidInvoices = invoices.filter((invoice) => invoice.status === "unpaid");
  const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstandingAmount = unpaidInvoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );
  const dueCount = unpaidInvoices.length;
  const collectionRate = Math.round(
    (paidInvoices.length / Math.max(invoices.length, 1)) * 100,
  );

  if (audience === "therapist") {
    return [
      {
        label: "Session Bills",
        value: invoices.length.toString(),
        delta: "Visible",
        helper: "Bills tied to therapist-visible sessions",
      },
      {
        label: "Collected Revenue",
        value: formatCurrencyINR(totalRevenue),
        delta: `${paidInvoices.length} Paid`,
        helper: "Revenue from paid bills in your scope",
      },
      {
        label: "Pending Bills",
        value: dueCount.toString(),
        delta: formatCurrencyINR(outstandingAmount),
        helper: "Unpaid invoices awaiting closure",
      },
      {
        label: "Collection Rate",
        value: `${collectionRate}%`,
        delta: "Current",
        helper: "Paid-to-total ratio",
      },
    ];
  }

  if (audience === "patient") {
    return [
      {
        label: "My Invoices",
        value: invoices.length.toString(),
        delta: "Total",
        helper: "Invoices generated for your sessions",
      },
      {
        label: "Amount Paid",
        value: formatCurrencyINR(totalRevenue),
        delta: `${paidInvoices.length} paid`,
        helper: "Your paid invoice amount",
      },
      {
        label: "Amount Due",
        value: formatCurrencyINR(outstandingAmount),
        delta: `${dueCount} unpaid`,
        helper: "Outstanding amount pending payment",
      },
      {
        label: "Payment Rate",
        value: `${collectionRate}%`,
        delta: "Status",
        helper: "Paid invoices out of total",
      },
    ];
  }

  return [
    {
      label: "Total Invoices",
      value: invoices.length.toString(),
      delta: "Live",
      helper: "All generated invoices",
    },
    {
      label: "Collected Revenue",
      value: formatCurrencyINR(totalRevenue),
      delta: `${paidInvoices.length} Paid`,
      helper: "Revenue from paid invoices",
    },
    {
      label: "Outstanding",
      value: formatCurrencyINR(outstandingAmount),
      delta: `${dueCount} Unpaid`,
      helper: "Outstanding unpaid balance",
    },
    {
      label: "Collection Rate",
      value: `${collectionRate}%`,
      delta: "Verified",
      helper: "Paid invoice ratio",
    },
  ];
};

export const buildFeedbackKpis = ({
  feedback,
  roleScopeLabel,
  role,
}: {
  feedback: FeedbackRow[];
  roleScopeLabel: string;
  role?: UserRole;
}): ManagementKpi[] => {
  const audience = resolveKpiAudience(role);
  const submitted = feedback.filter(
    (entry) => entry.status.toLowerCase() === "completed",
  );
  const pendingCount = feedback.length - submitted.length;
  const ratingSum = submitted.reduce((sum, entry) => {
    const value = Number(entry.rating ?? 0);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
  const averageRating =
    submitted.length > 0 ? (ratingSum / submitted.length).toFixed(1) : "0.0";
  const completionRate =
    feedback.length > 0 ? Math.round((submitted.length / feedback.length) * 100) : 0;


  if (audience === "therapist") {
    return [
      {
        label: "Assigned Feedback",
        value: feedback.length.toString(),
        delta: "Live",
        helper: "Feedback rows in therapist scope",
      },
      {
        label: "Avg Outcome Rating",
        value: `${averageRating}/5`,
        delta: "Updated",
        helper: "Average rating across completed feedback",
      },
      {
        label: "Completed Reviews",
        value: submitted.length.toString(),
        delta: "Captured",
        helper: "Feedback records already completed",
      },
      {
        label: "Pending Capture",
        value: pendingCount.toString(),
        delta: pendingCount > 0 ? "Queue" : "Clear",
        helper: "Sessions awaiting therapist feedback action",
      },
    ];
  }

  if (audience === "patient") {
    return [
      {
        label: "My Feedback",
        value: feedback.length.toString(),
        delta: "Total",
        helper: "Feedback records from your sessions",
      },
      {
        label: "My Avg Rating",
        value: `${averageRating}/5`,
        delta: "Submitted",
        helper: "Average rating from your completed submissions",
      },
      {
        label: "My Scope",
        value: "Personal",
        delta: "Role",
        helper: "Only your own feedback records",
      },
      {
        label: "Pending Submission",
        value: pendingCount.toString(),
        delta: pendingCount > 0 ? "Action" : "Clear",
        helper: "Sessions still awaiting your submission",
      },
    ];
  }

  if (role === "admin") {
    return [
      {
        label: "Total Network Feedback",
        value: feedback.length.toString(),
        delta: "Network-wide",
        helper: "Feedback records across all sessions and branches",
      },
      {
        label: "Network Avg Rating",
        value: `${averageRating}/5`,
        delta: "Overall",
        helper: "Average rating across all submitted feedback in the network",
      },
      {
        label: "Network Completion",
        value: `${completionRate}%`,
        delta: "Overall",
        helper: "Completion rate of feedback across the entire network",
      },
      {
        label: "Pending Network Feedback",
        value: pendingCount.toString(),
        delta: pendingCount > 0 ? "Action Required" : "Clear",
        helper: "Sessions across the network still awaiting feedback capture",
      },
    ];
  }

  if (role === "franchisee") {
    return [
      {
        label: "Branch Feedback Records",
        value: feedback.length.toString(),
        delta: "Own Branch",
        helper: "Feedback records from your branch's sessions",
      },
      {
        label: "Branch Avg Rating",
        value: `${averageRating}/5`,
        delta: "Branch-specific",
        helper: "Average rating across submitted feedback for your branch",
      },
      {
        label: "Branch Completion",
        value: `${completionRate}%`,
        delta: "Branch-specific",
        helper: "Completion rate of feedback for your branch",
      },
      {
        label: "Pending Branch Feedback",
        value: pendingCount.toString(),
        delta: pendingCount > 0 ? "Action Required" : "Clear",
        helper: "Sessions in your branch still awaiting feedback capture",
      },
    ];
  }

  // Fallback for other roles (e.g., if a new role is introduced and not explicitly handled)
  return [
    {
      label: "Total Feedback Records",
      value: feedback.length.toString(),
      delta: "Live",
      helper: "Feedback rows from all scoped sessions",
    },
    {
      label: "Average Rating",
      value: `${averageRating}/5`,
      delta: "Verified",
      helper: "Average across submitted feedback",
    },
    {
      label: "Role Scope",
      value: roleScopeLabel,
      delta: "Role",
      helper: "Current access scope",
    },
    {
      label: "Pending Feedback",
      value: pendingCount.toString(),
      delta: pendingCount > 0 ? "Queue" : "Clear",
      helper: "Sessions still awaiting feedback capture",
    },
  ];
};

export const buildFranchiseKpis = (
  franchises: FranchiseRow[],
  role?: UserRole,
): ManagementKpi[] => {
  const audience = resolveKpiAudience(role);
  const regionCounts = Object.entries(
    franchises.reduce<Record<string, number>>((acc, franchise) => {
      acc[franchise.region] = (acc[franchise.region] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const chennaiCount = franchises.filter(
    (franchise) => franchise.region === "Chennai",
  ).length;
  const chennaiCoverage = `${Math.round((chennaiCount / Math.max(franchises.length, 1)) * 100)}%`;

  if (audience === "therapist") {
    return [
      {
        label: "Franchises in Scope",
        value: franchises.length.toString(),
        delta: "Visible",
        helper: "Locations visible to therapist role",
      },
      {
        label: "Regions Covered",
        value: regionCounts.length.toString(),
        delta: "Network",
        helper: "Distinct regions in visible scope",
      },
      {
        label: "Chennai Coverage",
        value: chennaiCoverage,
        delta: "Distribution",
        helper: "Share of Chennai locations",
      },
      {
        label: "Top Region",
        value: regionCounts[0]?.[0] ?? "N/A",
        delta: `${regionCounts[0]?.[1] ?? 0} units`,
        helper: "Highest concentration in visible scope",
      },
    ];
  }

  if (audience === "patient") {
    return [
      {
        label: "Available Locations",
        value: franchises.length.toString(),
        delta: "Visible",
        helper: "Franchise locations available for booking",
      },
      {
        label: "Regions Covered",
        value: regionCounts.length.toString(),
        delta: "Network",
        helper: "Distinct regions available",
      },
      {
        label: "Chennai Coverage",
        value: chennaiCoverage,
        delta: "Distribution",
        helper: "Share of Chennai locations",
      },
      {
        label: "Top Region",
        value: regionCounts[0]?.[0] ?? "N/A",
        delta: `${regionCounts[0]?.[1] ?? 0} units`,
        helper: "Highest concentration today",
      },
    ];
  }

  return [
    {
      label: "Total Franchises",
      value: franchises.length.toString(),
      delta: "+100%",
      helper: "Active locations in network",
    },
    {
      label: "Regions Covered",
      value: regionCounts.length.toString(),
      delta: "Stable",
      helper: "Distinct operational zones",
    },
    {
      label: "Chennai Coverage",
      value: chennaiCoverage,
      delta: "Leader",
      helper: "Share of total outlets",
    },
    {
      label: "Top Region",
      value: regionCounts[0]?.[0] ?? "N/A",
      delta: `${regionCounts[0]?.[1] ?? 0} units`,
      helper: "Highest concentration today",
    },
  ];
};
