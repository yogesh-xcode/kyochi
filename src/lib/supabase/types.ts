export type FranchiseRow = {
  id: string;
  name: string;
  city: string;
  region: string;
  address: string;
  phone: string;
  whatsapp: string;
};

export type PatientRow = {
  id: string;
  franchise_id: string;
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  wellness_score: number;
  status: string;
};

export type TherapistRow = {
  id: string;
  franchise_id: string;
  full_name: string;
  email?: string;
  specialty: string;
  license_no?: string;
  status: string;
};

export type TherapyRow = {
  id: string;
  name: string;
  category: string;
  duration_min: number;
  session_count: number;
  price: number;
  status: string;
  description: string | null;
  feedback_schema?: Record<string, string> | null;
};

export type AppointmentRow = {
  id: string;
  franchise_id: string;
  patient_id: string;
  therapist_id: string;
  therapy_id: string;
  starts_at: string;
  status: string;
};

export type BillingRow = {
  id: string;
  appointment_id: string;
  franchise_id: string;
  patient_id: string;
  amount: number;
  currency: string;
  due_date: string | null;
  status: string;
};

export type FeedbackRow = {
  id: string;
  appointment_id: string;
  franchise_id: string;
  patient_id: string;
  therapist_id: string;
  invoice_id: string | null;
  session_date: string | null;
  rating: number | null;
  status: string;
  notes: unknown | null;
  feedback_payload?: Record<string, unknown> | null;
  attachment_path: string | null;
  submitted_at: string | null;
};

export type AppUserRow = {
  id: string;
  auth_user_id?: string | null;
  full_name: string;
  email: string;
  role: "admin" | "franchisee" | "therapist" | "patient";
  status: string;
  franchise_id: string | null;
  therapist_id: string | null;
  patient_id: string | null;
};

export type AppCurrentUserRow = {
  user_id: string;
  role: "admin" | "franchisee" | "therapist" | "patient";
};

export type NotificationRow = {
  id: string;
  user_id?: string | null; // Added for RLS
  title: string;
  message: string;
  time: string;
  is_read: boolean;
};

export type BootstrapData = {
  franchises: FranchiseRow[];
  patients: PatientRow[];
  therapists: TherapistRow[];
  therapies: TherapyRow[];
  appointments: AppointmentRow[];
  billing: BillingRow[];
  feedback: FeedbackRow[];
  users: AppUserRow[];
  current_user: AppCurrentUserRow | null;
  notifications: NotificationRow[];
  source: "supabase";
};
