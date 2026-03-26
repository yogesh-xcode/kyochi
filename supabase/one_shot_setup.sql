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
  description text not null,
  feedback_schema jsonb null
);

create table if not exists public.appointments (
  id text primary key,
  franchise_id text not null references public.franchises(id) on update cascade,
  patient_id text not null references public.patients(id) on update cascade,
  therapist_id text not null references public.therapists(id) on update cascade,
  therapy_id text not null references public.therapies(id) on update cascade,
  starts_at timestamptz not null,
  status text not null check (status in ('waiting', 'scheduled', 'in_progress', 'completed', 'declined'))
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
  submitted_at timestamptz null
);

create table if not exists public.app_users (
  id text primary key,
  auth_user_id uuid null references auth.users(id) on delete set null,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'franchisee', 'therapist')),
  status text not null,
  franchise_id text null references public.franchises(id) on update cascade,
  therapist_id text null references public.therapists(id) on update cascade
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
  assigned_role text null check (assigned_role in ('admin', 'franchisee', 'therapist')),
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


-- ===========================
-- RLS
-- ===========================

-- Kyochi RBAC + RLS (single canonical script)
-- Run after schema.sql + seed.sql

begin;

drop table if exists public.app_current_user;

alter table public.app_users
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

create unique index if not exists idx_app_users_auth_user_id
  on public.app_users(auth_user_id)
  where auth_user_id is not null;

create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select au.role
  from public.app_users au
  where au.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_app_user_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select au.id
  from public.app_users au
  where au.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_app_franchise_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select au.franchise_id
  from public.app_users au
  where au.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_app_therapist_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select au.therapist_id
  from public.app_users au
  where au.auth_user_id = auth.uid()
  limit 1
$$;

alter table public.franchises enable row level security;
alter table public.patients enable row level security;
alter table public.therapists enable row level security;
alter table public.therapies enable row level security;
alter table public.appointments enable row level security;
alter table public.billing enable row level security;
alter table public.feedback enable row level security;
alter table public.app_users enable row level security;
alter table public.notifications enable row level security;
alter table public.access_requests enable row level security;

drop policy if exists franchises_select_policy on public.franchises;
create policy franchises_select_policy on public.franchises
for select
using (
  public.current_app_role() = 'admin'
  or id = public.current_app_franchise_id()
  or exists (
    select 1
    from public.appointments a
    where a.franchise_id = franchises.id
      and a.therapist_id = public.current_app_therapist_id()
  )
);

drop policy if exists patients_select_policy on public.patients;
create policy patients_select_policy on public.patients
for select
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() in ('franchisee', 'therapist')
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists patients_insert_policy on public.patients;
create policy patients_insert_policy on public.patients
for insert
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() in ('franchisee', 'therapist')
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists patients_update_policy on public.patients;
create policy patients_update_policy on public.patients
for update
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and franchise_id = public.current_app_franchise_id()
    and exists (
      select 1
      from public.appointments a
      where a.patient_id = patients.id
        and a.therapist_id = public.current_app_therapist_id()
        and a.franchise_id = public.current_app_franchise_id()
    )
  )
)
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and franchise_id = public.current_app_franchise_id()
    and exists (
      select 1
      from public.appointments a
      where a.patient_id = patients.id
        and a.therapist_id = public.current_app_therapist_id()
        and a.franchise_id = public.current_app_franchise_id()
    )
  )
);

drop policy if exists patients_delete_policy on public.patients;
create policy patients_delete_policy on public.patients
for delete
using (
  public.current_app_role() = 'admin'
);

drop policy if exists therapists_select_policy on public.therapists;
create policy therapists_select_policy on public.therapists
for select
using (
  public.current_app_role() = 'admin'
  or franchise_id = public.current_app_franchise_id()
  or id = public.current_app_therapist_id()
);

drop policy if exists therapies_select_policy on public.therapies;
create policy therapies_select_policy on public.therapies
for select
using (
  public.current_app_role() in ('admin', 'franchisee', 'therapist')
);

drop policy if exists appointments_select_policy on public.appointments;
create policy appointments_select_policy on public.appointments
for select
using (
  public.current_app_role() = 'admin'
  or franchise_id = public.current_app_franchise_id()
  or therapist_id = public.current_app_therapist_id()
);

drop policy if exists appointments_insert_policy on public.appointments;
create policy appointments_insert_policy on public.appointments
for insert
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists appointments_update_policy on public.appointments;
create policy appointments_update_policy on public.appointments
for update
using (
  (
    public.current_app_role() = 'admin'
    or (
      public.current_app_role() = 'franchisee'
      and franchise_id = public.current_app_franchise_id()
    )
    or (
      public.current_app_role() = 'therapist'
      and therapist_id = public.current_app_therapist_id()
      and franchise_id = public.current_app_franchise_id()
    )
  )
  and status <> 'completed'
)
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists appointments_delete_policy on public.appointments;
create policy appointments_delete_policy on public.appointments
for delete
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists billing_select_policy on public.billing;
create policy billing_select_policy on public.billing
for select
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists billing_insert_policy on public.billing;
create policy billing_insert_policy on public.billing
for insert
with check (
  auth.role() = 'service_role'
  or exists (
    select 1
    from public.app_users u
    join public.appointments a on a.id = billing.appointment_id
    where u.auth_user_id = auth.uid()
      and a.franchise_id = billing.franchise_id
      and a.patient_id = billing.patient_id
      and (
        u.role = 'admin'
        or (
          u.role = 'franchisee'
          and u.franchise_id = a.franchise_id
        )
        or (
          u.role = 'therapist'
          and u.therapist_id = a.therapist_id
          and u.franchise_id = a.franchise_id
        )
      )
  )
);

drop policy if exists billing_update_policy on public.billing;
create policy billing_update_policy on public.billing
for update
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
)
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists billing_delete_policy on public.billing;

drop policy if exists feedback_select_policy on public.feedback;
create policy feedback_select_policy on public.feedback
for select
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists feedback_insert_policy on public.feedback;
create policy feedback_insert_policy on public.feedback
for insert
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
    and status = 'pending'
    and submitted_at is null
    and rating is null
    and notes is null
  )
);

drop policy if exists feedback_update_policy on public.feedback;
create policy feedback_update_policy on public.feedback
for update
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
    and (
      submitted_at is null
      or submitted_at > now() - interval '30 minutes'
    )
  )
)
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
    and (
      submitted_at is null
      or submitted_at > now() - interval '30 minutes'
    )
  )
);

drop policy if exists feedback_delete_policy on public.feedback;

drop policy if exists app_users_select_policy on public.app_users;
create policy app_users_select_policy on public.app_users
for select
using (
  public.current_app_role() = 'admin'
  or auth_user_id = auth.uid()
  or id = public.current_app_user_id()
);

drop policy if exists notifications_select_policy on public.notifications;
create policy notifications_select_policy on public.notifications
for select
using (
  public.current_app_role() in ('admin', 'franchisee', 'therapist')
);

drop policy if exists access_requests_select_policy on public.access_requests;
create policy access_requests_select_policy on public.access_requests
for select
using (
  public.current_app_role() = 'admin'
  or requester_user_id = public.current_app_user_id()
);

drop policy if exists access_requests_insert_policy on public.access_requests;
create policy access_requests_insert_policy on public.access_requests
for insert
with check (
  requester_user_id = public.current_app_user_id()
  and status = 'pending'
);

drop policy if exists access_requests_update_policy on public.access_requests;
create policy access_requests_update_policy on public.access_requests
for update
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

drop policy if exists app_users_update_admin_policy on public.app_users;
create policy app_users_update_admin_policy on public.app_users
for update
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

drop policy if exists app_users_update_self_policy on public.app_users;
create policy app_users_update_self_policy on public.app_users
for update
using (auth_user_id = auth.uid())
with check (
  auth_user_id = auth.uid()
  and role = public.current_app_role()
  and coalesce(franchise_id, '') = coalesce(public.current_app_franchise_id(), '')
  and coalesce(therapist_id, '') = coalesce(public.current_app_therapist_id(), '')
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  derived_name text;
begin
  derived_name :=
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(new.email, '@', 1)
    );

  insert into public.app_users (
    id,
    auth_user_id,
    full_name,
    email,
    role,
    status,
    franchise_id,
    therapist_id
  )
  values (
    new.id::text,
    new.id,
    derived_name,
    new.email,
    'therapist',
    'active',
    null,
    null
  )
  on conflict (email) do update
  set auth_user_id = excluded.auth_user_id,
      full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

commit;


-- ===========================
-- Seed
-- ===========================

begin;

insert into public.franchises (id, name, city, region, address, phone, whatsapp) values
('FR01', 'Kyochi Anna Nagar', 'Chennai', 'South', '12 Wellness Street, Anna Nagar', '+91-9000000001', '+91-9000000001')
on conflict (id) do update set
name = excluded.name,
city = excluded.city,
region = excluded.region,
address = excluded.address,
phone = excluded.phone,
whatsapp = excluded.whatsapp;

insert into public.therapies (id, name, category, duration_min, session_count, price, status, description) values
('THP01', 'Chronic Pain Reflexology', 'Reflexology', 45, 1, 1500, 'active', 'Targeted reflexology session for chronic pain management.')
on conflict (id) do update set
name = excluded.name,
category = excluded.category,
duration_min = excluded.duration_min,
session_count = excluded.session_count,
price = excluded.price,
status = excluded.status,
description = excluded.description;

insert into public.therapists (id, franchise_id, full_name, email, specialty, license_no, status) values
('THR01', 'FR01', 'Dr. Aris Menon', 'aris@kyochi.example', 'Reflexology', 'TN-THER-001', 'active')
on conflict (id) do update set
franchise_id = excluded.franchise_id,
full_name = excluded.full_name,
email = excluded.email,
specialty = excluded.specialty,
license_no = excluded.license_no,
status = excluded.status;

insert into public.patients (id, franchise_id, full_name, email, phone, dob, wellness_score, status) values
('PAT01', 'FR01', 'Dhinesh Kumar', 'dhinesh@kyochi.example', '+91-9000000101', '1993-05-12', 0, 'active')
on conflict (id) do update set
franchise_id = excluded.franchise_id,
full_name = excluded.full_name,
email = excluded.email,
phone = excluded.phone,
dob = excluded.dob,
wellness_score = excluded.wellness_score,
status = excluded.status;

insert into public.appointments (id, franchise_id, patient_id, therapist_id, therapy_id, starts_at, status) values
('AP01', 'FR01', 'PAT01', 'THR01', 'THP01', '2026-03-21T09:00:00+05:30', 'waiting')
on conflict (id) do update set
franchise_id = excluded.franchise_id,
patient_id = excluded.patient_id,
therapist_id = excluded.therapist_id,
therapy_id = excluded.therapy_id,
starts_at = excluded.starts_at,
status = excluded.status;

insert into public.billing (id, appointment_id, franchise_id, patient_id, amount, currency, due_date, status) values
('INV01', 'AP01', 'FR01', 'PAT01', 1500, 'USD', '2026-04-20', 'unpaid')
on conflict (id) do update set
appointment_id = excluded.appointment_id,
franchise_id = excluded.franchise_id,
patient_id = excluded.patient_id,
amount = excluded.amount,
currency = excluded.currency,
due_date = excluded.due_date,
status = excluded.status;

insert into public.feedback (id, appointment_id, franchise_id, patient_id, therapist_id, invoice_id, session_date, rating, status, notes, submitted_at) values
('FDBK01', 'AP01', 'FR01', 'PAT01', 'THR01', null, '2026-03-21T09:00:00+05:30', null, 'pending', null, null)
on conflict (id) do update set
appointment_id = excluded.appointment_id,
franchise_id = excluded.franchise_id,
patient_id = excluded.patient_id,
therapist_id = excluded.therapist_id,
invoice_id = excluded.invoice_id,
session_date = excluded.session_date,
rating = excluded.rating,
status = excluded.status,
notes = excluded.notes,
submitted_at = excluded.submitted_at;

insert into public.app_users (id, full_name, email, role, status, franchise_id, therapist_id) values
('USR01', 'Alex Kyochi', 'alex@kyochi.example', 'admin', 'active', null, null),
('USR02', 'Nila Franchise', 'nila.franchise@kyochi.example', 'franchisee', 'active', 'FR01', null),
('USR03', 'Dr. Aris Menon', 'aris@kyochi.example', 'therapist', 'active', 'FR01', 'THR01')
on conflict (id) do update set
full_name = excluded.full_name,
email = excluded.email,
role = excluded.role,
status = excluded.status,
franchise_id = excluded.franchise_id,
therapist_id = excluded.therapist_id;

insert into public.notifications (id, title, message, time, is_read) values
('NTF01', 'Welcome', 'Kyochi system is ready.', 'just now', false)
on conflict (id) do update set
title = excluded.title,
message = excluded.message,
time = excluded.time,
is_read = excluded.is_read;

commit;


-- ===========================
-- Post-setup guard: prevent non-scheduled appointment detail edits
-- ===========================

begin;

create or replace function public.prevent_non_scheduled_appointment_detail_edits()
returns trigger
language plpgsql
as $$
begin
  if (
    coalesce(new.patient_id, '') <> coalesce(old.patient_id, '')
    or coalesce(new.therapy_id, '') <> coalesce(old.therapy_id, '')
    or coalesce(new.therapist_id, '') <> coalesce(old.therapist_id, '')
    or coalesce(new.franchise_id, '') <> coalesce(old.franchise_id, '')
    or new.starts_at is distinct from old.starts_at
  ) and old.status <> 'scheduled' then
    raise exception 'Only Scheduled appointments can be edited.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_non_scheduled_appointment_detail_edits on public.appointments;

create trigger trg_prevent_non_scheduled_appointment_detail_edits
before update on public.appointments
for each row
execute function public.prevent_non_scheduled_appointment_detail_edits();

commit;


-- Patient role rollout patch (2026-03-22)

begin;

alter table public.app_users
  add column if not exists patient_id text null references public.patients(id) on update cascade;

alter table public.app_users
  drop constraint if exists app_users_role_check;
alter table public.app_users
  add constraint app_users_role_check check (role in ('admin', 'franchisee', 'therapist', 'patient'));

alter table public.access_requests
  drop constraint if exists access_requests_assigned_role_check;
alter table public.access_requests
  add constraint access_requests_assigned_role_check
  check (assigned_role is null or assigned_role in ('admin', 'franchisee', 'therapist', 'patient'));

create index if not exists idx_app_users_patient_id on public.app_users(patient_id);

create or replace function public.current_app_patient_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select au.patient_id
  from public.app_users au
  where au.auth_user_id = auth.uid()
  limit 1
$$;

create or replace view public.therapists_patient_view
with (security_invoker = true)
as
select
  t.id,
  t.franchise_id,
  t.full_name,
  t.specialty,
  t.status
from public.therapists t
where t.status = 'active';

grant select on public.therapists_patient_view to authenticated;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  derived_name text;
  matched_patient_id text;
  matched_franchise_id text;
begin
  derived_name :=
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(new.email, '@', 1)
    );

  select p.id, p.franchise_id
  into matched_patient_id, matched_franchise_id
  from public.patients p
  where lower(p.email) = lower(new.email)
  limit 1;

  insert into public.app_users (
    id,
    auth_user_id,
    full_name,
    email,
    role,
    status,
    franchise_id,
    therapist_id,
    patient_id
  )
  values (
    new.id::text,
    new.id,
    derived_name,
    new.email,
    'patient',
    'active',
    matched_franchise_id,
    null,
    matched_patient_id
  )
  on conflict (email) do update
  set auth_user_id = excluded.auth_user_id,
      full_name = excluded.full_name,
      role = 'patient',
      patient_id = coalesce(public.app_users.patient_id, excluded.patient_id),
      franchise_id = coalesce(public.app_users.franchise_id, excluded.franchise_id);

  return new;
end;
$$;

drop policy if exists franchises_select_policy on public.franchises;
create policy franchises_select_policy on public.franchises
for select
using (
  public.current_app_role() = 'admin'
  or id = public.current_app_franchise_id()
  or (
    public.current_app_role() = 'therapist'
    and exists (
      select 1
      from public.appointments a
      where a.franchise_id = franchises.id
        and a.therapist_id = public.current_app_therapist_id()
    )
  )
);

drop policy if exists patients_select_policy on public.patients;
create policy patients_select_policy on public.patients
for select
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() in ('franchisee', 'therapist')
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'patient'
    and id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists patients_update_policy on public.patients;
create policy patients_update_policy on public.patients
for update
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and franchise_id = public.current_app_franchise_id()
    and exists (
      select 1
      from public.appointments a
      where a.patient_id = patients.id
        and a.therapist_id = public.current_app_therapist_id()
        and a.franchise_id = public.current_app_franchise_id()
    )
  )
  or (
    public.current_app_role() = 'patient'
    and id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
  )
)
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and franchise_id = public.current_app_franchise_id()
    and exists (
      select 1
      from public.appointments a
      where a.patient_id = patients.id
        and a.therapist_id = public.current_app_therapist_id()
        and a.franchise_id = public.current_app_franchise_id()
    )
  )
  or (
    public.current_app_role() = 'patient'
    and id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists therapists_select_policy on public.therapists;
create policy therapists_select_policy on public.therapists
for select
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() in ('franchisee', 'therapist')
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'patient'
    and status = 'active'
    and franchise_id = public.current_app_franchise_id()
  )
  or id = public.current_app_therapist_id()
);

drop policy if exists therapies_select_policy on public.therapies;
create policy therapies_select_policy on public.therapies
for select
using (
  public.current_app_role() in ('admin', 'franchisee', 'therapist', 'patient')
);

drop policy if exists appointments_select_policy on public.appointments;
create policy appointments_select_policy on public.appointments
for select
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'patient'
    and patient_id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists appointments_insert_policy on public.appointments;
create policy appointments_insert_policy on public.appointments
for insert
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'patient'
    and patient_id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
    and status = 'waiting'
  )
);

drop policy if exists appointments_update_policy on public.appointments;
create policy appointments_update_policy on public.appointments
for update
using (
  (
    public.current_app_role() = 'admin'
    or (
      public.current_app_role() = 'franchisee'
      and franchise_id = public.current_app_franchise_id()
    )
    or (
      public.current_app_role() = 'therapist'
      and therapist_id = public.current_app_therapist_id()
      and franchise_id = public.current_app_franchise_id()
    )
    or (
      public.current_app_role() = 'patient'
      and patient_id = public.current_app_patient_id()
      and franchise_id = public.current_app_franchise_id()
      and status in ('waiting', 'scheduled')
    )
  )
  and status <> 'completed'
)
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
    and status <> 'cancelled'
  )
  or (
    public.current_app_role() = 'patient'
    and patient_id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
    and status = 'waiting'
  )
);

drop policy if exists billing_select_policy on public.billing;
create policy billing_select_policy on public.billing
for select
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'patient'
    and patient_id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists feedback_select_policy on public.feedback;
create policy feedback_select_policy on public.feedback
for select
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'patient'
    and patient_id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
  )
);

drop policy if exists feedback_insert_policy on public.feedback;
create policy feedback_insert_policy on public.feedback
for insert
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
    and status = 'pending'
    and submitted_at is null
    and rating is null
    and notes is null
  )
  or (
    public.current_app_role() = 'patient'
    and status = 'pending'
    and patient_id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
    and exists (
      select 1
      from public.appointments a
      where a.id = feedback.appointment_id
        and a.patient_id = public.current_app_patient_id()
        and a.therapist_id = feedback.therapist_id
        and a.franchise_id = feedback.franchise_id
    )
    and (
      feedback.invoice_id is null
      or exists (
        select 1
        from public.billing b
        where b.id = feedback.invoice_id
          and b.appointment_id = feedback.appointment_id
          and b.patient_id = public.current_app_patient_id()
      )
    )
  )
);

drop policy if exists feedback_update_policy on public.feedback;
create policy feedback_update_policy on public.feedback
for update
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
    and (
      submitted_at is null
      or submitted_at > now() - interval '30 minutes'
    )
  )
  or (
    public.current_app_role() = 'patient'
    and patient_id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
    and status = 'pending'
    and exists (
      select 1
      from public.appointments a
      where a.id = feedback.appointment_id
        and a.patient_id = public.current_app_patient_id()
        and a.therapist_id = feedback.therapist_id
        and a.franchise_id = feedback.franchise_id
    )
    and (
      feedback.invoice_id is null
      or exists (
        select 1
        from public.billing b
        where b.id = feedback.invoice_id
          and b.appointment_id = feedback.appointment_id
          and b.patient_id = public.current_app_patient_id()
      )
    )
  )
)
with check (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'franchisee'
    and franchise_id = public.current_app_franchise_id()
  )
  or (
    public.current_app_role() = 'therapist'
    and therapist_id = public.current_app_therapist_id()
    and franchise_id = public.current_app_franchise_id()
    and (
      submitted_at is null
      or submitted_at > now() - interval '30 minutes'
    )
  )
  or (
    public.current_app_role() = 'patient'
    and patient_id = public.current_app_patient_id()
    and franchise_id = public.current_app_franchise_id()
    and status = 'pending'
    and exists (
      select 1
      from public.appointments a
      where a.id = feedback.appointment_id
        and a.patient_id = public.current_app_patient_id()
        and a.therapist_id = feedback.therapist_id
        and a.franchise_id = feedback.franchise_id
    )
    and (
      feedback.invoice_id is null
      or exists (
        select 1
        from public.billing b
        where b.id = feedback.invoice_id
          and b.appointment_id = feedback.appointment_id
          and b.patient_id = public.current_app_patient_id()
      )
    )
  )
);

drop policy if exists notifications_select_policy on public.notifications;
create policy notifications_select_policy on public.notifications
for select
using (
  public.current_app_role() in ('admin', 'franchisee', 'therapist', 'patient')
);

drop policy if exists app_users_update_self_policy on public.app_users;
create policy app_users_update_self_policy on public.app_users
for update
using (auth_user_id = auth.uid())
with check (
  auth_user_id = auth.uid()
  and role = public.current_app_role()
  and coalesce(franchise_id, '') = coalesce(public.current_app_franchise_id(), '')
  and coalesce(therapist_id, '') = coalesce(public.current_app_therapist_id(), '')
  and coalesce(patient_id, '') = coalesce(public.current_app_patient_id(), '')
);

create or replace function public.prevent_non_scheduled_appointment_detail_edits()
returns trigger
language plpgsql
as $$
begin
  if public.current_app_role() = 'patient' then
    if coalesce(old.patient_id, '') <> coalesce(public.current_app_patient_id(), '') then
      raise exception 'Patients can edit only their own appointments.';
    end if;

    if old.status not in ('waiting', 'scheduled') then
      raise exception 'Only waiting or scheduled appointments can be rescheduled by patients.';
    end if;

    if (
      coalesce(new.patient_id, '') <> coalesce(old.patient_id, '')
      or coalesce(new.therapy_id, '') <> coalesce(old.therapy_id, '')
      or coalesce(new.therapist_id, '') <> coalesce(old.therapist_id, '')
      or coalesce(new.franchise_id, '') <> coalesce(old.franchise_id, '')
    ) then
      raise exception 'Patients can change only appointment time.';
    end if;

    if new.status <> 'waiting' then
      raise exception 'Patient reschedule must set status to waiting.';
    end if;

    return new;
  end if;

  if (
    coalesce(new.patient_id, '') <> coalesce(old.patient_id, '')
    or coalesce(new.therapy_id, '') <> coalesce(old.therapy_id, '')
    or coalesce(new.therapist_id, '') <> coalesce(old.therapist_id, '')
    or coalesce(new.franchise_id, '') <> coalesce(old.franchise_id, '')
    or new.starts_at is distinct from old.starts_at
  ) and old.status <> 'scheduled' then
    raise exception 'Only Scheduled appointments can be edited.';
  end if;

  return new;
end;
$$;

commit;
