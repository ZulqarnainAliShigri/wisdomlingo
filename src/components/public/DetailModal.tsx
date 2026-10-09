import React from "react";
import { ArrowRight, CheckCircle2, MessageSquare, X } from "lucide-react";

export interface DetailModalData {
  title: string;
  subtitle?: string | null;
  category?: string | null;
  badge?: string | null;
  badgeColor?: string | null;
  image?: string | null;
  description?: string | null;
  points?: string[];
  metrics?: { label: string; value?: string | null }[];
  primaryCtaText?: string;
  onPrimaryCta?: () => void;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export const DetailModal: React.FC<{
  open: boolean;
  onClose: () => void;
  data: DetailModalData | null;
}> = ({ open, onClose, data }) => {
  if (!open || !data) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-in fade-in duration-200"
    >
      {/* Backdrop click */}
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Card / Bottom Sheet on mobile */}
      <div
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Header bar with close button */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            {data.badge && (
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${data.badgeColor || "bg-primary-50 text-primary"}`}>
                {data.badge}
              </span>
            )}
            {data.category && (
              <span className="truncate text-xs font-semibold text-slate-500">
                {data.category}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {/* Optional Image */}
          {data.image && (
            <div className="relative mb-5 h-44 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-52">
              <img
                src={data.image}
                alt={data.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
            </div>
          )}

          {/* Title & Subtitle */}
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-accent sm:text-sm">
              {data.subtitle}
            </p>
          )}

          {/* Metrics Grid */}
          {data.metrics && data.metrics.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-2xl bg-slate-50 p-3.5 sm:grid-cols-3 sm:p-4">
              {data.metrics.map((m, idx) => (
                <div key={idx} className="rounded-xl bg-white p-2.5 shadow-2xs">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {m.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs font-extrabold text-slate-900 sm:text-sm">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {data.description && (
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Overview</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                {data.description}
              </p>
            </div>
          )}

          {/* Highlights / Checklist */}
          {data.points && data.points.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Highlights & Inclusions
              </h4>
              <ul className="mt-2.5 space-y-2">
                {data.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700 sm:text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="leading-snug">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="flex flex-col gap-2.5 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
          {data.secondaryCtaLink && (
            <a
              href={data.secondaryCtaLink}
              target="_blank"
              rel="noreferrer"
              className="btn-outline flex-1 sm:flex-initial py-2.5 text-xs sm:text-sm"
            >
              <MessageSquare className="h-4 w-4 text-emerald-500" />
              {data.secondaryCtaText || "WhatsApp Us"}
            </a>
          )}
          {data.onPrimaryCta && (
            <button
              type="button"
              onClick={() => {
                onClose();
                data.onPrimaryCta?.();
              }}
              className="btn-primary flex-1 sm:flex-initial py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-primary/20"
            >
              <span>{data.primaryCtaText || "Get Started"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
