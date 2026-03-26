begin;

alter table public.patients
  add column if not exists dob date;

alter table public.patients
  add column if not exists wellness_score numeric not null default 0;

alter table public.patients
  alter column wellness_score set default 0;

alter table public.patients
  add column if not exists status text not null default 'active';

update public.patients
set wellness_score = 0
where wellness_score is null;

update public.patients
set status = 'active'
where status is null
   or status not in ('active', 'inactive');

alter table public.patients
  alter column dob set not null,
  alter column status set not null,
  alter column wellness_score set not null;

alter table public.patients
  drop constraint if exists patients_status_check;

alter table public.patients
  add constraint patients_status_check
  check (status in ('active', 'inactive'));

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

commit;
