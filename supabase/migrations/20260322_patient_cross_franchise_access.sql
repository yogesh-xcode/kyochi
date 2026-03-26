begin;

drop policy if exists franchises_select_policy on public.franchises;
create policy franchises_select_policy on public.franchises
for select
using (
  public.current_app_role() = 'admin'
  or public.current_app_role() = 'patient'
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
  )
  or id = public.current_app_therapist_id()
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
    and status = 'completed'
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

commit;
