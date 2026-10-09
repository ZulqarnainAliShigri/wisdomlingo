// Company details shown across the site.
//
// These are edited in the dashboard (Settings > Business details) and stored in
// the `company_settings` table. company.json stays here as the fallback: it is
// what the app renders before the row loads, and what it keeps using if the
// table is missing or Supabase is unreachable, so the site degrades to the last
// known-good values instead of showing blanks.
//
// The post-build SEO script reads the same table, with the same fallback, so
// the visible page and the LocalBusiness markup never disagree.

import company from "./company.json";
import { CompanySettings } from "../types";

/** company.json, flattened into the row shape the database stores. */
export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: company.name,
  legal_name: company.legalName,
  tagline: company.tagline,
  phone: company.phone,
  phone_e164: company.phoneE164,
  email: company.email,
  address_street: company.address.street,
  address_locality: company.address.locality,
  address_region: company.address.region,
  address_postal_code: company.address.postalCode,
  address_country: company.address.country,
  geo_latitude: company.geo.latitude,
  geo_longitude: company.geo.longitude,
  hours: company.hours,
  opening_days: company.openingHours.days,
  opening_opens: company.openingHours.opens,
  opening_closes: company.openingHours.closes,
  google_place_query: company.googlePlaceQuery,
  google_maps_url: company.googleMapsUrl,
  social_instagram: company.social.instagram,
  social_facebook: company.social.facebook,
  social_linkedin: company.social.linkedin,
  social_tiktok: company.social.tiktok,
};

export type Company = ReturnType<typeof buildCompany>;

/**
 * Turns a settings row into the object every component reads.
 *
 * The derived fields (tel: href, WhatsApp link, map URLs) are computed here
 * rather than stored, so an admin who edits the phone number cannot leave a
 * stale WhatsApp link behind.
 */
export function buildCompany(settings: CompanySettings) {
  const placeQuery = settings.google_place_query || settings.legal_name || settings.name;
  const digits = settings.phone_e164.replace(/[^\d]/g, "");
  const street = [settings.address_street, settings.address_locality].filter(Boolean).join(", ");

  return {
    name: settings.name,
    legalName: settings.legal_name,
    tagline: settings.tagline,
    phone: settings.phone,
    phoneHref: `tel:${settings.phone_e164.replace(/-/g, "")}`,
    whatsapp: `https://wa.me/${digits}`,
    email: settings.email,
    /** Street address, as listed on the Google Business Profile. */
    address: [street, settings.address_postal_code].filter(Boolean).join(" "),
    hours: settings.hours,
    /** Google Business Profile share link - opens the listing with reviews and directions. */
    googleMapsUrl: settings.google_maps_url,
    /** Keyless Google Maps embed, resolved from the business name above. */
    googleMapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
      placeQuery
    )}&output=embed`,
    /**
     * Public profiles, in the order they are shown in the footer. Stored without
     * the tracking parameters (igsh, utm_*) the share sheets append - those are
     * tied to one share and are noise in a permanent link.
     */
    social: {
      instagram: settings.social_instagram,
      facebook: settings.social_facebook,
      linkedin: settings.social_linkedin,
      tiktok: settings.social_tiktok,
    },
    /** Directions deep link, works on both desktop and mobile. */
    googleDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      placeQuery
    )}`,
  };
}

/**
 * The build-time fallback.
 *
 * Components should read `useCompany()` instead, so admin edits appear without
 * a redeploy. This export remains for modules that run outside React.
 */
export const COMPANY = buildCompany(DEFAULT_COMPANY_SETTINGS);

/** Options offered in the About page contact form. */
export const SUBJECT_OPTIONS = [
  "German Language Course",
  "IELTS / Spoken English",
  "Quran, Arabic or Persian",
  "Study Abroad Counselling",
  "Ausbildung in Germany",
  "Other",
];
