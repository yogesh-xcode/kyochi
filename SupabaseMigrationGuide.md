# Kyochi Reflexology App — Supabase Migration Guide

## Overview

This guide covers migrating the Kyochi app from one Supabase project to another. You'll need two files produced from the source project:

- `full_schema.sql` — all tables, RLS policies, functions, triggers, indexes
- `data.sql` — all seed/test data rows from the public schema

---

## Prerequisites

### Tools Required

```bash
# Install PostgreSQL 17 client (must match Supabase's server version)
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo tee /etc/apt/trusted.gpg.d/pgdg.asc
sudo apt update
sudo apt install -y postgresql-client-17
```

Confirm the right version is being used:

```bash
/usr/lib/postgresql/17/bin/psql --version
# Should output: psql (PostgreSQL) 17.x
```

---

## Step 1 — Dump from Source Project

> Skip this if you already have `full_schema.sql` and `data.sql`.

Get your source project's **Session Pooler URL** from:  
**Supabase Dashboard → Settings → Database → Connection string (URI)**

```bash
export SOURCE_DB="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Schema dump (tables, RLS, functions, triggers)
/usr/lib/postgresql/17/bin/pg_dump "$SOURCE_DB" > full_schema.sql

# Data dump (all rows from public schema)
/usr/lib/postgresql/17/bin/pg_dump "$SOURCE_DB" \
  --data-only \
  --schema public \
  > data.sql
```

Verify both files have content:

```bash
wc -l full_schema.sql   # Should be ~8000+ lines
wc -l data.sql          # Should be 400+ lines
```

---

## Step 2 — Create New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose the same region as your old project (**ap-southeast-1** for Chennai/India)
3. Set a strong database password and save it somewhere safe
4. Wait for the project to finish provisioning (~2 minutes)

---

## Step 3 — Get New Project Connection String

**Supabase Dashboard → Settings → Database → Connection string → URI tab**

It will look like:

```
postgresql://postgres.[NEW-PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

```bash
export NEW_DB="postgresql://postgres.[NEW-PROJECT-REF]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

---

## Step 4 — Restore Schema

```bash
/usr/lib/postgresql/17/bin/psql "$NEW_DB" < full_schema.sql
```

You'll see a stream of output — some `NOTICE` messages are normal. Watch for any `ERROR` lines. A few errors on Supabase-internal objects (like `realtime` or `auth` schemas) are expected and harmless — the important thing is the `public` schema restores cleanly.

---

## Step 5 — Restore Data

```bash
/usr/lib/postgresql/17/bin/psql "$NEW_DB" < data.sql
```

---

## Step 6 — Verify Migration

Connect to the new DB and run a quick check:

```bash
/usr/lib/postgresql/17/bin/psql "$NEW_DB" -c "
  SELECT
    'franchises' as table_name, count(*) FROM public.franchises
  UNION ALL
  SELECT 'patients', count(*) FROM public.patients
  UNION ALL
  SELECT 'therapists', count(*) FROM public.therapists
  UNION ALL
  SELECT 'appointments', count(*) FROM public.appointments
  UNION ALL
  SELECT 'billing', count(*) FROM public.billing
  UNION ALL
  SELECT 'feedback', count(*) FROM public.feedback;
"
```

Also verify RLS policies are present:

```bash
/usr/lib/postgresql/17/bin/psql "$NEW_DB" -c "
  SELECT tablename, count(*) as policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
  GROUP BY tablename
  ORDER BY tablename;
"
```

Expected output — every table should have at least 2–4 policies.

---

## Step 7 — Supabase Dashboard Settings (Manual)

These don't migrate via SQL dump — you need to set them manually in the new project dashboard:

### Auth Settings

- **Dashboard → Authentication → URL Configuration**
  - Set Site URL to your app URL (e.g. `https://kyochi.vercel.app`)
  - Add redirect URLs
- **Dashboard → Authentication → Email Templates**
  - Recreate any custom email templates

### Storage Buckets

- **Dashboard → Storage**
  - Recreate the `feedback-attachments` bucket
  - Set it to private (RLS policies are already in the schema)

### API Keys

- **Dashboard → Settings → API**
  - Copy the new `SUPABASE_URL` and `SUPABASE_ANON_KEY`

---

## Step 8 — Update Environment Variables

Update your `.env.local` (and Vercel/hosting environment variables):

```env
# Old values — replace these
NEXT_PUBLIC_SUPABASE_URL=https://[OLD-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=old-anon-key

# New values
NEXT_PUBLIC_SUPABASE_URL=https://[NEW-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=new-anon-key

# These stay the same
GEMINI_API_KEY=your-gemini-key
```

---

## Step 9 — Auth Users

> ⚠️ Auth users (`auth.users`) **do not migrate** via pg_dump. This is a Supabase-managed table.

**What this means:**

- All existing login accounts will not carry over
- Users will need to re-register on the new project
- The `app_users` table rows **will** migrate (they have the patient/therapist/franchise data), but the `auth_user_id` links will be broken until users re-register

**For a hobby/dev project:** this is fine — just re-register your test accounts and the admin can re-link them via the `app_users` table.

---

## What Migrates vs What Doesn't

| Item                                   | Migrates via SQL | Notes             |
| -------------------------------------- | ---------------- | ----------------- |
| Tables & schema                        | ✅               | `full_schema.sql` |
| RLS policies                           | ✅               | `full_schema.sql` |
| Functions & triggers                   | ✅               | `full_schema.sql` |
| Indexes                                | ✅               | `full_schema.sql` |
| Seed data (franchises, patients, etc.) | ✅               | `data.sql`        |
| Auth users (login accounts)            | ❌               | Must re-register  |
| Storage bucket files                   | ❌               | Must re-upload    |
| Storage bucket config                  | ❌               | Recreate manually |
| Auth email templates                   | ❌               | Recreate manually |
| Supabase Edge Functions                | ❌               | Redeploy manually |
| Dashboard settings                     | ❌               | Set manually      |

---

## Resetting the Old Project Password

After migration is complete, reset the source project's database password:

**Supabase Dashboard → Settings → Database → Reset database password**

This is important since the connection string was used in terminal commands.

---

## Troubleshooting

**`pg_dump: error: server version mismatch`**  
Use the full path: `/usr/lib/postgresql/17/bin/pg_dump` instead of just `pg_dump`

**`Network is unreachable` on port 5432**  
Use the Session Pooler URL (port 5432 on `pooler.supabase.com`), not the direct DB host

**`ERROR: role "supabase_admin" does not exist`**  
Safe to ignore — these are Supabase-internal roles that exist on every project automatically

**`ERROR: schema "extensions" already exists`**  
Safe to ignore — Supabase creates these schemas by default on every new project

**RLS policies not working after migration**  
Check that the helper functions migrated correctly:

```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE 'current_app_%';
```

Should return: `current_app_role`, `current_app_user_id`, `current_app_franchise_id`, `current_app_therapist_id`, `current_app_patient_id`
