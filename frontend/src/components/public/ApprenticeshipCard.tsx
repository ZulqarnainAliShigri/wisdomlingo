import React from "react";
import { ArrowRight, Briefcase, Calendar, Check, ChevronRight, Coins, FileCheck, Sparkles } from "lucide-react";
import { COMPANY } from "../../config/site";
import { FIELD_ICONS } from "../../data/content";
import { Apprenticeship } from "../../types";

export const ApprenticeshipCard: React.FC<{ item: Apprenticeship }> = ({ item }) => {
  const Icon = FIELD_ICONS[item.field] || Briefcase;
  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="flex items-center gap-4 border-b border-slate-100 p-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary">
          <Icon className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <span className="badge bg-emerald-50 text-emerald-700">{item.field}</span>
          <h3 className="mt-1.5 text-lg font-bold leading-snug text-slate-900">{item.title}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-accent-50 px-4 py-3">
            <Coins className="h-5 w-5 shrink-0 text-accent" />
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Salary
              </span>
              <span className="block text-sm font-bold text-slate-900">{item.salary}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-primary-50 px-4 py-3">
            <Calendar className="h-5 w-5 shrink-0 text-primary" />
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Duration
              </span>
              <span className="block text-sm font-bold text-slate-900">{item.duration}</span>
            </span>
          </div>
        </div>

        <div className="mt-6 grid flex-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <FileCheck className="h-4 w-4 text-primary" /> Requirements
            </h4>
            <ul className="space-y-2">
              {item.requirements.map((requirement) => (
                <li key={requirement} className="flex items-start gap-2 text-sm text-slate-600">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sparkles className="h-4 w-4 text-accent" /> Benefits
            </h4>
            <ul className="space-y-2">
              {item.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full">
          Apply for this field <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
};
