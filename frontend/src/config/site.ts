// Company details shown across the site.
//
// The facts live in company.json so the post-build SEO script can read the same
// values when it bakes LocalBusiness structured data into the static HTML.

import company from "./company.json";

/** Exactly as the business is listed on Google, so the map pin resolves correctly. */
const GOOGLE_PLACE_QUERY = company.googlePlaceQuery;

export const COMPANY = {
  name: company.name,
  legalName: company.legalName,
  tagline: company.tagline,
  phone: company.phone,
  phoneHref: `tel:${company.phoneE164.replace(/-/g, "")}`,
  whatsapp: `https://wa.me/${company.phoneE164.replace(/[^\d]/g, "")}`,
  email: company.email,
  /** Street address, as listed on the Google Business Profile. */
  address: `${company.address.street}, ${company.address.locality} ${company.address.postalCode}`,
  hours: company.hours,
  /** Google Business Profile share link - opens the listing with reviews and directions. */
  googleMapsUrl: company.googleMapsUrl,
  /** Keyless Google Maps embed, resolved from the business name above. */
  googleMapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
    GOOGLE_PLACE_QUERY
  )}&output=embed`,
  /** Directions deep link, works on both desktop and mobile. */
  googleDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    GOOGLE_PLACE_QUERY
  )}`,
};

/** Options offered in the About page contact form. */
export const SUBJECT_OPTIONS = [
  "German Language Course",
  "IELTS / Spoken English",
  "Quran, Arabic or Persian",
  "Study Abroad Counselling",
  "Apprenticeship (Ausbildung)",
  "Other",
];
