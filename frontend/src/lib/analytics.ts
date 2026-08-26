/**
 * Pure helpers that turn raw table rows into the series the dashboard charts read.
 * No Supabase and no React in here, so the bucketing stays easy to reason about.
 */

export type RangeKey = "30d" | "12w" | "12m";

export interface RangeOption {
  key: RangeKey;
  label: string;
  /** How many buckets the chart shows. */
  buckets: number;
  unit: "day" | "week" | "month";
  /** Used in the "vs previous ..." delta caption. */
  previousLabel: string;
}

export const RANGES: RangeOption[] = [
  { key: "30d", label: "30 days", buckets: 30, unit: "day", previousLabel: "previous 30 days" },
  { key: "12w", label: "12 weeks", buckets: 12, unit: "week", previousLabel: "previous 12 weeks" },
  { key: "12m", label: "12 months", buckets: 12, unit: "month", previousLabel: "previous 12 months" },
];

export interface Bucket {
  key: string;
  /** Short axis label, e.g. "5 Aug". */
  label: string;
  /** Fuller label for tooltips, e.g. "Week of 5 Aug 2026". */
  fullLabel: string;
  start: Date;
  end: Date;
  value: number;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Weeks start on Monday. */
const startOfWeek = (d: Date) => addDays(startOfDay(d), -((startOfDay(d).getDay() + 6) % 7));

const dayMonth = (d: Date) => d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
const fullDay = (d: Date) =>
  d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

/** The empty buckets for a range, oldest first, ending with the period containing `now`. */
export function buildBuckets(range: RangeKey, now: Date = new Date()): Bucket[] {
  const option = RANGES.find((item) => item.key === range) ?? RANGES[0];
  const out: Bucket[] = [];

  for (let i = option.buckets - 1; i >= 0; i -= 1) {
    let start: Date;
    let end: Date;
    let label: string;
    let fullLabel: string;

    if (option.unit === "day") {
      start = addDays(startOfDay(now), -i);
      end = addDays(start, 1);
      label = dayMonth(start);
      fullLabel = fullDay(start);
    } else if (option.unit === "week") {
      start = addDays(startOfWeek(now), -i * 7);
      end = addDays(start, 7);
      label = dayMonth(start);
      fullLabel = `Week of ${fullDay(start)}`;
    } else {
      start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      label = start.toLocaleDateString(undefined, { month: "short" });
      fullLabel = start.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    }

    out.push({ key: start.toISOString(), label, fullLabel, start, end, value: 0 });
  }

  return out;
}

/** Counts each timestamp into the bucket that contains it. Rows outside the window are ignored. */
export function tallyIntoBuckets(buckets: Bucket[], isoDates: string[]): Bucket[] {
  const out = buckets.map((bucket) => ({ ...bucket, value: 0 }));

  isoDates.forEach((iso) => {
    const time = new Date(iso).getTime();
    if (Number.isNaN(time)) return;
    const hit = out.find((bucket) => time >= bucket.start.getTime() && time < bucket.end.getTime());
    if (hit) hit.value += 1;
  });

  return out;
}

/** How many rows fell in the equally long window immediately before these buckets. */
export function countInPreviousWindow(buckets: Bucket[], isoDates: string[]): number {
  if (buckets.length === 0) return 0;
  const start = buckets[0].start.getTime();
  const span = buckets[buckets.length - 1].end.getTime() - start;

  return isoDates.filter((iso) => {
    const time = new Date(iso).getTime();
    return !Number.isNaN(time) && time >= start - span && time < start;
  }).length;
}

export interface Slice {
  label: string;
  value: number;
}

/**
 * Counts occurrences of a label, biggest first. Anything past `limit` folds into
 * "Other" rather than growing the category count.
 */
export function tallyLabels(
  values: (string | null | undefined)[],
  limit = 6,
  fallback = "Not specified"
): Slice[] {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const key = value && value.trim() ? value.trim() : fallback;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  const rows = Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));

  if (rows.length <= limit) return rows;

  const head = rows.slice(0, limit - 1);
  const rest = rows.slice(limit - 1).reduce((sum, row) => sum + row.value, 0);
  return [...head, { label: "Other", value: rest }];
}

/** Whole days between `iso` and now. Negative timestamps and bad input give 0. */
export function daysSince(iso: string, now: Date = new Date()): number {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return 0;
  return Math.max(0, Math.floor((now.getTime() - time) / 86_400_000));
}

/** Percentage change, or null when there is no baseline to compare against. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Rounds an axis maximum up to a clean step, kept even so the midpoint tick is a
 * whole number too (counts are integers - "2.5 enquiries" would be nonsense).
 */
export function niceMax(value: number, floor = 4): number {
  const target = Math.max(Math.ceil(value), floor);
  const magnitude = Math.pow(10, Math.floor(Math.log10(target)));
  const candidate =
    [1, 2, 4, 5, 10].map((step) => step * magnitude).find((step) => step >= target) ??
    10 * magnitude;
  return candidate % 2 === 0 ? candidate : candidate + magnitude;
}
