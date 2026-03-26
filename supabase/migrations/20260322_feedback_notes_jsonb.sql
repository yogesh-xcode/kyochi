do $$
declare
  notes_type text;
begin
  select data_type
  into notes_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'feedback'
    and column_name = 'notes';

  if notes_type = 'text' then
    drop policy if exists feedback_insert_policy on public.feedback;

    create or replace function public._try_parse_feedback_notes_jsonb(input_text text)
    returns jsonb
    language plpgsql
    as $fn$
    begin
      return input_text::jsonb;
    exception
      when others then
        return jsonb_build_object('legacy_note', input_text);
    end;
    $fn$;

    alter table public.feedback
      alter column notes type jsonb
      using (
        case
          when notes is null then null
          else public._try_parse_feedback_notes_jsonb(notes)
        end
      );

    drop function public._try_parse_feedback_notes_jsonb(text);

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
  end if;
end;
$$;
