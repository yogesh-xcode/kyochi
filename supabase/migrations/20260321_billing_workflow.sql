begin;

alter table public.therapies
  add column if not exists price numeric;

update public.therapies
set price = 0
where price is null;

alter table public.therapies
  alter column price set default 0,
  alter column price set not null;

update public.billing
set status = case
  when lower(status) = 'paid' then 'paid'
  else 'unpaid'
end;

alter table public.billing
  alter column currency set default 'USD',
  alter column due_date drop not null,
  drop constraint if exists billing_status_check;

alter table public.billing
  add constraint billing_status_check
  check (status in ('unpaid', 'paid'));

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

commit;
