/**
 * Post-build SEO pass.
 *
 * The problem it solves: this is a client-rendered React app, so every route is
 * served the same `index.html` with the same title and meta tags. Googlebot runs
 * JavaScript and eventually sees the real tags, but link-preview crawlers
 * (WhatsApp, Facebook, LinkedIn, Slack) do not run JS at all, and a crawler that
 * has to render a page spends more of its budget per URL.
 *
 * So after the bundle is built, this writes a real HTML file per route with that
 * page's title, description, canonical, Open Graph tags and structured data
 * already in the markup. React still hydrates and takes over on load.
 *
 * Cloudflare Pages serves a matching static file before falling back to the
 * `/*  /index.html  200` rule in `public/_redirects`, so `/courses` gets
 * `build/courses/index.html` and deeper client routes still work.
 *
 * Values come from the `seo_settings` row the admin edits. If Supabase is not
 * reachable the built-in defaults are used and the script says so.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const BUILD = path.join(ROOT, "build");

const company = JSON.parse(await readFile(path.join(ROOT, "src/config/company.json"), "utf8"));

/* ------------------------------------------------------------------ config */

const ROUTES = [
  { key: "home", path: "/", label: "Home" },
  { key: "courses", path: "/courses", label: "Courses" },
  { key: "studyAbroad", path: "/study-abroad", label: "Study Abroad" },
  { key: "apprenticeships", path: "/apprenticeships", label: "Apprenticeships" },
  { key: "about", path: "/about", label: "About" },
];

const DEFAULTS = {
  site_name: company.name,
  site_url: "",
  title_template: `%s | ${company.name}`,
  default_description:
    "WisdomLingo - German language courses (A1 to C2), IELTS and spoken English, study abroad counselling for six European countries, and paid apprenticeships in Germany.",
  keywords: "",
  og_image_url: null,
  twitter_handle: null,
  google_verification: null,
  pages: {},
};

/* ------------------------------------------------------------------ helpers */

/** Minimal KEY=VALUE reader - the CLI has no dotenv and this only needs two keys. */
async function readEnv() {
  const env = { ...process.env };
  for (const file of [".env.local", ".env"]) {
    const full = path.join(ROOT, file);
    if (!existsSync(full)) continue;
    const text = await readFile(full, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (match && !line.trimStart().startsWith("#")) {
        const [, key, rawValue] = match;
        if (env[key] === undefined) env[key] = rawValue.replace(/^["']|["']$/g, "");
      }
    }
  }
  return env;
}

async function fetchSeoSettings(env) {
  const url = env.REACT_APP_SUPABASE_URL;
  const key = env.REACT_APP_SUPABASE_ANON_KEY;
  if (!url || !key) return { settings: DEFAULTS, source: "defaults (no Supabase credentials)" };

  try {
    const response = await fetch(`${url}/rest/v1/seo_settings?select=*&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return { settings: DEFAULTS, source: "defaults (seo_settings row is empty)" };
    }
    return { settings: { ...DEFAULTS, ...rows[0] }, source: "Supabase seo_settings" };
  } catch (error) {
    return { settings: DEFAULTS, source: `defaults (${error.message})` };
  }
}

const escapeAttr = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** `</` inside a JSON-LD block would close the script tag early. */
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

function resolvePage(settings, key) {
  const override = settings.pages?.[key] ?? {};
  const rawTitle = (override.title ?? "").trim();
  const template = settings.title_template?.includes("%s")
    ? settings.title_template
    : `%s | ${settings.site_name}`;

  return {
    title: rawTitle ? template.replace("%s", rawTitle) : settings.site_name,
    description: (override.description ?? "").trim() || settings.default_description,
    noindex: Boolean(override.noindex),
  };
}

/* ------------------------------------------------- site-level structured data */

function siteSchema(settings, siteUrl) {
  const logo = siteUrl ? `${siteUrl}/images/logo.png` : undefined;

  const organisation = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": siteUrl ? `${siteUrl}/#organization` : undefined,
    name: company.legalName,
    alternateName: company.name,
    description: settings.default_description,
    ...(siteUrl ? { url: siteUrl } : {}),
    ...(logo ? { logo, image: logo } : {}),
    telephone: company.phoneE164,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.locality,
      addressRegion: company.address.region,
      postalCode: company.address.postalCode,
      addressCountry: company.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: company.geo.latitude,
      longitude: company.geo.longitude,
    },
    areaServed: company.address.country,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: company.openingHours.days,
        opens: company.openingHours.opens,
        closes: company.openingHours.closes,
      },
    ],
    hasMap: company.googleMapsUrl,
    sameAs: [company.googleMapsUrl],
  };

  // WebSite tells Google the site's name for the result header.
  const website = siteUrl
    ? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: settings.site_name,
        publisher: { "@id": `${siteUrl}/#organization` },
      }
    : null;

  return [organisation, website].filter(Boolean);
}

function breadcrumbSchema(route, siteUrl) {
  if (!siteUrl || route.path === "/") return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: route.label, item: `${siteUrl}${route.path}` },
    ],
  };
}

/* --------------------------------------------------------------- head build */

/** Strips the tags this script owns, so re-running never leaves duplicates. */
function stripManagedTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta[^>]*\bname="description"[^>]*>/gi, "")
    .replace(/<meta[^>]*\bname="keywords"[^>]*>/gi, "")
    .replace(/<meta[^>]*\bname="robots"[^>]*>/gi, "")
    .replace(/<meta[^>]*\bname="google-site-verification"[^>]*>/gi, "")
    .replace(/<meta[^>]*\bproperty="og:[^"]*"[^>]*>/gi, "")
    .replace(/<meta[^>]*\bname="twitter:[^"]*"[^>]*>/gi, "")
    .replace(/<link[^>]*\brel="canonical"[^>]*>/gi, "")
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "");
}

function buildHead(settings, route, siteUrl) {
  const { title, description, noindex } = resolvePage(settings, route.key);
  const canonical = siteUrl ? `${siteUrl}${route.path === "/" ? "/" : route.path}` : "";
  const image = settings.og_image_url || (siteUrl ? `${siteUrl}/images/logo.png` : "");

  const tags = [
    `<title>${escapeAttr(title)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
  ];

  if (settings.keywords?.trim()) {
    tags.push(`<meta name="keywords" content="${escapeAttr(settings.keywords.trim())}" />`);
  }
  tags.push(
    `<meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow"}" />`
  );
  if (settings.google_verification?.trim()) {
    tags.push(
      `<meta name="google-site-verification" content="${escapeAttr(
        settings.google_verification.trim()
      )}" />`
    );
  }
  if (canonical) tags.push(`<link rel="canonical" href="${escapeAttr(canonical)}" />`);

  tags.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(settings.site_name)}" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`
  );
  if (canonical) tags.push(`<meta property="og:url" content="${escapeAttr(canonical)}" />`);
  if (image) tags.push(`<meta property="og:image" content="${escapeAttr(image)}" />`);

  tags.push(
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`
  );
  if (image) tags.push(`<meta name="twitter:image" content="${escapeAttr(image)}" />`);
  if (settings.twitter_handle?.trim()) {
    tags.push(`<meta name="twitter:site" content="${escapeAttr(settings.twitter_handle.trim())}" />`);
  }

  for (const block of siteSchema(settings, siteUrl)) {
    tags.push(`<script type="application/ld+json">${jsonLd(block)}</script>`);
  }
  const crumbs = breadcrumbSchema(route, siteUrl);
  if (crumbs) tags.push(`<script type="application/ld+json">${jsonLd(crumbs)}</script>`);

  return tags.join("\n    ");
}

/* --------------------------------------------------------------- sitemap */

function buildSitemap(settings, siteUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = ROUTES.filter((route) => !settings.pages?.[route.key]?.noindex)
    .map((route) => {
      const loc = `${siteUrl}${route.path === "/" ? "/" : route.path}`;
      const priority = route.path === "/" ? "1.0" : route.key === "about" ? "0.7" : "0.9";
      const changefreq = route.key === "about" ? "monthly" : "weekly";
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

const buildRobots = (siteUrl) => `# Generated by scripts/prerender-seo.mjs
User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml
`;

/* ------------------------------------------------------------------ main */

async function main() {
  if (!existsSync(path.join(BUILD, "index.html"))) {
    console.error("[seo] build/index.html not found - run `npm run build` first.");
    process.exit(1);
  }

  const env = await readEnv();
  const { settings, source } = await fetchSeoSettings(env);
  const siteUrl = (settings.site_url || "").trim().replace(/\/+$/, "");

  console.log(`[seo] settings from: ${source}`);
  if (!siteUrl) {
    console.warn(
      "[seo] site_url is empty - canonical links, og:url and the sitemap will be skipped.\n" +
        "      Set it in the dashboard under SEO > Site-wide settings, then rebuild."
    );
  }

  const template = await readFile(path.join(BUILD, "index.html"), "utf8");
  const stripped = stripManagedTags(template);

  for (const route of ROUTES) {
    const head = buildHead(settings, route, siteUrl);
    const html = stripped.replace(/<\/head>/i, `    ${head}\n  </head>`);

    const target =
      route.path === "/"
        ? path.join(BUILD, "index.html")
        : path.join(BUILD, route.path.replace(/^\//, ""), "index.html");

    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html, "utf8");
    console.log(`[seo] wrote ${path.relative(ROOT, target)}`);
  }

  if (siteUrl) {
    await writeFile(path.join(BUILD, "sitemap.xml"), buildSitemap(settings, siteUrl), "utf8");
    await writeFile(path.join(BUILD, "robots.txt"), buildRobots(siteUrl), "utf8");
    console.log("[seo] wrote build/sitemap.xml and build/robots.txt");
  }

  console.log("[seo] done.");
}

main().catch((error) => {
  console.error("[seo] failed:", error);
  process.exit(1);
});
