begin;

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

commit;
