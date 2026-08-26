import { useCallback, useEffect, useState } from "react";
import { RangeKey } from "../lib/analytics";

/**
 * Per-browser dashboard preferences.
 *
 * Kept in localStorage rather than the database: they are one admin's working
 * habits, not site content, and storing them locally avoids a migration and a
 * round trip on every dashboard load. Every access is guarded because private
 * windows and locked-down browsers can throw on read as well as write.
 */

export interface DashboardPrefs {
  /** Date range the Enquiries section opens on. */
  defaultRange: RangeKey;
  /** Days before an unread enquiry is flagged as waiting too long. */
  staleAfterDays: number;
}

export const DEFAULT_PREFS: DashboardPrefs = {
  defaultRange: "12w",
  staleAfterDays: 3,
};

const STORAGE_KEY = "wisdomlingo.dashboard.prefs";
/** Lets other mounted components pick up a change without a reload. */
const CHANGE_EVENT = "wisdomlingo:prefs";

const clampDays = (value: unknown): number => {
  const days = Number(value);
  if (!Number.isFinite(days)) return DEFAULT_PREFS.staleAfterDays;
  return Math.min(30, Math.max(1, Math.round(days)));
};

export function readPrefs(): DashboardPrefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<DashboardPrefs>;
    return {
      defaultRange: (["30d", "12w", "12m"] as RangeKey[]).includes(parsed.defaultRange as RangeKey)
        ? (parsed.defaultRange as RangeKey)
        : DEFAULT_PREFS.defaultRange,
      staleAfterDays: clampDays(parsed.staleAfterDays),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writePrefs(prefs: DashboardPrefs): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // Storage unavailable - the session keeps its in-memory values.
  }
}

export function useDashboardPrefs(): [DashboardPrefs, (next: DashboardPrefs) => void] {
  const [prefs, setPrefs] = useState<DashboardPrefs>(readPrefs);

  useEffect(() => {
    const sync = () => setPrefs(readPrefs());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((next: DashboardPrefs) => {
    setPrefs(next);
    writePrefs(next);
  }, []);

  return [prefs, update];
}
