// Shared data types, mirrored by supabase/migrations.


export type CourseCategory = "german" | "english" | "religious";

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  level: string | null;
  duration: string | null;
  fee: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order?: number | null;
  created_at?: string;
}

export interface StudyCountry {
  id: string;
  name: string;
  flag: string;
  tagline: string | null;
  description: string | null;
  benefits: string[];
  requirements: string[];
  tuition: string | null;
  intake: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order?: number | null;
}

export interface Apprenticeship {
  id: string;
  title: string;
  field: string;
  salary: string | null;
  duration: string | null;
  description: string | null;
  requirements: string[];
  benefits: string[];
  image_url: string | null;
  is_active: boolean;
  display_order?: number | null;
}

export type Ausbildung = Apprenticeship;

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

/* =========================================================================
   3. SEED / FALLBACK CONTENT
   Used when Supabase is not configured or a table is still empty.

/* =========================================================================
   SEO SETTINGS - one editable row, applied to every public page.
   ========================================================================= */

/** The five public routes the admin can tune individually. */
export type SeoPageKey =
  | "home"
  | "courses"
  | "studyAbroad"
  | "apprenticeships"
  | "blog"
  | "about";

export interface SeoPageOverride {
  title: string;
  description: string;
  /** The phrase this page is meant to rank for; drives the on-page analysis. */
  focusKeyword?: string;
  /** Ask search engines to skip this page. Off for every page by default. */
  noindex?: boolean;
}

export interface SeoSettings {
  site_name: string;
  /** Absolute origin with no trailing slash, e.g. https://wisdomlingo.com */
  site_url: string;
  /** "%s" is replaced by the page title. */
  title_template: string;
  default_description: string;
  keywords: string;
  og_image_url: string | null;
  twitter_handle: string | null;
  google_verification: string | null;
  pages: Partial<Record<SeoPageKey, SeoPageOverride>>;
  updated_at?: string;
}

/**
 * Editable business details, one row in `company_settings`.
 *
 * Mirrors the shape of `config/company.json`, which stays in the repo as the
 * fallback used when the table is unreachable.
 */
export interface CompanySettings {
  name: string;
  legal_name: string;
  tagline: string;
  phone: string;
  /** E.164-ish, e.g. +92-311-8526814 - tel: and WhatsApp links are built from this. */
  phone_e164: string;
  email: string;
  address_street: string;
  address_locality: string;
  address_region: string;
  address_postal_code: string;
  address_country: string;
  geo_latitude: number | null;
  geo_longitude: number | null;
  /** The human sentence shown on the site, e.g. "Mon - Sat, 9:00 AM - 8:00 PM". */
  hours: string;
  opening_days: string[];
  opening_opens: string;
  opening_closes: string;
  google_place_query: string;
  google_maps_url: string;
  social_instagram: string;
  social_facebook: string;
  social_linkedin: string;
  social_tiktok: string;
  updated_at?: string;
}

/** A raw row as returned by supabase-js before mapping. */
export type Row = Record<string, any>;
