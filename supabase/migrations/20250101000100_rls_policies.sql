-- WisdomLingo migration 002: row level security policies.
-- Public (anon) reads active content and may submit the contact form;
-- any authenticated user (the admin account) may write everything.

-- 3. ROW LEVEL SECURITY
--    Public (anon) may read active rows and insert contact messages.
--    Any authenticated user (your admin account) may write everything.
-- ---------------------------------------------------------------------

alter table public.courses             enable row level security;
alter table public.study_countries     enable row level security;
alter table public.apprenticeships     enable row level security;
alter table public.contact_submissions enable row level security;

-- courses -------------------------------------------------------------
drop policy if exists "courses public read"  on public.courses;
create policy "courses public read"
  on public.courses for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "courses admin write" on public.courses;
create policy "courses admin write"
  on public.courses for all
  to authenticated
  using (true)
  with check (true);

-- study_countries -----------------------------------------------------
drop policy if exists "countries public read" on public.study_countries;
create policy "countries public read"
  on public.study_countries for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "countries admin write" on public.study_countries;
create policy "countries admin write"
  on public.study_countries for all
  to authenticated
  using (true)
  with check (true);

-- apprenticeships -----------------------------------------------------
drop policy if exists "apprenticeships public read" on public.apprenticeships;
create policy "apprenticeships public read"
  on public.apprenticeships for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "apprenticeships admin write" on public.apprenticeships;
create policy "apprenticeships admin write"
  on public.apprenticeships for all
  to authenticated
  using (true)
  with check (true);

-- contact_submissions -------------------------------------------------
-- Anyone may submit the contact form; only admins may read or delete.
drop policy if exists "submissions public insert" on public.contact_submissions;
create policy "submissions public insert"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

drop policy if exists "submissions admin read" on public.contact_submissions;
create policy "submissions admin read"
  on public.contact_submissions for select
  to authenticated
  using (true);

drop policy if exists "submissions admin update" on public.contact_submissions;
create policy "submissions admin update"
  on public.contact_submissions for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "submissions admin delete" on public.contact_submissions;
create policy "submissions admin delete"
  on public.contact_submissions for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
