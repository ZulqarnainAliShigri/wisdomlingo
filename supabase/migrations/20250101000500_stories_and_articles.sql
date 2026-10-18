-- WisdomLingo migration 006: Success Stories, Articles, and Missing Ausbildung Seeds
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/idsdemmkkqnajtxpuxrr/sql)
-- to enable database persistence for stories & articles and complete the Ausbildung catalogue.

-- 0. HELPER FUNCTION: updated_at timestamp trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1. SUCCESS STORIES TABLE
create table if not exists public.success_stories (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  role                text not null default 'Student',
  institution         text not null default 'European University',
  destination_country text not null default 'Germany',
  flag                text not null default '🇩🇪',
  intake              text,
  status_badge        text not null default 'Visa Approved',
  highlight           text not null default 'Successfully Enrolled',
  metric              text,
  quote               text not null,
  rating              integer not null default 5 check (rating >= 1 and rating <= 5),
  avatar_url          text,
  display_order       integer,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 2. ARTICLES TABLE
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text not null default 'Study Guide',
  excerpt       text not null,
  content       text,
  author        text default 'Academic Advisory Desk',
  read_time     text default '5 min read',
  image_url     text,
  tags          text[] not null default '{}',
  link_url      text default '/study-abroad',
  display_order integer,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Indexes
create index if not exists success_stories_active_idx on public.success_stories (is_active);
create index if not exists success_stories_order_idx  on public.success_stories (display_order);
create index if not exists articles_active_idx        on public.articles (is_active);
create index if not exists articles_order_idx         on public.articles (display_order);

-- Triggers for updated_at
drop trigger if exists success_stories_set_updated_at on public.success_stories;
create trigger success_stories_set_updated_at
  before update on public.success_stories
  for each row execute function public.set_updated_at();

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- RLS Policies
alter table public.success_stories enable row level security;
alter table public.articles        enable row level security;

-- Public can read active items
drop policy if exists "stories public read" on public.success_stories;
create policy "stories public read"
  on public.success_stories for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "stories admin write" on public.success_stories;
create policy "stories admin write"
  on public.success_stories for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "articles public read" on public.articles;
create policy "articles public read"
  on public.articles for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "articles admin write" on public.articles;
create policy "articles admin write"
  on public.articles for all
  to authenticated
  using (true)
  with check (true);

-- 3. SEED INITIAL SUCCESS STORIES (only if not already present)
insert into public.success_stories (name, role, institution, destination_country, flag, intake, status_badge, highlight, metric, quote, rating, avatar_url, display_order)
select
  'Sarah Jenkins', 'MSc Automotive Engineering', 'TU Munich, Germany', 'Germany', '🇩🇪', 'Winter 2025 Intake', 'Visa Approved & Enrolled', 'B2 Passed in 4 Months', 'Tuition-Free Public University', 'The team at WisdomLingo made the notoriously complex German visa process feel straightforward. Their in-house language prep was exactly what I needed to pass my B2 exams on the first attempt.', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80', 1
where not exists (select 1 from public.success_stories where name = 'Sarah Jenkins');

insert into public.success_stories (name, role, institution, destination_country, flag, intake, status_badge, highlight, metric, quote, rating, avatar_url, display_order)
select
  'Ahmed Al-Farsi', 'Nursing Specialist Ausbildung', 'Klinikum Frankfurt, Germany', 'Germany', '🇩🇪', 'Autumn 2025 Intake', 'Contract Secured & Visa Issued', '€1,240/month Monthly Stipend', '100% Employer Sponsored', 'I wanted to pursue an Ausbildung but had zero leads. WisdomLingo matched me with a leading healthcare employer in Frankfurt, negotiated my stipend, and prepared me for embassy questions.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80', 2
where not exists (select 1 from public.success_stories where name = 'Ahmed Al-Farsi');

insert into public.success_stories (name, role, institution, destination_country, flag, intake, status_badge, highlight, metric, quote, rating, avatar_url, display_order)
select
  'Elena Rodriguez', 'BSc International Business', 'Lund University, Sweden', 'Sweden', '🇸🇪', 'Spring 2026 Intake', 'Residence Permit Granted', 'Schengen Residence Permit', 'Top 100 Global University', 'From choosing Lund University in Sweden to arranging student housing and visa formalities, their support was relentless. The team was transparent, reachable, and deeply professional throughout.', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80', 3
where not exists (select 1 from public.success_stories where name = 'Elena Rodriguez');

-- 4. SEED INITIAL ARTICLES (only if not already present)
insert into public.articles (title, category, excerpt, content, author, read_time, image_url, tags, link_url, display_order)
select
  'Top 5 Public Universities in Germany for Engineering in 2026', 'Study Guide', 'A comprehensive look at the best tuition-free engineering programs available for international students.', 'Discover Germany''s elite TU9 technical universities offering zero tuition fee MSc programs taught completely in English. Learn about admission criteria, semester contribution costs, and career placement options.', 'Academic Advisory Desk', '5 min read', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80', array['Tuition-Free', 'TU9 Universities', 'Winter 2026'], '/study-abroad', 1
where not exists (select 1 from public.articles where title = 'Top 5 Public Universities in Germany for Engineering in 2026');

insert into public.articles (title, category, excerpt, content, author, read_time, image_url, tags, link_url, display_order)
select
  'How to Ace the Goethe-Zertifikat B2 Exam: Insider Tips', 'Language', 'Our in-house language experts share their top strategies for passing the critical B2 assessment on your first try.', 'B2 is the golden gateway for both university admissions and nursing recognition in Germany. Master the Schreiben structure, learn how to handle Sprechen roleplays, and practice with real OSD and Goethe simulation mocks.', 'German Language Dept.', '4 min read', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80', array['Goethe Exam', 'B2 Certificate', 'Exam Prep'], '/courses', 2
where not exists (select 1 from public.articles where title = 'How to Ace the Goethe-Zertifikat B2 Exam: Insider Tips');

insert into public.articles (title, category, excerpt, content, author, read_time, image_url, tags, link_url, display_order)
select
  'The Ultimate Guide to German Ausbildung Programs', 'Ausbildung', 'Everything you need to know about the dual vocational training system, monthly stipends, and securing an employer contract.', 'Ausbildung provides paid on-the-job training in Germany with monthly stipends of €1,000–€1,400. From IT specialist to nursing and hospitality, discover how to secure an employer contract from Pakistan.', 'Vocational Pathways', '6 min read', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80', array['Paid Training', 'No Tuition', 'PR Pathway'], '/ausbildung', 3
where not exists (select 1 from public.articles where title = 'The Ultimate Guide to German Ausbildung Programs');

insert into public.articles (title, category, excerpt, content, author, read_time, image_url, tags, link_url, display_order)
select
  'Blocked Account, Insurance and APS: The Paperwork Checklist', 'Visa & Documents', 'Most refusals happen on documents, not merit. Here is the exact file an embassy expects from a Pakistani applicant.', 'Avoid costly visa delays. Learn the exact requirements for APS verification, choosing between Expatrio, Coracle or Fintiba for your blocked account, and statutory health insurance setup.', 'Visa Compliance Cell', '7 min read', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=80', array['APS Certificate', 'Blocked Account', 'Embassy Tips'], '/study-abroad', 4
where not exists (select 1 from public.articles where title = 'Blocked Account, Insurance and APS: The Paperwork Checklist');

insert into public.articles (title, category, excerpt, content, author, read_time, image_url, tags, link_url, display_order)
select
  'Cyprus, Hungary or Germany: Choosing Your First Destination', 'Study Guide', 'Tuition, language requirements and intake dates compared, so you apply where your profile actually stands a chance.', 'A realistic comparison between Western and Eastern European education options. Compare visa approval rates, minimum IELTS requirements, and budget constraints.', 'Academic Advisory Desk', '5 min read', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80', array['European Study', 'Visa Comparison', 'Admissions'], '/study-abroad', 5
where not exists (select 1 from public.articles where title = 'Cyprus, Hungary or Germany: Choosing Your First Destination');

insert into public.articles (title, category, excerpt, content, author, read_time, image_url, tags, link_url, display_order)
select
  'Your First Month Abroad: Registration, Bank and SIM', 'Student Life', 'Anmeldung, a local bank account and health insurance - the three errands that decide how smoothly your semester starts.', 'Step-by-step checklist upon landing in Germany: scheduling your city registration (Anmeldung), unlocking your blocked account funds, and buying an affordable student SIM card.', 'Student Welfare Desk', '4 min read', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80', array['Student Life', 'Anmeldung', 'Settling In'], '/about', 6
where not exists (select 1 from public.articles where title = 'Your First Month Abroad: Registration, Bank and SIM');

-- 5. ENSURE MISSING AUSBILDUNG PROGRAM EXISTS (only if not already present)
insert into public.apprenticeships (title, field, salary, duration, description, requirements, benefits, display_order)
select
  'IT & Software (Fachinformatiker)', 'IT', 'EUR 1,000 - 1,300 / month', '3 years',
  'Train as an IT specialist in application development or systems integration with a German company while studying at a vocational school two days a week.',
  array['German B1 (B2 preferred)','FSc Pre-Engineering / ICS or equivalent','Basic programming or networking knowledge','Age 18-30'],
  array['Paid from day one','Permanent job offer on completion','Health and pension insurance included','Employer usually sponsors the visa'], 1
where not exists (select 1 from public.apprenticeships where title = 'IT & Software (Fachinformatiker)');
