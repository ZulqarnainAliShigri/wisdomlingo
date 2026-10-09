import React from "react";
import { ArrowRight, Briefcase, Calendar, Coins } from "lucide-react";
import { useCompany } from "../../hooks/useCompany";
import { FIELD_ICONS } from "../../data/content";
import { Apprenticeship } from "../../types";

export const ApprenticeshipCard: React.FC<{
  item: Apprenticeship;
  onDetails?: (item: Apprenticeship) => void;
  isActive?: boolean;
}> = ({ item, onDetails, isActive = false }) => {
  const COMPANY = useCompany();
  const Icon = FIELD_ICONS[item.field] || Briefcase;
  return (
    <article
      className={`card flex flex-col overflow-hidden transition-all duration-500 ${
        isActive
          ? "border-primary/60 ring-2 ring-primary/30 shadow-2xl -translate-y-1.5 scale-101"
          : "hover:shadow-xl hover:-translate-y-1"
      }`}
    >
      <div className="flex items-center gap-4 border-b border-slate-100 p-5 sm:p-6">
        <span
          className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
            isActive
              ? "bg-primary text-white scale-110 shadow-md shadow-primary/25"
              : "bg-primary-50 text-primary"
          }`}
        >
          <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${isActive ? "animate-wiggle" : ""}`} />
        </span>
        <div className="min-w-0 flex-1">
          <span className="badge bg-emerald-50 text-emerald-700">{item.field}</span>
          <h3
            className={`mt-1 text-base sm:text-lg font-bold leading-snug transition-colors ${
              isActive ? "text-primary font-black" : "text-slate-900"
            }`}
          >
            {item.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">{item.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 rounded-xl bg-accent-50 p-2.5 sm:px-3.5 sm:py-2.5">
            <Coins className="h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Salary
              </span>
              <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate">{item.salary}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-primary-50 p-2.5 sm:px-3.5 sm:py-2.5">
            <Calendar className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Duration
              </span>
              <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate">{item.duration}</span>
            </div>
          </div>
        </div>

        {/* Card Actions: Details Modal + Apply */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2.5">
          {onDetails && (
            <button
              type="button"
              onClick={() => onDetails(item)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-700 transition hover:border-primary hover:bg-primary-50 hover:text-primary"
            >
              Details
            </button>
          )}
          <a
            href={COMPANY.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 px-3 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
          >
            <span>Apply</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
