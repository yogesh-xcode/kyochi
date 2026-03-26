begin;

alter table public.feedback
  add column if not exists attachment_path text null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'feedback-attachments',
  'feedback-attachments',
  true,
  5242880,
  array['application/pdf', 'image/png', 'image/jpeg']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists feedback_attachments_insert on storage.objects;
create policy feedback_attachments_insert on storage.objects
for insert to authenticated
with check (bucket_id = 'feedback-attachments');

drop policy if exists feedback_attachments_select on storage.objects;
create policy feedback_attachments_select on storage.objects
for select to authenticated
using (bucket_id = 'feedback-attachments');

drop policy if exists feedback_attachments_update on storage.objects;
create policy feedback_attachments_update on storage.objects
for update to authenticated
using (bucket_id = 'feedback-attachments')
with check (bucket_id = 'feedback-attachments');

drop policy if exists feedback_attachments_delete on storage.objects;
create policy feedback_attachments_delete on storage.objects
for delete to authenticated
using (bucket_id = 'feedback-attachments');

commit;
