import React from "react";
import { Check, ChevronDown, ChevronRight, FileCheck, Sparkles } from "lucide-react";
import { StudyCountry } from "../../types";

export const CountryCard: React.FC<{
  country: StudyCountry;
  expanded: boolean;
  onToggle: () => void;
  onDetails?: (country: StudyCountry) => void;
  isActive?: boolean;
}> = ({ country, expanded, onToggle, onDetails, isActive = false }) => (
  <article
    className={`card overflow-hidden transition-all duration-500 ${
      isActive
        ? "border-primary/60 ring-2 ring-primary/30 shadow-xl scale-101"
        : "hover:border-slate-300 hover:shadow-md"
    }`}
  >
    <div className="flex items-start gap-4 p-5 sm:p-6">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold tracking-wider transition-all duration-300 ${
          isActive
            ? "bg-primary text-white scale-110 shadow-md shadow-primary/25"
            : "bg-primary-50 text-primary"
        }`}
      >
        {country.flag}
      </span>
      <div className="min-w-0 flex-1">
        <h3
          className={`text-lg font-bold transition-colors ${
            isActive ? "text-primary font-black" : "text-slate-900"
          }`}
        >
          {country.name}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-accent">{country.tagline}</p>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">{country.description}</p>

        <dl className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Tuition
            </dt>
            <dd className="text-xs sm:text-sm font-semibold text-slate-800">{country.tuition || "Varies"}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Intakes
            </dt>
            <dd className="text-xs sm:text-sm font-semibold text-slate-800">{country.intake || "Varies"}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div className="flex items-center border-t border-slate-100 bg-slate-50/50">
      {onDetails && (
        <button
          type="button"
          onClick={() => onDetails(country)}
          className="flex-1 py-3 px-4 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-100 border-r border-slate-100"
        >
          Details Popup
        </button>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 text-xs sm:text-sm font-bold text-primary transition hover:bg-slate-100"
      >
        <span>{expanded ? "Hide details" : "Benefits & Requirements"}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
    </div>

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
