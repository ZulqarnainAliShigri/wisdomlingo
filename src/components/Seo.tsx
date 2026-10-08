import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO_PAGES, resolveSeo, useSeoSettings } from "../hooks/useSeo";
import { SeoPageKey } from "../types";

/** Creates the tag on first use, then just updates its content. */
const setMeta = (selector: string, attrs: Record<string, string>) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${selector}]`);
  if (!tag) {
    tag = document.createElement("meta");
    const [name, value] = selector.split("=");
    tag.setAttribute(name, value.replace(/^["']|["']$/g, ""));
    document.head.appendChild(tag);
  }
  Object.entries(attrs).forEach(([key, value]) => tag!.setAttribute(key, value));
};

const setLink = (rel: string, href: string) => {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!href) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

/**
 * Applies the admin's SEO settings to <head> for one route.
 *
 * Note this runs in the browser. Googlebot renders JavaScript, so it does see
 * these tags - but link-preview crawlers (WhatsApp, Facebook, LinkedIn) do not
 * run JS and will fall back to whatever is in `public/index.html`. See the SEO
 * tab's note about pre-rendering.
 */
export const Seo: React.FC<{ page: SeoPageKey }> = ({ page }) => {
  const { settings } = useSeoSettings();
  const location = useLocation();

  useEffect(() => {
    const { title, description, noindex } = resolveSeo(settings, page);
    const path = SEO_PAGES.find((item) => item.key === page)?.path ?? location.pathname;
    const base = settings.site_url.replace(/\/+$/, "");
    const canonical = base ? `${base}${path === "/" ? "" : path}` : "";
    const image = settings.og_image_url
      ? settings.og_image_url
      : base
      ? `${base}/images/logo.png`
      : "";

    document.title = title;

    setMeta('name="description"', { content: description });
    if (settings.keywords.trim()) setMeta('name="keywords"', { content: settings.keywords });
    setMeta('name="robots"', { content: noindex ? "noindex, nofollow" : "index, follow" });

    if (settings.google_verification?.trim()) {
      setMeta('name="google-site-verification"', { content: settings.google_verification.trim() });
    }

    setMeta('property="og:type"', { content: "website" });
    setMeta('property="og:site_name"', { content: settings.site_name });
    setMeta('property="og:title"', { content: title });
    setMeta('property="og:description"', { content: description });
    if (canonical) setMeta('property="og:url"', { content: canonical });
    if (image) setMeta('property="og:image"', { content: image });

    setMeta('name="twitter:card"', { content: "summary_large_image" });
    setMeta('name="twitter:title"', { content: title });
    setMeta('name="twitter:description"', { content: description });
    if (image) setMeta('name="twitter:image"', { content: image });
    if (settings.twitter_handle?.trim()) {
      setMeta('name="twitter:site"', { content: settings.twitter_handle.trim() });
    }

    setLink("canonical", canonical);
  }, [settings, page, location.pathname]);

  return null;
};
