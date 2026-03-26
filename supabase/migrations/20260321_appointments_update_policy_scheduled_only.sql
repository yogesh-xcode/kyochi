begin;

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
      and status = 'scheduled'
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
  )
);

commit;
