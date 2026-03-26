# Supabase Setup Notes

## One-shot setup (recommended for fresh project)
Run this single file in Supabase SQL Editor:

1. Execute `supabase/one_shot_setup.sql`

This file includes:
- schema
- RLS/RBAC functions and policies
- seed data
- post-setup trigger guards required by current workflow

## Optional split setup (same result)
If you prefer split execution:
1. `supabase/schema.sql`
2. `supabase/rls.sql`
3. `supabase/seed.sql`
4. `supabase/migrations/20260321_appointments_edit_guard.sql`

## Auth user mapping
After creating users in Supabase Auth, map UUID to `public.app_users.auth_user_id` if needed:

```sql
update public.app_users
set auth_user_id = 'REPLACE_WITH_AUTH_USERS_ID'::uuid
where email = 'admin@kyochi.example';
```

Check mappings:

```sql
select id, email, role, auth_user_id
from public.app_users
order by id;
```

## Quick policy check
Run as signed-in user context:

```sql
select public.current_app_role();
select count(*) from public.patients;
select count(*) from public.appointments;
select count(*) from public.feedback;
```
