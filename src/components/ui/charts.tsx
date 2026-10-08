import React, { useId, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Minus, Table2 } from "lucide-react";
import { Bucket, Slice, niceMax } from "../../lib/analytics";

/**
 * Chart ink.
 *
 * Checked with the data-viz palette validator against the white card surface these
 * charts sit on: `series` is inside the OKLCH lightness band, clears the chroma
 * floor and reads at 5.17:1; `muted` reads at 4.76:1, so the de-emphasised half of a
 * stacked bar stays legible on its own. Every chart here plots a single hue plus
 * that grey, so there is no categorical palette to keep colourblind-safe.
 */
export const CHART = {
  series: "#2563EB",
  seriesTrack: "#EFF4FF",
  muted: "#64748B",
  mutedSoft: "#94A3B8",
  grid: "#E2E8F0",
  good: "#047857",
  bad: "#DC2626",
};

/* ------------------------------------------------------------------ card */

interface TableRow {
  label: string;
  value: string | number;
}

/**
 * Card shell for a chart. When `tableRows` is supplied the card offers a table
 * view of the same numbers, so no value is reachable only by hovering.
 */
export const ChartCard: React.FC<{
  title: string;
  hint?: string;
  action?: React.ReactNode;
  tableRows?: TableRow[];
  tableHeaders?: [string, string];
  children: React.ReactNode;
  className?: string;
}> = ({ title, hint, action, tableRows, tableHeaders = ["", "Count"], children, className = "" }) => {
  const [showTable, setShowTable] = useState(false);

  return (
    <section className={`rounded-2xl border border-slate-200 p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          {tableRows && (
            <button
              type="button"
              onClick={() => setShowTable((value) => !value)}
              aria-pressed={showTable}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                showTable
                  ? "border-primary bg-primary-50 text-primary"
                  : "border-slate-200 text-slate-500 hover:text-slate-900"
              }`}
            >
              <Table2 className="h-3.5 w-3.5" /> Table
            </button>
          )}
        </div>
      </div>

      <div className="mt-5">
        {showTable && tableRows ? (
          <div className="max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-2 font-semibold">{tableHeaders[0]}</th>
                  <th className="py-2 text-right font-semibold">{tableHeaders[1]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableRows.map((row) => (
                  <tr key={row.label}>
                    <td className="py-2 text-slate-700">{row.label}</td>
                    <td className="py-2 text-right font-bold tabular-nums text-slate-900">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ delta */

/** Signed change against a named baseline. Icon + words, never colour alone. */
export const Delta: React.FC<{ percent: number | null; baseline: string }> = ({
  percent,
  baseline,
}) => {
  if (percent === null) {
    return <span className="text-xs text-slate-400">no {baseline} to compare</span>;
  }

  const Icon = percent > 0 ? ArrowUpRight : percent < 0 ? ArrowDownRight : Minus;
  const tone =
    percent > 0 ? "text-emerald-700" : percent < 0 ? "text-accent" : "text-slate-500";
  const word = percent > 0 ? "up" : percent < 0 ? "down" : "level";

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {word} {Math.abs(percent)}%
      <span className="font-normal text-slate-400">vs {baseline}</span>
    </span>
  );
};

/* ------------------------------------------------------------------ columns */

/**
 * Counts per period. Columns rather than a line because the values are discrete
 * counts and mostly small - a line between two integers implies a rate that is
 * not in the data.
 */
export const ColumnChart: React.FC<{
  buckets: Bucket[];
  noun?: string;
  height?: number;
}> = ({ buckets, noun = "enquiries", height = 190 }) => {
  const headingId = useId();
  const dataMax = buckets.reduce((max, bucket) => Math.max(max, bucket.value), 0);
  const max = niceMax(dataMax);
  const ticks = [max, max / 2, 0];

  // Label roughly six x ticks, always including the most recent bucket.
  const step = Math.max(1, Math.ceil(buckets.length / 6));
  const isLabelled = (index: number) => (buckets.length - 1 - index) % step === 0;

  return (
    <figure className="m-0">
      <div className="relative pl-8" style={{ height }} id={headingId}>
        {ticks.map((tick) => (
          <React.Fragment key={tick}>
            <span
              className="absolute left-0 translate-y-1/2 text-[11px] tabular-nums text-slate-400"
              style={{ bottom: `${(tick / max) * 100}%` }}
            >
              {tick}
            </span>
            <span
              aria-hidden="true"
              className="absolute left-8 right-0 border-t"
              style={{ bottom: `${(tick / max) * 100}%`, borderColor: CHART.grid }}
            />
          </React.Fragment>
        ))}

        {dataMax === 0 && (
          <p className="absolute inset-x-8 top-1/2 -translate-y-1/2 text-center text-sm text-slate-400">
            No {noun} in this period.
          </p>
        )}

        <div className="absolute inset-y-0 left-8 right-0 flex items-end gap-[2px]">
          {buckets.map((bucket, index) => (
            <div
              key={bucket.key}
              tabIndex={0}
              aria-label={`${bucket.fullLabel}: ${bucket.value} ${noun}`}
              className="group relative flex h-full flex-1 items-end justify-center rounded-sm outline-none transition hover:bg-slate-50 focus-visible:bg-slate-50"
            >
              <div
                className="w-full max-w-[24px] rounded-t-[4px] transition"
                style={{
                  height: `${(bucket.value / max) * 100}%`,
                  minHeight: bucket.value > 0 ? 3 : 0,
                  backgroundColor: CHART.series,
                }}
              />
              <span
                className={`pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-lg group-hover:block group-focus:block ${
                  index === 0
                    ? "left-0"
                    : index === buckets.length - 1
                    ? "right-0"
                    : "left-1/2 -translate-x-1/2"
                }`}
              >
                {bucket.fullLabel}: {bucket.value} {bucket.value === 1 ? noun.replace(/ies$/, "y").replace(/s$/, "") : noun}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex gap-[2px] pl-8">
        {buckets.map((bucket, index) => (
          <span
            key={bucket.key}
            // Unlabelled neighbours leave the room, so let a label overflow its own slot.
            className="flex-1 whitespace-nowrap text-center text-[10px] text-slate-400"
          >
            {isLabelled(index) ? bucket.label : ""}
          </span>
        ))}
      </div>
    </figure>
  );
};

/* ------------------------------------------------------------------ bar list */

/**
 * Horizontal bars for nominal categories. Every bar wears the same hue - bar
 * length already encodes the value, so colour is not spent repeating it.
 */
export const BarList: React.FC<{ rows: Slice[]; emptyLabel?: string }> = ({
  rows,
  emptyLabel = "Nothing to show yet.",
}) => {
  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">{emptyLabel}</p>;
  }

  const max = rows.reduce((value, row) => Math.max(value, row.value), 0) || 1;

  return (
    <ul className="space-y-3.5">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-medium text-slate-700">{row.label}</span>
            <span className="shrink-0 font-bold tabular-nums text-slate-900">{row.value}</span>
          </div>
          <div
            className="mt-1.5 h-2 overflow-hidden rounded-[4px]"
            style={{ backgroundColor: CHART.seriesTrack }}
          >
            <div
              className="h-full rounded-r-[4px]"
              style={{
                width: `${Math.max((row.value / max) * 100, row.value > 0 ? 2 : 0)}%`,
                backgroundColor: CHART.series,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

/* ------------------------------------------------------------------ stacked */

export interface StackedRowData {
  label: string;
  published: number;
  hidden: number;
}

/**
 * Published vs hidden per content type. Two states, so it is emphasis rather than
 * a categorical palette: the live half takes the series hue, the rest the
 * de-emphasis grey, separated by a 2px surface gap.
 */
export const StackedBars: React.FC<{ rows: StackedRowData[] }> = ({ rows }) => {
  const max = rows.reduce((value, row) => Math.max(value, row.published + row.hidden), 0) || 1;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        {[
          { label: "Published", color: CHART.series },
          { label: "Hidden", color: CHART.muted },
        ].map((key) => (
          <span key={key.label} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-[3px]"
              style={{ backgroundColor: key.color }}
            />
            {key.label}
          </span>
        ))}
      </div>

      <ul className="mt-4 space-y-4">
        {rows.map((row) => {
          const total = row.published + row.hidden;
          return (
            <li key={row.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{row.label}</span>
                <span className="tabular-nums text-slate-500">
                  <span className="font-bold text-slate-900">{row.published}</span> live
                  {row.hidden > 0 && <> · {row.hidden} hidden</>}
                </span>
              </div>
              <div className="mt-1.5 flex h-2 gap-[2px]" style={{ width: `${(total / max) * 100}%` }}>
                {row.published > 0 && (
                  <div
                    className="h-full rounded-l-[4px] last:rounded-r-[4px]"
                    style={{
                      width: `${(row.published / total) * 100}%`,
                      backgroundColor: CHART.series,
                    }}
                  />
                )}
                {row.hidden > 0 && (
                  <div
                    className="h-full rounded-r-[4px] first:rounded-l-[4px]"
                    style={{
                      width: `${(row.hidden / total) * 100}%`,
                      backgroundColor: CHART.muted,
                    }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ meter */

/** One ratio against its total. The track is a lighter step of the same ramp. */
export const Meter: React.FC<{
  value: number;
  total: number;
  label: string;
  tone?: "series" | "bad";
}> = ({ value, total, label, tone = "series" }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold tabular-nums text-slate-900">
          {value} / {total}
        </span>
      </div>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-[4px]"
        style={{ backgroundColor: CHART.seriesTrack }}
      >
        <div
          className="h-full rounded-r-[4px] transition-all"
          style={{
            width: `${percent}%`,
            backgroundColor: tone === "bad" ? CHART.bad : CHART.series,
          }}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{percent}% of the total</p>
    </div>
  );
};

/* ------------------------------------------------------------------ sparkline */

/** Twelve-point trend for a stat tile: de-emphasis grey, latest period in the series hue. */
export const Sparkline: React.FC<{ values: number[] }> = ({ values }) => {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);

  return (
    <div aria-hidden="true" className="flex h-8 items-end gap-[2px]">
      {values.map((value, index) => (
        <span
          key={index}
          className="flex-1 rounded-t-[2px]"
          style={{
            height: `${Math.max((value / max) * 100, value > 0 ? 8 : 3)}%`,
            backgroundColor: index === values.length - 1 ? CHART.series : CHART.mutedSoft,
          }}
        />
      ))}
    </div>
  );
};
