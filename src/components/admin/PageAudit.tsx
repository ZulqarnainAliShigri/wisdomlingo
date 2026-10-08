import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Gauge, Play, XCircle } from "lucide-react";
import { AuditResult, auditPage } from "../../lib/seoAudit";
import { Spinner } from "../ui/Loader";

/**
 * Runs the on-page analysis against the real page.
 *
 * The page is loaded same-origin in an off-screen iframe, so the DOM it measures
 * is exactly what a visitor gets - headings, word count, links and images
 * included. Nothing here is inferred from the source code.
 */

const STATUS_STYLE = {
  pass: { icon: CheckCircle2, ring: "border-emerald-200 bg-emerald-50/50", tone: "text-emerald-600" },
  warn: { icon: AlertTriangle, ring: "border-amber-200 bg-amber-50/50", tone: "text-amber-600" },
  fail: { icon: XCircle, ring: "border-accent/30 bg-accent-50/50", tone: "text-accent" },
} as const;

const scoreTone = (score: number) =>
  score >= 80 ? "text-emerald-600" : score >= 55 ? "text-amber-600" : "text-accent";

const scoreLabel = (score: number) =>
  score >= 80 ? "Good" : score >= 55 ? "Needs work" : "Poor";

/** Waits for the SPA inside the iframe to actually paint its content. */
function waitForContent(doc: Document, timeoutMs = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      const main = doc.querySelector("main");
      if (main && (main.textContent ?? "").trim().length > 200) {
        // One more frame so late content (remote lists) lands too.
        setTimeout(resolve, 400);
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error("The page did not finish rendering in time."));
        return;
      }
      setTimeout(tick, 200);
    };
    tick();
  });
}

export const PageAudit: React.FC<{
  path: string;
  keyword: string;
  title: string;
  description: string;
}> = ({ path, keyword, title, description }) => {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  /** Only the newest run may write state - an older one finishing late is ignored. */
  const runIdRef = useRef(0);

  // A change of page or keyword invalidates the previous run.
  useEffect(() => {
    setResult(null);
    setError(null);
  }, [path, keyword]);

  const run = useCallback(async () => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    const isCurrent = () => runIdRef.current === runId;

    // A run already in flight is abandoned rather than left to race this one.
    frameRef.current?.remove();

    setRunning(true);
    setError(null);
    setResult(null);

    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("title", "SEO analysis");
    // Off-screen rather than display:none, so layout-dependent content renders.
    frame.style.cssText =
      "position:fixed;left:-10000px;top:0;width:1280px;height:2000px;border:0;visibility:hidden;";
    frame.src = path;
    document.body.appendChild(frame);
    frameRef.current = frame;

    try {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Loading the page timed out.")), 10000);
        frame.onload = () => {
          clearTimeout(timer);
          resolve();
        };
        frame.onerror = () => {
          clearTimeout(timer);
          reject(new Error("Could not load the page."));
        };
      });

      const doc = frame.contentDocument;
      if (!doc) throw new Error("Could not read the page.");
      await waitForContent(doc);

      const audit = auditPage({ keyword, title, description, path, doc });
      if (isCurrent()) setResult(audit);
    } catch (caught) {
      if (isCurrent()) {
        setError(caught instanceof Error ? caught.message : "The analysis failed.");
      }
    } finally {
      frame.remove();
      if (frameRef.current === frame) frameRef.current = null;
      if (isCurrent()) setRunning(false);
    }
  }, [path, keyword, title, description]);

  // Never leave an orphan iframe behind if the tab is closed mid-run.
  useEffect(() => () => frameRef.current?.remove(), []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Gauge className="h-4 w-4 text-primary" /> On-page analysis
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Loads <code className="rounded bg-slate-100 px-1.5 py-0.5">{path}</code> and measures the
            real page.
          </p>
        </div>
        <button type="button" onClick={run} disabled={running} className="btn-ghost !py-2.5 text-sm">
          {running ? <Spinner /> : <Play className="h-4 w-4" />}
          {running ? "Analysing..." : result ? "Run again" : "Analyse page"}
        </button>
      </div>

      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-accent-50 p-3.5 text-sm text-accent">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-5 rounded-xl border border-slate-200 p-4">
            <div>
              <p className={`text-3xl font-extrabold ${scoreTone(result.score)}`}>
                {result.score}
                <span className="text-base font-bold text-slate-400">/100</span>
              </p>
              <p className={`text-xs font-semibold ${scoreTone(result.score)}`}>
                {scoreLabel(result.score)}
              </p>
            </div>
            <dl className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              {[
                ["Words", result.stats.words],
                ["Keyword uses", result.stats.occurrences],
                ["Density", `${result.stats.density.toFixed(2)}%`],
                ["H2s", result.stats.headings.h2],
                ["Internal links", result.stats.internalLinks],
                ["Images", result.stats.images],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <dt className="text-slate-400">{label}</dt>
                  <dd className="font-bold tabular-nums text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="space-y-2">
            {result.checks.map((check) => {
              const style = STATUS_STYLE[check.status];
              const Icon = style.icon;
              return (
                <li key={check.id} className={`flex gap-3 rounded-xl border p-3.5 ${style.ring}`}>
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.tone}`} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">{check.label}</span>
                    <span className="block text-xs leading-relaxed text-slate-600">
                      {check.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
