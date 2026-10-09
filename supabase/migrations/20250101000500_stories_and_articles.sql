-- WisdomLingo migration 006: Success Stories and Articles tables
-- Run this in your Supabase SQL Editor to enable database persistence for stories & articles

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
