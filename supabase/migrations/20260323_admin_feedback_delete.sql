create policy feedback_delete_policy on public.feedback
for delete
using (
  public.current_app_role() = 'admin'
);
