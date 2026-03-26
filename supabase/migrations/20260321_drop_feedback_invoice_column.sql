begin;

alter table public.feedback
  drop constraint if exists feedback_invoice_id_fkey;

alter table public.feedback
  drop column if exists invoice_id;

commit;
