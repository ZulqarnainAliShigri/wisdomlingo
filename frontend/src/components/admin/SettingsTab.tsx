import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  KeyRound,
  Pencil,
  RefreshCw,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import company from "../../config/company.json";
import { COMPANY } from "../../config/site";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { errorMessage, formatDate } from "../../lib/utils";
import { RANGES } from "../../lib/analytics";
import { mapSubmission } from "../../lib/mappers";
import { useAuth } from "../../hooks/useAuth";
import { DashboardPrefs, useDashboardPrefs } from "../../hooks/useDashboardPrefs";
import { Row } from "../../types";
import { Spinner } from "../ui/Loader";

/** Tables the dashboard depends on, checked one by one so a missing migration is obvious. */
const TABLES = [
  { name: "courses", label: "Courses" },
  { name: "study_countries", label: "Destinations" },
  { name: "apprenticeships", label: "Apprenticeships" },
  { name: "contact_submissions", label: "Messages" },
  { name: "seo_settings", label: "SEO settings" },
];

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
  <section className="rounded-2xl border border-slate-200 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </h2>
        {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      </div>
      {action}
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

export const SettingsTab: React.FC = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useDashboardPrefs();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [statuses, setStatuses] = useState<TableStatus[]>([]);
  const [checking, setChecking] = useState(false);
  const [exporting, setExporting] = useState(false);

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

  const changePassword = async () => {
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("The two passwords do not match.");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password changed. It applies the next time you sign in.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(errorMessage(error, "Could not change the password."));
    } finally {
      setChangingPassword(false);
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

  return (
    <div className="space-y-6">
      {/* Account */}
      <Section
        icon={KeyRound}
        title="Account"
        hint="The single admin account that can edit this site."
      >
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Signed in as
          </p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">
            {user?.email ?? "admin@wisdomlingo.com"}
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="settings-password">
              New password
            </label>
            <input
              id="settings-password"
              type="password"
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="label" htmlFor="settings-password-confirm">
              Confirm new password
            </label>
            <input
              id="settings-password-confirm"
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Type it again"
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={changePassword}
          disabled={changingPassword || !password || !isSupabaseConfigured}
          className="btn-primary mt-4 w-full sm:w-auto"
        >
          {changingPassword ? <Spinner /> : <KeyRound className="h-4 w-4" />}
          Change password
        </button>
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
            <code>frontend/.env.local</code> and restart.
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

      {/* Business details - read only, with the honest reason why */}
      <Section
        icon={Pencil}
        title="Business details"
        hint="Shown across the website and in the structured data Google reads."
      >
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {[
            ["Name", COMPANY.legalName],
            ["Phone", COMPANY.phone],
            ["Email", COMPANY.email],
            ["Address", COMPANY.address],
            ["Opening hours", COMPANY.hours],
            ["Tagline", COMPANY.tagline],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {label}
              </dt>
              <dd className="mt-0.5 text-sm text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span>
            These are not editable here yet. They are read from{" "}
            <code className="rounded bg-white px-1.5 py-0.5">
              frontend/src/config/company.json
            </code>{" "}
            at build time - the same file the SEO script uses to write your LocalBusiness markup, so
            the website and Google never disagree. Making them editable means moving them to the
            database and rewiring every page that shows them; ask and I will do it properly.
          </span>
        </p>
      </Section>

      <p className="px-1 text-xs text-slate-400">
        {company.name} admin - {statuses.filter((s) => s.ok).length}/{TABLES.length} tables reachable
      </p>
    </div>
  );
};
