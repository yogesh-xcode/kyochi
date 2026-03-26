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
