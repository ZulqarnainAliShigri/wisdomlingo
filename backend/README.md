# WisdomLingo — Backend (Supabase)

The backend is a Supabase project: Postgres for data, GoTrue for admin auth, and Storage
for course images. There is no server to run — this folder holds everything that defines it,
so the whole backend can be rebuilt from scratch in a few minutes.

```
backend/supabase/
├── config.toml                                  local CLI settings
├── migrations/
│   ├── 20250101000000_init_tables.sql           tables, indexes, updated_at triggers
│   ├── 20250101000100_rls_policies.sql          row level security
│   ├── 20250101000200_storage_bucket.sql        course-images bucket + policies
│   └── 20250101000300_seo_settings.sql          editable SEO settings (one row)
└── seed.sql                                     starter content (11 courses, 6 countries, 5 fields)
```

## Setup — dashboard (simplest)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query** and run these files **in order**, one at a time:
   1. `migrations/20250101000000_init_tables.sql`
   2. `migrations/20250101000100_rls_policies.sql`
   3. `migrations/20250101000200_storage_bucket.sql`
   4. `migrations/20250101000300_seo_settings.sql`
   5. `seed.sql`
3. **Authentication → Users → Add user → Create new user**
   - Email `admin@wisdomlingo.com`, a strong password, tick **Auto Confirm User**.
4. **Project Settings → API** — copy **Project URL** and the **anon public** key into
   `frontend/.env.local`, then restart the frontend.

## Setup — Supabase CLI (optional)

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF   # run from this folder
supabase db push                                # applies migrations/
```

`supabase start` runs the whole stack locally in Docker if you prefer offline development.

## Schema

| Table | Columns | Used by |
|---|---|---|
| `courses` | title, category (`german`/`english`/`religious`), level, duration, fee, description, image_url, display_order, is_active | Courses page, admin Courses tab |
| `study_countries` | name, flag, tagline, description, benefits[], requirements[], tuition, intake, image_url, display_order, is_active | Study Abroad page, admin Destinations tab |
| `apprenticeships` | title, field, salary, duration, description, requirements[], benefits[], image_url, display_order, is_active | Apprenticeships page, admin Apprenticeships tab |
| `contact_submissions` | name, email, phone, subject, message, is_read, created_at | About page form, admin Messages tab |
| `seo_settings` | site_name, site_url, title_template, default_description, keywords, og_image_url, twitter_handle, google_verification, pages (jsonb) | every public page's `<head>`, admin SEO tab |

`seo_settings` holds exactly one row: its `id` is a boolean fixed to `true`, so a second row
cannot be inserted and the app can always upsert against `id = true`. Unlike the content
tables it is readable by `anon` regardless of any flag, because the public pages need it to
build their meta tags.

`benefits` and `requirements` are Postgres `text[]`. The dashboard edits them as one item
per line, so admins never touch array syntax.

Every content table has an `updated_at` trigger and a `display_order` column — lower numbers
appear first on the public pages, and `null` sorts last.

## Security model

| Who | Can do |
|---|---|
| `anon` (any visitor) | read rows where `is_active = true`; insert into `contact_submissions`; read files in `course-images` |
| `authenticated` (admin) | full read/write on all four tables; upload, replace and delete files in `course-images` |

Any signed-in user counts as an admin, which is correct while `admin@wisdomlingo.com` is the
only account (public signup is disabled). To harden it, replace the write policies with the
email-scoped variant at the bottom of `20250101000100_rls_policies.sql`:

```sql
using (auth.jwt() ->> 'email' = 'admin@wisdomlingo.com')
with check (auth.jwt() ->> 'email' = 'admin@wisdomlingo.com')
```

Only the **anon** key belongs in the frontend — it is safe in the browser precisely because
RLS is enforced. Never ship the service-role key.

## Storage

Bucket `course-images`, public read. The frontend uploads to `courses/`, `countries/` and
`apprenticeships/` subfolders as `<timestamp>-<random>.<ext>`, validating type (JPG, PNG,
WEBP, GIF) and size (≤ 5 MB) before upload. Deleting a row also deletes its uploaded image.

## Changing the schema

Add a new timestamped file to `migrations/` rather than editing an applied one, then either
run it in the SQL Editor or `supabase db push`. Keep `frontend/src/types/index.ts` in sync.

---

## This project (already provisioned)

| Item | Value |
|---|---|
| Project ref | `idsdemmkkqnajtxpuxrr` |
| API URL | `https://idsdemmkkqnajtxpuxrr.supabase.co` |
| Region | `ap-northeast-2` (Seoul) |
| Admin login | `admin@wisdomlingo.com` |

All three migrations and `seed.sql` have been applied: 11 courses, 6 study destinations,
5 apprenticeship fields, 12 RLS policies and the public `course-images` bucket.

### Connecting with psql or a migration tool

`db.idsdemmkkqnajtxpuxrr.supabase.co` resolves to **IPv6 only**. On an IPv4-only network use
the Supavisor pooler instead:

```
postgresql://postgres.idsdemmkkqnajtxpuxrr:<DB-PASSWORD>@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres
```

Port 5432 is session mode (use this for migrations and DDL); 6543 is transaction mode.

### Note on the admin account

Supabase rejects signups for `admin@wisdomlingo.com` because `wisdomlingo.com` is not a
deliverable domain, so the account was created directly in `auth.users` (confirmed, with a
matching `auth.identities` row). Password logins work normally. Change its password from
**Authentication → Users → admin@wisdomlingo.com → Reset password**.
