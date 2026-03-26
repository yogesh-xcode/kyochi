begin;

create or replace function public.prevent_non_scheduled_appointment_detail_edits()
returns trigger
language plpgsql
as $$
begin
  if (
    coalesce(new.patient_id, '') <> coalesce(old.patient_id, '')
    or coalesce(new.therapy_id, '') <> coalesce(old.therapy_id, '')
    or coalesce(new.therapist_id, '') <> coalesce(old.therapist_id, '')
    or coalesce(new.franchise_id, '') <> coalesce(old.franchise_id, '')
    or new.starts_at is distinct from old.starts_at
  ) and old.status <> 'scheduled' then
    raise exception 'Only Scheduled appointments can be edited.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_non_scheduled_appointment_detail_edits on public.appointments;

create trigger trg_prevent_non_scheduled_appointment_detail_edits
before update on public.appointments
for each row
execute function public.prevent_non_scheduled_appointment_detail_edits();

commit;
