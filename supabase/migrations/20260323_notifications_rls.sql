-- Add user_id column to notifications table
alter table public.notifications
add column user_id text null references public.app_users(id) on update cascade on delete cascade;

-- Enable Row Level Security (RLS) on notifications table
alter table public.notifications enable row security;

-- Create RLS policy for notifications
-- Users can see their own notifications or if they are an admin
create policy notifications_select on public.notifications
for select using (user_id = public.current_app_user_id() or public.current_app_role() = 'admin');

-- Optional: Policy for insert, update, delete for admins (or specific roles)
create policy notifications_manage_admin on public.notifications
for all using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

-- Backfill existing notifications with a dummy user_id if needed, or clear them.
-- For now, new notifications will target specific users. Old notifications will not be visible to anyone unless admin.