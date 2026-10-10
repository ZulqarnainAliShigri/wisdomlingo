-- WisdomLingo migration 005: editable business details.
--
-- These used to live in `frontend/src/config/company.json`, which meant every
-- correction to a phone number or an opening hour needed a code change and a
-- redeploy. They now live here so the admin can edit them in the dashboard.
--
-- Same one-row shape as `seo_settings`: `id` is a boolean fixed to true, so a
-- second row is impossible and the app upserts against id = true without
-- knowing a uuid.
--
-- company.json stays in the repo as the fallback the app and the post-build SEO
-- script use when this table is unreachable, so a missing migration or a paused
-- project degrades to the old values instead of a blank site.

create table if not exists public.company_settings (
  id                   boolean primary key default true check (id),

  -- Identity
  name                 text not null default 'WisdomLingo',
  legal_name           text not null default '',
  tagline              text not null default '',

  -- Contact. `phone` is what visitors read; `phone_e164` is what tel: and
  -- WhatsApp links are built from, so the two are stored separately.
  phone                text not null default '',
  phone_e164           text not null default '',
  email                text not null default '',

  -- Address, split into the parts schema.org/PostalAddress expects.
  address_street       text not null default '',
  address_locality     text not null default '',
  address_region       text not null default '',
  address_postal_code  text not null default '',
  address_country      text not null default 'PK',

  -- Map pin for LocalBusiness structured data.
  geo_latitude         double precision,
  geo_longitude        double precision,

  -- `hours` is the human sentence shown on the site; the three opening_*
  -- columns are the machine-readable form Google reads.
  hours                text not null default '',
  opening_days         text[] not null default array[]::text[],
  opening_opens        text not null default '09:00',
  opening_closes       text not null default '20:00',

  -- Exactly as the business is listed on Google, so the embed resolves the
  -- right pin without a Maps API key.
  google_place_query   text not null default '',
  google_maps_url      text not null default '',

  social_instagram     text not null default '',
  social_facebook      text not null default '',
  social_linkedin      text not null default '',
  social_tiktok        text not null default '',

  updated_at           timestamptz not null default now()
);

drop trigger if exists company_settings_set_updated_at on public.company_settings;
create trigger company_settings_set_updated_at
  before update on public.company_settings
  for each row execute function public.set_updated_at();

-- Row level security: everyone reads (the public site shows these on every
-- page), only the signed-in admin writes.
alter table public.company_settings enable row level security;

drop policy if exists "company public read" on public.company_settings;
create policy "company public read"
  on public.company_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "company admin write" on public.company_settings;
create policy "company admin write"
  on public.company_settings for all
  to authenticated
  using (true)
  with check (true);

-- Seed with the values company.json currently holds, so the site looks
-- identical the moment this runs.
insert into public.company_settings (
  id, name, legal_name, tagline,
  phone, phone_e164, email,
  address_street, address_locality, address_region, address_postal_code, address_country,
  geo_latitude, geo_longitude,
  hours, opening_days, opening_opens, opening_closes,
  google_place_query, google_maps_url,
  social_instagram, social_facebook, social_linkedin, social_tiktok
)
values (
  true,
  'WisdomLingo',
  'Wisdomlingo German Language Academy and Consultancy',
  'Learn. Travel. Achieve.',
  '03118526814',
  '+92-311-8526814',
  'info@wisdomlingo.com',
  'House 3A, Park Road, F-8/1',
  'Islamabad',
  'Islamabad Capital Territory',
  '44000',
  'PK',
  33.7102734,
  73.0321496,
  'Mon - Sat, 9:00 AM - 8:00 PM',
  array['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  '09:00',
  '20:00',
  'Wisdomlingo German language Academy and consultancy',
  'https://share.google/9lTl3g6nDtA19ffrH',
  'https://www.instagram.com/wisdomlingo',
  'https://www.facebook.com/share/1EMnwzS44J/',
  'https://www.linkedin.com/in/muhammad-raza-abidi-79aa7937a',
  'https://www.tiktok.com/@wisdomlingo_academy'
)
on conflict (id) do nothing;
