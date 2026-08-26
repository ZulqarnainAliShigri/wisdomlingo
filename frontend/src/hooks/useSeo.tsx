import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Row, SeoPageKey, SeoPageOverride, SeoSettings } from "../types";

/** Used until the row loads, and whenever Supabase is unavailable. */
export const DEFAULT_SEO: SeoSettings = {
  site_name: "WisdomLingo",
  site_url: "",
  title_template: "%s | WisdomLingo",
  default_description:
    "WisdomLingo - German language courses (A1 to C2), IELTS and spoken English, study abroad counselling for six European countries, and paid apprenticeships in Germany.",
  keywords: "German language course, Ausbildung, study abroad, IELTS, Goethe exam, WisdomLingo",
  og_image_url: null,
  twitter_handle: null,
  google_verification: null,
  pages: {},
};

/** Labels and paths for the routes the SEO tab can tune. */
export const SEO_PAGES: { key: SeoPageKey; label: string; path: string }[] = [
  { key: "home", label: "Home", path: "/" },
  { key: "courses", label: "Courses", path: "/courses" },
  { key: "studyAbroad", label: "Study Abroad", path: "/study-abroad" },
  { key: "apprenticeships", label: "Apprenticeships", path: "/apprenticeships" },
  { key: "about", label: "About", path: "/about" },
];

export const mapSeo = (row: Row): SeoSettings => ({
  site_name: row.site_name ?? DEFAULT_SEO.site_name,
  site_url: (row.site_url ?? "").replace(/\/+$/, ""),
  title_template: row.title_template || DEFAULT_SEO.title_template,
  default_description: row.default_description ?? "",
  keywords: row.keywords ?? "",
  og_image_url: row.og_image_url ?? null,
  twitter_handle: row.twitter_handle ?? null,
  google_verification: row.google_verification ?? null,
  pages: (row.pages ?? {}) as Partial<Record<SeoPageKey, SeoPageOverride>>,
  updated_at: row.updated_at ?? undefined,
});

interface SeoContextValue {
  settings: SeoSettings;
  loading: boolean;
  reload: () => Promise<void>;
}

const SeoContext = createContext<SeoContextValue>({
  settings: DEFAULT_SEO,
  loading: false,
  reload: async () => undefined,
});

/**
 * Loads the single settings row once and shares it with every page, so five
 * routes do not each fire their own request.
 */
export const SeoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SeoSettings>(DEFAULT_SEO);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("seo_settings").select("*").maybeSingle();
    // A missing table or row is not worth a toast on the public site - the
    // defaults above already produce valid tags.
    if (!error && data) setSettings(mapSeo(data as Row));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(() => ({ settings, loading, reload }), [settings, loading, reload]);

  return <SeoContext.Provider value={value}>{children}</SeoContext.Provider>;
};

export const useSeoSettings = (): SeoContextValue => useContext(SeoContext);

/** The final title/description/robots for one route, after overrides. */
export function resolveSeo(settings: SeoSettings, page: SeoPageKey) {
  const override = settings.pages?.[page];
  const rawTitle = override?.title?.trim();
  const template = settings.title_template?.includes("%s")
    ? settings.title_template
    : `%s | ${settings.site_name}`;

  return {
    // With no page title of its own, use the site name alone - running the
    // template over it would produce "WisdomLingo | WisdomLingo".
    title: rawTitle ? template.replace("%s", rawTitle) : settings.site_name,
    description: override?.description?.trim() || settings.default_description,
    noindex: Boolean(override?.noindex),
  };
}
