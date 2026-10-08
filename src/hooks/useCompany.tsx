import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Company, DEFAULT_COMPANY_SETTINGS, buildCompany } from "../config/site";
import { CompanySettings, Row } from "../types";

/** Fills gaps in a row with the bundled defaults, so a null column never renders "null". */
export const mapCompany = (row: Row): CompanySettings => {
  const text = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim() ? value : fallback;
  const base = DEFAULT_COMPANY_SETTINGS;

  return {
    name: text(row.name, base.name),
    legal_name: text(row.legal_name, base.legal_name),
    tagline: text(row.tagline, base.tagline),
    phone: text(row.phone, base.phone),
    phone_e164: text(row.phone_e164, base.phone_e164),
    email: text(row.email, base.email),
    address_street: text(row.address_street, base.address_street),
    address_locality: text(row.address_locality, base.address_locality),
    address_region: text(row.address_region, base.address_region),
    address_postal_code: text(row.address_postal_code, base.address_postal_code),
    address_country: text(row.address_country, base.address_country),
    geo_latitude: row.geo_latitude ?? base.geo_latitude,
    geo_longitude: row.geo_longitude ?? base.geo_longitude,
    hours: text(row.hours, base.hours),
    opening_days: Array.isArray(row.opening_days) && row.opening_days.length
      ? row.opening_days
      : base.opening_days,
    opening_opens: text(row.opening_opens, base.opening_opens),
    opening_closes: text(row.opening_closes, base.opening_closes),
    google_place_query: text(row.google_place_query, base.google_place_query),
    google_maps_url: text(row.google_maps_url, base.google_maps_url),
    social_instagram: text(row.social_instagram, base.social_instagram),
    social_facebook: text(row.social_facebook, base.social_facebook),
    social_linkedin: text(row.social_linkedin, base.social_linkedin),
    social_tiktok: text(row.social_tiktok, base.social_tiktok),
    updated_at: row.updated_at ?? undefined,
  };
};

interface CompanyContextValue {
  /** Derived values every component renders - same shape as the old COMPANY constant. */
  company: Company;
  /** The raw editable row, for the Settings form. */
  settings: CompanySettings;
  loading: boolean;
  reload: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextValue>({
  company: buildCompany(DEFAULT_COMPANY_SETTINGS),
  settings: DEFAULT_COMPANY_SETTINGS,
  loading: false,
  reload: async () => undefined,
});

/**
 * Loads the single business-details row once and shares it with every page, so
 * the navbar, footer, contact blocks and maps do not each fire their own
 * request.
 */
export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_COMPANY_SETTINGS);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("company_settings").select("*").maybeSingle();
    // A missing table or row is not worth a toast on the public site - the
    // bundled defaults already render a complete, correct page.
    if (!error && data) setSettings(mapCompany(data as Row));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<CompanyContextValue>(
    () => ({ company: buildCompany(settings), settings, loading, reload }),
    [settings, loading, reload]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

export const useCompanySettings = (): CompanyContextValue => useContext(CompanyContext);

/** The derived company details - a drop-in replacement for the old COMPANY import. */
export const useCompany = (): Company => useContext(CompanyContext).company;
