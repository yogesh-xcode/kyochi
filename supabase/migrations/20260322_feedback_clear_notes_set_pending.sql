begin;

update public.feedback
set notes = null,
    status = 'pending';

commit;
