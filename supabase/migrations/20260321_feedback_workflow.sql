begin;

alter table public.feedback
  add column if not exists invoice_id text references public.billing(id) on update cascade;

alter table public.feedback
  add column if not exists submitted_at timestamptz null;

alter table public.feedback
  alter column notes drop not null,
  alter column notes drop default;

alter table public.feedback
  drop constraint if exists feedback_rating_check;

alter table public.feedback
  alter column rating drop not null;

alter table public.feedback
  alter column rating type integer
  using (
    case
      when rating is null then null
      when trim(rating::text) ~ '^[1-5]$' then trim(rating::text)::integer
      else null
    end
  );

alter table public.feedback
  add constraint feedback_rating_check
  check (rating between 1 and 5);

update public.feedback
set status = case
  when lower(status) = 'completed' then 'completed'
  else 'pending'
end;

alter table public.feedback
  drop constraint if exists feedback_status_check;

alter table public.feedback
  add constraint feedback_status_check
  check (status in ('pending', 'completed'));

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
);

drop policy if exists feedback_delete_policy on public.feedback;

commit;
