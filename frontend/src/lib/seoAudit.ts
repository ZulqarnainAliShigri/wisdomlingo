/**
 * On-page SEO analysis.
 *
 * This does not model what a page probably contains - it reads the real rendered
 * DOM of the live page (loaded same-origin in a hidden iframe) and measures it.
 * So the results move when the content moves, and a passing check means the
 * published page actually passes.
 *
 * Everything here is advisory. These are the on-page signals Google documents as
 * relevant; none of them buys a position, and no tool can promise one.
 */

export type AuditStatus = "pass" | "warn" | "fail";

export interface AuditCheck {
  id: string;
  label: string;
  status: AuditStatus;
  detail: string;
  /** Failing this costs more than failing a nice-to-have. */
  weight: number;
}

export interface AuditStats {
  words: number;
  headings: { h1: number; h2: number; h3: number };
  internalLinks: number;
  externalLinks: number;
  images: number;
  imagesMissingAlt: number;
  density: number;
  occurrences: number;
}

export interface AuditResult {
  checks: AuditCheck[];
  stats: AuditStats;
  /** 0-100, weighted. */
  score: number;
}

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[‘’“”]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

/** Non-overlapping occurrences of a phrase. */
function countPhrase(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

/** Strips the chrome that appears on every page so it cannot skew word counts. */
function readableText(root: HTMLElement): string {
  const clone = root.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll("script, style, noscript, nav, header, footer, svg")
    .forEach((node) => node.remove());
  return normalise(clone.textContent ?? "");
}

export interface AuditInput {
  keyword: string;
  title: string;
  description: string;
  /** Route path, e.g. "/study-abroad". */
  path: string;
  doc: Document;
}

export function auditPage({ keyword, title, description, path, doc }: AuditInput): AuditResult {
  const key = normalise(keyword);
  const main = (doc.querySelector("main") as HTMLElement | null) ?? doc.body;

  const body = readableText(main);
  const words = countWords(body);
  const occurrences = countPhrase(body, key);
  const keywordWords = key ? key.split(" ").length : 1;
  const density = words > 0 ? (occurrences * keywordWords * 100) / words : 0;

  const h1s = Array.from(main.querySelectorAll("h1"));
  const h2s = Array.from(main.querySelectorAll("h2"));
  const h3s = Array.from(main.querySelectorAll("h3"));

  const anchors = Array.from(main.querySelectorAll("a[href]")) as HTMLAnchorElement[];
  const internalLinks = anchors.filter((a) => {
    const href = a.getAttribute("href") ?? "";
    return href.startsWith("/") || href.startsWith(doc.location.origin);
  });
  const externalLinks = anchors.filter((a) => {
    const href = a.getAttribute("href") ?? "";
    return /^https?:\/\//i.test(href) && !href.startsWith(doc.location.origin);
  });

  const images = Array.from(main.querySelectorAll("img")) as HTMLImageElement[];
  // A deliberately empty alt on a decorative image is correct, so only images
  // with no alt attribute at all are counted as missing.
  const imagesMissingAlt = images.filter((img) => img.getAttribute("alt") === null);

  const firstChunk = body.slice(0, Math.max(200, Math.floor(body.length * 0.15)));

  const checks: AuditCheck[] = [];
  const add = (
    id: string,
    label: string,
    status: AuditStatus,
    detail: string,
    weight = 1
  ) => checks.push({ id, label, status, detail, weight });

  if (!key) {
    add("keyword", "Focus keyword set", "fail", "Add the phrase you want this page to rank for.", 3);
  } else {
    add("keyword", "Focus keyword set", "pass", `Targeting "${keyword.trim()}".`, 3);

    add(
      "title",
      "Keyword in the page title",
      normalise(title).includes(key) ? "pass" : "fail",
      normalise(title).includes(key)
        ? "The title contains it."
        : "The title is the strongest on-page signal - work the phrase in naturally.",
      3
    );

    add(
      "description",
      "Keyword in the meta description",
      normalise(description).includes(key) ? "pass" : "warn",
      normalise(description).includes(key)
        ? "The description contains it."
        : "Google bolds matching words in results, which lifts click-through.",
      2
    );

    add(
      "slug",
      "Keyword in the URL",
      normalise(path.replace(/[-/]/g, " ")).includes(key) ? "pass" : "warn",
      normalise(path.replace(/[-/]/g, " ")).includes(key)
        ? `The path ${path} contains it.`
        : `The path is ${path}. Changing a live URL costs you existing rankings, so only do this on a new page.`,
      1
    );

    const h1Text = normalise(h1s.map((node) => node.textContent ?? "").join(" "));
    add(
      "h1-keyword",
      "Keyword in the H1",
      h1Text.includes(key) ? "pass" : "fail",
      h1Text.includes(key)
        ? "The main heading contains it."
        : h1s.length === 0
        ? "This page has no H1 at all."
        : `The H1 reads "${(h1s[0].textContent ?? "").trim().slice(0, 70)}".`,
      2
    );

    add(
      "intro",
      "Keyword appears early",
      firstChunk.includes(key) ? "pass" : "warn",
      firstChunk.includes(key)
        ? "It shows up in the opening content."
        : "Put it in the first paragraph so the topic is obvious immediately.",
      2
    );

    const densityOk = density >= 0.4 && density <= 2.5;
    add(
      "density",
      "Keyword density 0.4-2.5%",
      occurrences === 0 ? "fail" : densityOk ? "pass" : "warn",
      occurrences === 0
        ? "The phrase never appears in the page body."
        : `${occurrences} ${occurrences === 1 ? "use" : "uses"} in ${words} words (${density.toFixed(
            2
          )}%). ${density > 2.5 ? "That reads as stuffing - cut some." : densityOk ? "" : "A little thin."}`.trim(),
      2
    );

    const h2Text = normalise(h2s.map((node) => node.textContent ?? "").join(" "));
    add(
      "h2-keyword",
      "Keyword in a subheading",
      h2Text.includes(key) ? "pass" : "warn",
      h2Text.includes(key)
        ? "At least one H2 contains it."
        : `${h2s.length} subheadings, none using the phrase.`,
      1
    );
  }

  add(
    "h1-single",
    "Exactly one H1",
    h1s.length === 1 ? "pass" : "fail",
    h1s.length === 1 ? "One main heading, as it should be." : `Found ${h1s.length}.`,
    2
  );

  add(
    "length",
    "At least 300 words",
    words >= 600 ? "pass" : words >= 300 ? "warn" : "fail",
    `${words} words. ${
      words >= 600
        ? "Enough depth to compete."
        : words >= 300
        ? "Usable, but thin pages rarely outrank detailed ones."
        : "Too thin to rank for anything competitive."
    }`,
    3
  );

  add(
    "internal-links",
    "Links to your other pages",
    internalLinks.length >= 3 ? "pass" : "warn",
    `${internalLinks.length} internal ${internalLinks.length === 1 ? "link" : "links"}. These spread authority around your own site.`,
    1
  );

  add(
    "images",
    "Every image has alt text",
    images.length === 0 ? "warn" : imagesMissingAlt.length === 0 ? "pass" : "fail",
    images.length === 0
      ? "No images on this page."
      : imagesMissingAlt.length === 0
      ? `All ${images.length} images are described.`
      : `${imagesMissingAlt.length} of ${images.length} images have no alt attribute.`,
    1
  );

  const earned = checks.reduce(
    (sum, check) => sum + (check.status === "pass" ? check.weight : check.status === "warn" ? check.weight * 0.5 : 0),
    0
  );
  const total = checks.reduce((sum, check) => sum + check.weight, 0);

  return {
    checks,
    stats: {
      words,
      headings: { h1: h1s.length, h2: h2s.length, h3: h3s.length },
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      images: images.length,
      imagesMissingAlt: imagesMissingAlt.length,
      density,
      occurrences,
    },
    score: total > 0 ? Math.round((earned / total) * 100) : 0,
  };
}
