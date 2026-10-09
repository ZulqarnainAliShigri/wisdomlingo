import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Database,
  Download,
  Pencil,
  RefreshCw,
  RotateCcw,
  Save,
  SlidersHorizontal,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { DEFAULT_COMPANY_SETTINGS } from "../../config/site";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { errorMessage, formatDate } from "../../lib/utils";
import { RANGES } from "../../lib/analytics";
import { mapSubmission } from "../../lib/mappers";
import { useAuth } from "../../hooks/useAuth";
import { useCompanySettings } from "../../hooks/useCompany";
import { DashboardPrefs, useDashboardPrefs } from "../../hooks/useDashboardPrefs";
import { CompanySettings, Row } from "../../types";
import { Avatar } from "../ui/Avatar";
import { Spinner } from "../ui/Loader";
import { avatarUrl, displayName } from "./ProfileModal";

/** Tables the dashboard depends on, checked one by one so a missing migration is obvious. */
const TABLES = [
  { name: "courses", label: "Courses" },
  { name: "study_countries", label: "Destinations" },
  { name: "apprenticeships", label: "Ausbildung" },
  { name: "contact_submissions", label: "Messages" },
  { name: "seo_settings", label: "SEO settings" },
  { name: "company_settings", label: "Business details" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface TableStatus {
  name: string;
  label: string;
  ok: boolean;
  count: number | null;
  error?: string;
}

const Section: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ icon: Icon, title, hint, action, children }) => (
  <section className="rounded-2xl border border-slate-200 p-4 sm:p-5">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </h2>
        {hint && <p className="mt-0.5 text-xs sm:text-sm text-slate-500">{hint}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div className="mt-4 sm:mt-5">{children}</div>
  </section>
);

/** One labelled input in the business-details form. */
const Field: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  className?: string;
}> = ({ id, label, value, onChange, placeholder, hint, type = "text", className }) => (
  <div className={className}>
    <label className="label" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
    {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
  </div>
);

const GroupHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{children}</h3>
);

export const SettingsTab: React.FC<{ onEditProfile?: () => void; onBack?: () => void }> = ({
  onEditProfile,
  onBack,
}) => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useDashboardPrefs();
  const { settings: company, loading: companyLoading, reload: reloadCompany } = useCompanySettings();

  const [form, setForm] = useState<CompanySettings>(company);
  const [savingCompany, setSavingCompany] = useState(false);

  const [statuses, setStatuses] = useState<TableStatus[]>([]);
  const [checking, setChecking] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Follows the loaded row, and re-syncs after every successful save.
  useEffect(() => {
    setForm(company);
  }, [company]);

  const checkTables = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setStatuses([]);
      return;
    }
    setChecking(true);
    const results = await Promise.all(
      TABLES.map(async (table) => {
        // Deliberately not `head: true`: a HEAD request against a table that
        // does not exist comes back without a body, and supabase-js reports no
        // error - so a missing migration looked like an empty table. Asking for
        // one real row makes PostgREST return its 404 payload instead.
        const { count, error } = await supabase
          .from(table.name)
          .select("id", { count: "exact" })
          .limit(1);
        return error
          ? { ...table, ok: false, count: null, error: error.message }
          : { ...table, ok: true, count: count ?? 0 };
      })
    );
    setStatuses(results);
    setChecking(false);
  }, []);

  useEffect(() => {
    checkTables();
  }, [checkTables]);

  const updatePref = <K extends keyof DashboardPrefs>(key: K, value: DashboardPrefs[K]) =>
    setPrefs({ ...prefs, [key]: value });

  const setField = <K extends keyof CompanySettings>(field: K, value: CompanySettings[K]) =>
    setForm((current) => ({ ...current, [field]: value }));

  const toggleDay = (day: string) =>
    setForm((current) => ({
      ...current,
      // Kept in week order rather than click order, so the schema.org output is
      // stable no matter how the admin ticked the boxes.
      opening_days: DAYS.filter((name) =>
        current.opening_days.includes(name) ? name !== day : name === day
      ),
    }));

  const companyDirty = JSON.stringify({ ...form, updated_at: null })
    !== JSON.stringify({ ...company, updated_at: null });

  const saveCompany = async () => {
    if (!isSupabaseConfigured) {
      toast.error("Supabase is not connected, so business details cannot be saved.");
      return;
    }
    if (!form.name.trim()) {
      toast.error("The short name cannot be empty - it is used across the site.");
      return;
    }

    setSavingCompany(true);
    try {
      const text = (value: string) => value.trim();
      const { error } = await supabase.from("company_settings").upsert({
        id: true,
        name: text(form.name),
        legal_name: text(form.legal_name),
        tagline: text(form.tagline),
        phone: text(form.phone),
        phone_e164: text(form.phone_e164),
        email: text(form.email),
        address_street: text(form.address_street),
        address_locality: text(form.address_locality),
        address_region: text(form.address_region),
        address_postal_code: text(form.address_postal_code),
        address_country: text(form.address_country),
        // Empty boxes clear the pin rather than storing 0, which would place the
        // business off the coast of Africa.
        geo_latitude: Number.isFinite(Number(form.geo_latitude)) && form.geo_latitude !== null
          ? Number(form.geo_latitude)
          : null,
        geo_longitude: Number.isFinite(Number(form.geo_longitude)) && form.geo_longitude !== null
          ? Number(form.geo_longitude)
          : null,
        hours: text(form.hours),
        opening_days: form.opening_days,
        opening_opens: text(form.opening_opens),
        opening_closes: text(form.opening_closes),
        google_place_query: text(form.google_place_query),
        google_maps_url: text(form.google_maps_url),
        social_instagram: text(form.social_instagram),
        social_facebook: text(form.social_facebook),
        social_linkedin: text(form.social_linkedin),
        social_tiktok: text(form.social_tiktok),
      });
      if (error) throw error;

      await reloadCompany();
      toast.success("Business details saved. The website updates on the next page load.");
    } catch (error) {
      toast.error(errorMessage(error, "Could not save the business details."));
    } finally {
      setSavingCompany(false);
    }
  };

  const exportMessages = async () => {
    setExporting(true);
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const rows = ((data as Row[]) || []).map(mapSubmission);
      if (rows.length === 0) {
        toast.info("There are no enquiries to export yet.");
        return;
      }

      // Quotes are doubled and every field is quoted, so commas and newlines
      // inside a message cannot break the columns.
      const cell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
      const header = ["Name", "Email", "Phone", "Subject", "Message", "Read", "Received"];
      const csv = [
        header.join(","),
        ...rows.map((row) =>
          [
            cell(row.name),
            cell(row.email),
            cell(row.phone),
            cell(row.subject),
            cell(row.message),
            cell(row.is_read ? "yes" : "no"),
            cell(formatDate(row.created_at)),
          ].join(",")
        ),
      ].join("\r\n");

      // The BOM makes Excel open UTF-8 correctly instead of mangling accents.
      const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `wisdomlingo-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${rows.length} enquiries.`);
    } catch (error) {
      toast.error(errorMessage(error, "Could not export the enquiries."));
    } finally {
      setExporting(false);
    }
  };

  const numberValue = (value: number | null) => (value === null ? "" : String(value));
  const parseNumber = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  };

  return (
    <div className="space-y-6">
      {onBack && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-primary hover:bg-primary-50 hover:text-primary active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </button>
        </div>
      )}
      {/* Account */}
      <Section
        icon={UserRound}
        title="Account"
        hint="The single admin account that can edit this site."
      >
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-4">
          <Avatar src={avatarUrl(user)} name={displayName(user)} className="h-12 w-12 text-base" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{displayName(user)}</p>
            <p className="truncate text-xs text-slate-500">
              {user?.email ?? "admin@wisdomlingo.com"}
            </p>
          </div>
          <button type="button" onClick={onEditProfile} className="btn-ghost !py-2.5 text-sm">
            <UserRound className="h-4 w-4" /> Edit profile
          </button>
        </div>
        <p className="mt-2.5 text-xs text-slate-400">
          Your name, photo and password are changed in the profile dialog - also reachable from your
          photo in the top-right corner.
        </p>
      </Section>

      {/* Business details - editable, saved to company_settings */}
      <Section
        icon={Pencil}
        title="Business details"
        hint="Shown across the website and in the structured data Google reads."
        action={
          <div className="flex gap-2">
            {companyDirty && (
              <button
                type="button"
                onClick={() => setForm(company)}
                className="btn-ghost !py-2.5 text-sm"
              >
                <RotateCcw className="h-4 w-4" /> Discard
              </button>
            )}
            <button
              type="button"
              onClick={saveCompany}
              disabled={savingCompany || companyLoading || !companyDirty || !isSupabaseConfigured}
              className="btn-primary !py-2.5 text-sm"
            >
              {savingCompany ? <Spinner /> : <Save className="h-4 w-4" />}
              Save changes
            </button>
          </div>
        }
      >
        <div className="space-y-7">
          <div>
            <GroupHeading>Identity</GroupHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="company-name"
                label="Short name"
                value={form.name}
                onChange={(value) => setField("name", value)}
                placeholder="WisdomLingo"
                hint="Used in the footer, the WhatsApp greeting and the logo alt text."
              />
              <Field
                id="company-tagline"
                label="Tagline"
                value={form.tagline}
                onChange={(value) => setField("tagline", value)}
                placeholder="Learn. Travel. Achieve."
              />
              <Field
                id="company-legal-name"
                label="Full legal name"
                value={form.legal_name}
                onChange={(value) => setField("legal_name", value)}
                placeholder="Wisdomlingo German Language Academy and Consultancy"
                hint="The name Google shows for the business listing."
                className="sm:col-span-2"
              />
            </div>
          </div>

          <div>
            <GroupHeading>Contact</GroupHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="company-phone"
                label="Phone (as displayed)"
                value={form.phone}
                onChange={(value) => setField("phone", value)}
                placeholder="03118526814"
              />
              <Field
                id="company-phone-e164"
                label="Phone (international)"
                value={form.phone_e164}
                onChange={(value) => setField("phone_e164", value)}
                placeholder="+92-311-8526814"
                hint="Call and WhatsApp links are built from this, so it must include the country code."
              />
              <Field
                id="company-email"
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setField("email", value)}
                placeholder="info@wisdomlingo.com"
                className="sm:col-span-2"
              />
            </div>
          </div>

          <div>
            <GroupHeading>Address</GroupHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="company-street"
                label="Street"
                value={form.address_street}
                onChange={(value) => setField("address_street", value)}
                placeholder="House 3A, Park Road, F-8/1"
                className="sm:col-span-2"
              />
              <Field
                id="company-locality"
                label="City"
                value={form.address_locality}
                onChange={(value) => setField("address_locality", value)}
                placeholder="Islamabad"
              />
              <Field
                id="company-region"
                label="Region"
                value={form.address_region}
                onChange={(value) => setField("address_region", value)}
                placeholder="Islamabad Capital Territory"
              />
              <Field
                id="company-postal"
                label="Postal code"
                value={form.address_postal_code}
                onChange={(value) => setField("address_postal_code", value)}
                placeholder="44000"
              />
              <Field
                id="company-country"
                label="Country code"
                value={form.address_country}
                onChange={(value) => setField("address_country", value)}
                placeholder="PK"
                hint="Two letters, e.g. PK."
              />
            </div>
          </div>

          <div>
            <GroupHeading>Map and opening hours</GroupHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="company-place-query"
                label="Google listing name"
                value={form.google_place_query}
                onChange={(value) => setField("google_place_query", value)}
                placeholder="Wisdomlingo German language Academy and consultancy"
                hint="Exactly as listed on Google - the embedded map resolves the pin from this."
                className="sm:col-span-2"
              />
              <Field
                id="company-maps-url"
                label="Google Maps link"
                value={form.google_maps_url}
                onChange={(value) => setField("google_maps_url", value)}
                placeholder="https://share.google/..."
                className="sm:col-span-2"
              />
              <Field
                id="company-lat"
                label="Latitude"
                value={numberValue(form.geo_latitude)}
                onChange={(value) => setField("geo_latitude", parseNumber(value))}
                placeholder="33.7102734"
              />
              <Field
                id="company-lng"
                label="Longitude"
                value={numberValue(form.geo_longitude)}
                onChange={(value) => setField("geo_longitude", parseNumber(value))}
                placeholder="73.0321496"
              />
              <Field
                id="company-hours"
                label="Opening hours (as displayed)"
                value={form.hours}
                onChange={(value) => setField("hours", value)}
                placeholder="Mon - Sat, 9:00 AM - 8:00 PM"
                hint="The sentence visitors read on the site."
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-4">
              <span className="label">Open on</span>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const active = form.opening_days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      aria-pressed={active}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                These, with the two times below, are what Google reads as your opening hours.
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                id="company-opens"
                label="Opens"
                type="time"
                value={form.opening_opens}
                onChange={(value) => setField("opening_opens", value)}
              />
              <Field
                id="company-closes"
                label="Closes"
                type="time"
                value={form.opening_closes}
                onChange={(value) => setField("opening_closes", value)}
              />
            </div>
          </div>

          <div>
            <GroupHeading>Social profiles</GroupHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="company-instagram"
                label="Instagram"
                value={form.social_instagram}
                onChange={(value) => setField("social_instagram", value)}
                placeholder="https://www.instagram.com/..."
              />
              <Field
                id="company-facebook"
                label="Facebook"
                value={form.social_facebook}
                onChange={(value) => setField("social_facebook", value)}
                placeholder="https://www.facebook.com/..."
              />
              <Field
                id="company-linkedin"
                label="LinkedIn"
                value={form.social_linkedin}
                onChange={(value) => setField("social_linkedin", value)}
                placeholder="https://www.linkedin.com/in/..."
              />
              <Field
                id="company-tiktok"
                label="TikTok"
                value={form.social_tiktok}
                onChange={(value) => setField("social_tiktok", value)}
                placeholder="https://www.tiktok.com/@..."
              />
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-start gap-2 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span>
            Saved changes appear on the website as soon as a visitor loads a page. The
            LocalBusiness markup Google reads is written into the static HTML at build time, so
            those tags update on the next deploy - run{" "}
            <code className="rounded bg-white px-1.5 py-0.5">npm run build</code> to refresh them.
          </span>
        </p>
      </Section>

      {/* Preferences */}
      <Section
        icon={SlidersHorizontal}
        title="Dashboard preferences"
        hint="Saved in this browser only, so each device can differ."
      >
        <div className="space-y-5">
          <div>
            <p className="label">Enquiries open on</p>
            <div className="inline-flex rounded-lg border border-slate-200 p-1">
              {RANGES.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => updatePref("defaultRange", option.key)}
                  aria-pressed={prefs.defaultRange === option.key}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    prefs.defaultRange === option.key
                      ? "bg-primary text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              The date range the Enquiries charts start on.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="settings-stale">
              Flag unread enquiries after
            </label>
            <div className="flex items-center gap-3">
              <input
                id="settings-stale"
                type="number"
                min={1}
                max={30}
                className="input !w-24"
                value={prefs.staleAfterDays}
                onChange={(event) =>
                  updatePref("staleAfterDays", Math.min(30, Math.max(1, Number(event.target.value) || 1)))
                }
              />
              <span className="text-sm text-slate-600">days</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Drives the &ldquo;waiting more than N days&rdquo; row in Needs attention.
            </p>
          </div>
        </div>
      </Section>

      {/* Data health */}
      <Section
        icon={Database}
        title="Connection &amp; data"
        hint="Whether the dashboard can reach each table it depends on."
        action={
          <button
            type="button"
            onClick={checkTables}
            disabled={checking}
            className="btn-ghost !py-2.5 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} /> Re-check
          </button>
        }
      >
        {!isSupabaseConfigured ? (
          <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            Supabase is not connected. Add the URL and anon key to{" "}
            <code>.env.local</code> and restart.
          </p>
        ) : (
          <ul className="space-y-2">
            {statuses.map((status) => (
              <li
                key={status.name}
                className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                  status.ok ? "border-slate-200" : "border-amber-200 bg-amber-50/60"
                }`}
              >
                {status.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-800">
                    {status.label}
                    <code className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-normal text-slate-500">
                      {status.name}
                    </code>
                  </span>
                  <span className="block text-xs text-slate-500">
                    {status.ok
                      ? `${status.count} ${status.count === 1 ? "row" : "rows"}`
                      : status.error}
                  </span>
                </span>
              </li>
            ))}
            {statuses.length === 0 && !checking && (
              <li className="text-sm text-slate-400">Nothing checked yet.</li>
            )}
          </ul>
        )}
      </Section>

      {/* Export */}
      <Section
        icon={Download}
        title="Export"
        hint="Take a copy of your enquiries for a spreadsheet or a backup."
      >
        <button
          type="button"
          onClick={exportMessages}
          disabled={exporting || !isSupabaseConfigured}
          className="btn-ghost w-full sm:w-auto"
        >
          {exporting ? <Spinner /> : <Download className="h-4 w-4" />}
          Download enquiries as CSV
        </button>
      </Section>

      <p className="px-1 text-xs text-slate-400">
        {form.name || DEFAULT_COMPANY_SETTINGS.name} admin -{" "}
        {statuses.filter((s) => s.ok).length}/{TABLES.length} tables reachable
      </p>
    </div>
  );
};
