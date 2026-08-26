-- WisdomLingo migration 004: editable SEO settings.
--
-- One row only. `id` is a boolean fixed to true, so a second row is impossible
-- and the app can always upsert against id = true without knowing a uuid.

create table if not exists public.seo_settings (
  id                  boolean primary key default true check (id),

  -- Site-wide
  site_name           text not null default 'WisdomLingo',
  -- Absolute origin, e.g. https://wisdomlingo.com - used for canonical URLs,
  -- og:url and the sitemap. No trailing slash.
  site_url            text not null default '',
  -- "%s" is replaced by the page title, e.g. "%s | WisdomLingo".
  title_template      text not null default '%s | WisdomLingo',
  default_description text not null default '',
  keywords            text not null default '',
  og_image_url        text,
  twitter_handle      text,
  -- The content value of Google Search Console's HTML-tag verification.
  google_verification text,

  -- Per-route overrides: { "home": { "title": "...", "description": "...", "noindex": false }, ... }
  pages               jsonb not null default '{}'::jsonb,

  updated_at          timestamptz not null default now()
);

drop trigger if exists seo_settings_set_updated_at on public.seo_settings;
create trigger seo_settings_set_updated_at
  before update on public.seo_settings
  for each row execute function public.set_updated_at();

-- Row level security: everyone reads (the public site needs the tags),
-- only the signed-in admin writes.
alter table public.seo_settings enable row level security;

drop policy if exists "seo public read" on public.seo_settings;
create policy "seo public read"
  on public.seo_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "seo admin write" on public.seo_settings;
create policy "seo admin write"
  on public.seo_settings for all
  to authenticated
  using (true)
  with check (true);

-- Seed the single row with the values currently hard-coded in index.html.
insert into public.seo_settings (id, site_name, title_template, default_description, keywords, pages)
values (
  true,
  'WisdomLingo',
  '%s | WisdomLingo',
  'WisdomLingo - German language courses (A1 to C2), IELTS and spoken English, Quran, Arabic and Persian classes, study abroad counselling for six European countries, and paid apprenticeships in Germany.',
  'German language course, Ausbildung, study abroad, IELTS, Goethe exam, WisdomLingo, Islamabad',
  '{
    "home": {
      "title": "German Language Academy & Study Abroad Consultancy",
      "description": "German A1-C2, IELTS, study abroad guidance for Germany, Sweden, Cyprus, Turkey, Austria and Switzerland, plus paid apprenticeships. Islamabad based, 15+ years experience."
    },
    "courses": {
      "title": "German, English & Religious Courses",
      "description": "German A1 to C2 with Goethe and OSD exam preparation, IELTS and spoken English, plus Quran, Arabic and Persian classes with certified teachers."
    },
    "studyAbroad": {
      "title": "Study Abroad in Europe",
      "description": "University admissions, visa files and blocked accounts for Germany, Sweden, Cyprus, Turkey, Austria and Switzerland."
    },
    "apprenticeships": {
      "title": "Paid Apprenticeships (Ausbildung) in Germany",
      "description": "Earn while you train. Paid German Ausbildung contracts in IT, nursing, hospitality, painting and bakery, with employer-sponsored visas."
    },
    "about": {
      "title": "About Us & Contact",
      "description": "Fifteen years placing Pakistani students in European universities and paid apprenticeships. Visit us in F-8/1 Islamabad or send an enquiry."
    }
  }'::jsonb
)
on conflict (id) do nothing;
