begin;

-- Limit patient franchise visibility to relevant franchises only:
-- current assigned franchise + franchises where the patient has appointments.
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
  or (
    public.current_app_role() = 'patient'
    and exists (
      select 1
      from public.appointments a
      where a.franchise_id = franchises.id
        and a.patient_id = public.current_app_patient_id()
    )
  )
);

-- Limit patient therapist visibility to relevant franchises only.
drop policy if exists therapists_select_policy on public.therapists;
create policy therapists_select_policy on public.therapists
for select
using (
  public.current_app_role() = 'admin'
  or (
    public.current_app_role() in ('franchisee', 'therapist')
    and franchise_id = public.current_app_franchise_id()
  )
  or id = public.current_app_therapist_id()
  or (
    public.current_app_role() = 'patient'
    and status = 'active'
    and (
      franchise_id = public.current_app_franchise_id()
      or exists (
        select 1
        from public.appointments a
        where a.franchise_id = therapists.franchise_id
          and a.patient_id = public.current_app_patient_id()
      )
    )
  )
);

commit;
