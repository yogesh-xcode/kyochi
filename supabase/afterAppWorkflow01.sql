-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.access_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  requester_user_id text NOT NULL,
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  requested_role text NOT NULL CHECK (requested_role = ANY (ARRAY['therapist'::text, 'franchisee'::text])),
  requested_franchise_id text,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  message text NOT NULL DEFAULT ''::text,
  assigned_role text CHECK (assigned_role = ANY (ARRAY['admin'::text, 'franchisee'::text, 'therapist'::text])),
  assigned_therapist_id text,
  decided_by_user_id text,
  decided_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT access_requests_pkey PRIMARY KEY (id),
  CONSTRAINT access_requests_requester_user_id_fkey FOREIGN KEY (requester_user_id) REFERENCES public.app_users(id),
  CONSTRAINT access_requests_requested_franchise_id_fkey FOREIGN KEY (requested_franchise_id) REFERENCES public.franchises(id),
  CONSTRAINT access_requests_assigned_therapist_id_fkey FOREIGN KEY (assigned_therapist_id) REFERENCES public.therapists(id),
  CONSTRAINT access_requests_decided_by_user_id_fkey FOREIGN KEY (decided_by_user_id) REFERENCES public.app_users(id)
);
CREATE TABLE public.app_users (
  id text NOT NULL,
  auth_user_id uuid,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role = ANY (ARRAY['admin'::text, 'franchisee'::text, 'therapist'::text])),
  status text NOT NULL,
  franchise_id text,
  therapist_id text,
  CONSTRAINT app_users_pkey PRIMARY KEY (id),
  CONSTRAINT app_users_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id),
  CONSTRAINT app_users_franchise_id_fkey FOREIGN KEY (franchise_id) REFERENCES public.franchises(id),
  CONSTRAINT app_users_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.therapists(id)
);
CREATE TABLE public.appointments (
  id text NOT NULL,
  franchise_id text NOT NULL,
  patient_id text NOT NULL,
  therapist_id text NOT NULL,
  therapy_id text NOT NULL,
  starts_at timestamp with time zone NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['waiting'::text, 'in_progress'::text, 'completed'::text, 'declined'::text])),
  CONSTRAINT appointments_pkey PRIMARY KEY (id),
  CONSTRAINT appointments_franchise_id_fkey FOREIGN KEY (franchise_id) REFERENCES public.franchises(id),
  CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
  CONSTRAINT appointments_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.therapists(id),
  CONSTRAINT appointments_therapy_id_fkey FOREIGN KEY (therapy_id) REFERENCES public.therapies(id)
);
CREATE TABLE public.billing (
  id text NOT NULL,
  appointment_id text NOT NULL UNIQUE,
  patient_id text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL,
  due_date date NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['due'::text, 'paid'::text])),
  franchise_id text NOT NULL,
  CONSTRAINT billing_pkey PRIMARY KEY (id),
  CONSTRAINT billing_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id),
  CONSTRAINT billing_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
  CONSTRAINT billing_franchise_id_fkey FOREIGN KEY (franchise_id) REFERENCES public.franchises(id)
);
CREATE TABLE public.feedback (
  id text NOT NULL,
  appointment_id text NOT NULL UNIQUE,
  patient_id text NOT NULL,
  therapist_id text NOT NULL,
  session_date timestamp with time zone,
  rating text NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text])),
  notes jsonb,
  feedback_payload jsonb,
  franchise_id text NOT NULL,
  CONSTRAINT feedback_pkey PRIMARY KEY (id),
  CONSTRAINT feedback_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id),
  CONSTRAINT feedback_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
  CONSTRAINT feedback_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.therapists(id),
  CONSTRAINT feedback_franchise_id_fkey FOREIGN KEY (franchise_id) REFERENCES public.franchises(id)
);
CREATE TABLE public.franchises (
  id text NOT NULL,
  name text NOT NULL,
  city text NOT NULL,
  region text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  whatsapp text NOT NULL,
  CONSTRAINT franchises_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  time text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.patients (
  id text NOT NULL,
  franchise_id text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  dob date NOT NULL,
  wellness_score numeric NOT NULL,
  status text NOT NULL,
  CONSTRAINT patients_pkey PRIMARY KEY (id),
  CONSTRAINT patients_franchise_id_fkey FOREIGN KEY (franchise_id) REFERENCES public.franchises(id)
);
CREATE TABLE public.therapies (
  id text NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  duration_min integer NOT NULL,
  session_count integer NOT NULL,
  status text NOT NULL,
  description text NOT NULL,
  feedback_schema jsonb,
  price numeric NOT NULL DEFAULT 0,
  CONSTRAINT therapies_pkey PRIMARY KEY (id)
);
CREATE TABLE public.therapists (
  id text NOT NULL,
  franchise_id text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  specialty text NOT NULL,
  license_no text NOT NULL,
  status text NOT NULL,
  CONSTRAINT therapists_pkey PRIMARY KEY (id),
  CONSTRAINT therapists_franchise_id_fkey FOREIGN KEY (franchise_id) REFERENCES public.franchises(id)
);
