-- WisdomLingo migration 001: tables, indexes and updated_at triggers.


create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------

create table if not exists public.courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text not null check (category in ('german', 'english', 'religious')),
  level         text,
  duration      text,
  fee           text,
  description   text,
  image_url     text,
  display_order integer,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.study_countries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  flag          text,
  tagline       text,
  description   text,
  benefits      text[] not null default '{}',
  requirements  text[] not null default '{}',
  tuition       text,
  intake        text,
  image_url     text,
  display_order integer,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.apprenticeships (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  field         text not null,
  salary        text,
  duration      text,
  description   text,
  requirements  text[] not null default '{}',
  benefits      text[] not null default '{}',
  image_url     text,
  display_order integer,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists courses_category_idx        on public.courses (category);
create index if not exists courses_active_idx          on public.courses (is_active);
create index if not exists countries_order_idx         on public.study_countries (display_order);
create index if not exists apprenticeships_order_idx   on public.apprenticeships (display_order);
create index if not exists submissions_created_at_idx  on public.contact_submissions (created_at desc);

-- ---------------------------------------------------------------------
-- 2. updated_at TRIGGER
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

drop trigger if exists countries_set_updated_at on public.study_countries;
create trigger countries_set_updated_at
  before update on public.study_countries
  for each row execute function public.set_updated_at();

drop trigger if exists apprenticeships_set_updated_at on public.apprenticeships;
create trigger apprenticeships_set_updated_at
  before update on public.apprenticeships
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
