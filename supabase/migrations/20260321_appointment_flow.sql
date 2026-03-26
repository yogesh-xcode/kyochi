begin;

alter table public.therapies
  add column if not exists price numeric not null default 0;

update public.therapies t
set price = coalesce(src.avg_amount, t.price)
from (
  select a.therapy_id, round(avg(b.amount)::numeric, 2) as avg_amount
  from public.billing b
  join public.appointments a on a.id = b.appointment_id
  group by a.therapy_id
) src
where src.therapy_id = t.id;

alter table public.billing
  add column if not exists franchise_id text references public.franchises(id) on update cascade;

update public.billing b
set franchise_id = a.franchise_id
from public.appointments a
where a.id = b.appointment_id
  and b.franchise_id is null;

alter table public.billing
  alter column franchise_id set not null;

alter table public.feedback
  add column if not exists franchise_id text references public.franchises(id) on update cascade;

update public.feedback f
set franchise_id = a.franchise_id
from public.appointments a
where a.id = f.appointment_id
  and f.franchise_id is null;

alter table public.feedback
  alter column franchise_id set not null;

update public.appointments
set status = case
  when lower(status) in ('in-progress', 'in progress') then 'in_progress'
  when lower(status) = 'decline' then 'declined'
  else lower(status)
end;

update public.billing
set status = case
  when lower(status) in ('pending', 'overdue') then 'due'
  else lower(status)
end;

update public.feedback
set status = case
  when lower(status) = 'submitted' then 'completed'
  else lower(status)
end;

alter table public.appointments
  drop constraint if exists appointments_status_check;
alter table public.appointments
  add constraint appointments_status_check
  check (status in ('waiting', 'scheduled', 'in_progress', 'completed', 'declined'));

alter table public.billing
  drop constraint if exists billing_status_check;
alter table public.billing
  add constraint billing_status_check
  check (status in ('due', 'paid'));

alter table public.feedback
  drop constraint if exists feedback_status_check;
alter table public.feedback
  add constraint feedback_status_check
  check (status in ('pending', 'completed'));

commit;
