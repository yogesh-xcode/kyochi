begin;

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
