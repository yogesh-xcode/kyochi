begin;

drop policy if exists therapies_select_policy on public.therapies;
create policy therapies_select_policy on public.therapies
for select
using (
  public.current_app_role() in ('admin', 'franchisee', 'therapist')
);

drop policy if exists therapies_insert_policy on public.therapies;
create policy therapies_insert_policy on public.therapies
for insert
with check (
  public.current_app_role() = 'admin'
);

drop policy if exists therapies_update_policy on public.therapies;
create policy therapies_update_policy on public.therapies
for update
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

drop policy if exists therapies_delete_policy on public.therapies;
create policy therapies_delete_policy on public.therapies
for delete
using (public.current_app_role() = 'admin');

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
    and status <> 'cancelled'
  )
);

commit;
