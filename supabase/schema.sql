-- Kyochi Supabase Schema (public)

create table if not exists public.franchises (
  id text primary key,
  name text not null,
  city text not null,
  region text not null,
  address text not null,
  phone text not null,
  whatsapp text not null
);

create table if not exists public.patients (
  id text primary key,
  franchise_id text not null references public.franchises(id) on update cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  dob date not null,
  wellness_score numeric not null default 0,
  status text not null check (status in ('active', 'inactive'))
);

create table if not exists public.therapists (
  id text primary key,
  franchise_id text not null references public.franchises(id) on update cascade,
  full_name text not null,
  email text not null,
  specialty text not null,
  license_no text not null,
  status text not null
);

create table if not exists public.therapies (
  id text primary key,
  name text not null,
  category text not null,
  duration_min integer not null,
  session_count integer not null,
  price numeric not null default 0,
  status text not null,
  description text null,
  feedback_schema jsonb null
);

create table if not exists public.appointments (
  id text primary key,
  franchise_id text not null references public.franchises(id) on update cascade,
  patient_id text not null references public.patients(id) on update cascade,
  therapist_id text not null references public.therapists(id) on update cascade,
  therapy_id text not null references public.therapies(id) on update cascade,
  starts_at timestamptz not null,
  status text not null check (status in ('waiting', 'scheduled', 'in_progress', 'completed', 'declined', 'cancelled'))
);

create table if not exists public.billing (
  id text primary key,
  appointment_id text not null unique references public.appointments(id) on update cascade,
  franchise_id text not null references public.franchises(id) on update cascade,
  patient_id text not null references public.patients(id) on update cascade,
  amount numeric not null,
  currency text not null default 'USD',
  due_date date null,
  status text not null default 'unpaid' check (status in ('unpaid', 'paid'))
);

create table if not exists public.feedback (
  id text primary key,
  appointment_id text not null unique references public.appointments(id) on update cascade,
  franchise_id text not null references public.franchises(id) on update cascade,
  patient_id text not null references public.patients(id) on update cascade,
  therapist_id text not null references public.therapists(id) on update cascade,
  invoice_id text null references public.billing(id) on update cascade,
  session_date timestamptz null,
  rating integer null check (rating between 1 and 5),
  status text not null check (status in ('pending', 'completed')),
  notes jsonb null,
  feedback_payload jsonb null,
  attachment_path text null,
  submitted_at timestamptz null
);

create table if not exists public.app_users (
  id text primary key,
  auth_user_id uuid null references auth.users(id) on delete set null,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'franchisee', 'therapist', 'patient')),
  status text not null,
  franchise_id text null references public.franchises(id) on update cascade,
  therapist_id text null references public.therapists(id) on update cascade,
  patient_id text null references public.patients(id) on update cascade
);

create table if not exists public.notifications (
  id text primary key,
  title text not null,
  message text not null,
  time text not null,
  is_read boolean not null default false
);

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  requester_user_id text not null references public.app_users(id) on update cascade,
  requester_name text not null,
  requester_email text not null,
  requested_role text not null check (requested_role in ('therapist', 'franchisee')),
  requested_franchise_id text null references public.franchises(id) on update cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  message text not null default '',
  assigned_role text null check (assigned_role in ('admin', 'franchisee', 'therapist', 'patient')),
  assigned_therapist_id text null references public.therapists(id) on update cascade,
  decided_by_user_id text null references public.app_users(id) on update cascade,
  decided_at timestamptz null,
  created_at timestamptz not null default now()
);

create index if not exists idx_patients_franchise_id on public.patients(franchise_id);
create index if not exists idx_therapists_franchise_id on public.therapists(franchise_id);
create index if not exists idx_appointments_franchise_id on public.appointments(franchise_id);
create index if not exists idx_appointments_patient_id on public.appointments(patient_id);
create index if not exists idx_appointments_therapist_id on public.appointments(therapist_id);
create index if not exists idx_billing_patient_id on public.billing(patient_id);
create index if not exists idx_feedback_patient_id on public.feedback(patient_id);
create index if not exists idx_feedback_therapist_id on public.feedback(therapist_id);
create unique index if not exists idx_app_users_auth_user_id on public.app_users(auth_user_id) where auth_user_id is not null;
create index if not exists idx_app_users_patient_id on public.app_users(patient_id);
create index if not exists idx_access_requests_status on public.access_requests(status);
create index if not exists idx_access_requests_requester on public.access_requests(requester_user_id);

create or replace function public.enforce_billing_status_only_updates()
returns trigger
language plpgsql
as $$
begin
  if (
    new.id is distinct from old.id
    or new.appointment_id is distinct from old.appointment_id
    or new.patient_id is distinct from old.patient_id
    or new.franchise_id is distinct from old.franchise_id
    or new.amount is distinct from old.amount
    or new.currency is distinct from old.currency
    or new.due_date is distinct from old.due_date
  ) then
    raise exception 'Billing rows are immutable. Only status can be updated.';
  end if;

  if old.status = 'paid' and new.status <> 'paid' then
    raise exception 'Paid invoices cannot be reverted.';
  end if;

  if new.status not in ('unpaid', 'paid') then
    raise exception 'Invalid billing status.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_billing_status_only_updates on public.billing;
create trigger trg_enforce_billing_status_only_updates
before update on public.billing
for each row
execute function public.enforce_billing_status_only_updates();
