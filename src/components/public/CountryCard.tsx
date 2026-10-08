import React from "react";
import { Check, ChevronDown, ChevronRight, FileCheck, Sparkles } from "lucide-react";
import { StudyCountry } from "../../types";

export const CountryCard: React.FC<{
  country: StudyCountry;
  expanded: boolean;
  onToggle: () => void;
}> = ({ country, expanded, onToggle }) => (
  <article className="card overflow-hidden">
    <div className="flex items-start gap-4 p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-extrabold tracking-wider text-primary">
        {country.flag}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold text-slate-900">{country.name}</h3>
        <p className="text-sm font-medium text-accent">{country.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{country.description}</p>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Tuition
            </dt>
            <dd className="text-sm font-semibold text-slate-800">{country.tuition || "Varies"}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Intakes
            </dt>
            <dd className="text-sm font-semibold text-slate-800">{country.intake || "Varies"}</dd>
          </div>
        </dl>
      </div>
    </div>

    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className="flex w-full items-center justify-between border-t border-slate-100 px-6 py-4 text-sm font-bold text-primary transition hover:bg-slate-50"
    >
      {expanded ? "Hide details" : "View benefits & requirements"}
      <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
    </button>

    {expanded && (
      <div className="grid gap-6 border-t border-slate-100 bg-slate-50 px-6 py-6 sm:grid-cols-2">
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Sparkles className="h-4 w-4 text-accent" /> Key benefits
          </h4>
          <ul className="space-y-2">
            {country.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <FileCheck className="h-4 w-4 text-primary" /> Requirements
          </h4>
          <ul className="space-y-2">
            {country.requirements.map((requirement) => (
              <li key={requirement} className="flex items-start gap-2 text-sm text-slate-700">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {requirement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </article>
);
