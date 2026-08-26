import { COMPANY } from "../config/site";
import { Apprenticeship, Course, StudyCountry } from "../types";

/**
 * schema.org builders for the content that actually lives in the database.
 *
 * Site-level schema (Organization, WebSite, LocalBusiness) is baked into the
 * static HTML by `scripts/prerender-seo.mjs` so non-JS crawlers see it. What is
 * built here is content-level schema that depends on live rows - Googlebot
 * renders JavaScript, so emitting it at runtime is fine for rich results.
 *
 * Nothing here invents data. A field is omitted rather than guessed, because
 * structured data that disagrees with the visible page is a manual-action risk.
 */

type Json = Record<string, unknown>;

const orgRef = (siteUrl: string): Json => ({
  "@type": "EducationalOrganization",
  name: COMPANY.legalName,
  ...(siteUrl ? { url: siteUrl } : {}),
});

const abs = (siteUrl: string, path: string) =>
  siteUrl ? `${siteUrl.replace(/\/+$/, "")}${path}` : undefined;

/**
 * Parses "PKR 15,000" into a price + currency. Anything it cannot read
 * confidently (ranges, "/ month", missing currency) returns null, so the offer
 * is left out instead of published wrong.
 */
export function parseFee(fee: string | null | undefined): { price: string; currency: string } | null {
  if (!fee) return null;
  const text = fee.trim();
  if (/[-–]|per\s|\/\s*(month|week|semester)/i.test(text)) return null;

  const currencyMatch = text.match(/\b(PKR|USD|EUR|GBP|SEK|CHF|TRY)\b/i) || text.match(/\b(Rs)\b/i);
  const amountMatch = text.match(/\d[\d,]*/);
  if (!currencyMatch || !amountMatch) return null;

  const raw = currencyMatch[1].toUpperCase();
  return {
    price: amountMatch[0].replace(/,/g, ""),
    currency: raw === "RS" ? "PKR" : raw,
  };
}

/** schema.org/Course - drives Google's course rich results. */
export function courseSchema(course: Course, siteUrl: string): Json {
  const offer = parseFee(course.fee);

  return {
    "@type": "Course",
    name: course.title,
    ...(course.description ? { description: course.description } : {}),
    provider: orgRef(siteUrl),
    ...(course.level ? { educationalLevel: course.level } : {}),
    ...(course.image_url ? { image: course.image_url } : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      // Batches run on campus and online; "blended" is the honest description.
      courseMode: "blended",
      ...(course.duration ? { courseWorkload: course.duration } : {}),
    },
    ...(offer
      ? {
          offers: {
            "@type": "Offer",
            price: offer.price,
            priceCurrency: offer.currency,
            category: "Paid",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

/** A numbered list of courses, so the set is understood as one collection. */
export function courseListSchema(courses: Course[], siteUrl: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Courses at WisdomLingo",
    numberOfItems: courses.length,
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: courseSchema(course, siteUrl),
    })),
  };
}

/** Destinations as a list of services rather than pretending they are products. */
export function destinationListSchema(countries: StudyCountry[], siteUrl: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Study abroad destinations",
    numberOfItems: countries.length,
    itemListElement: countries.map((country, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: `Study in ${country.name}`,
        ...(country.description ? { description: country.description } : {}),
        serviceType: "Study abroad counselling",
        provider: orgRef(siteUrl),
        areaServed: country.name,
      },
    })),
  };
}

export function apprenticeshipListSchema(items: Apprenticeship[], siteUrl: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Apprenticeship fields",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: item.title,
        ...(item.description ? { description: item.description } : {}),
        provider: orgRef(siteUrl),
        occupationalCategory: item.field,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "onsite",
          ...(item.duration ? { courseWorkload: item.duration } : {}),
        },
      },
    })),
  };
}

/** Breadcrumbs give Google the path shown under the result title. */
export function breadcrumbSchema(
  trail: { name: string; path: string }[],
  siteUrl: string
): Json | null {
  if (!siteUrl || trail.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: abs(siteUrl, step.path),
    })),
  };
}
