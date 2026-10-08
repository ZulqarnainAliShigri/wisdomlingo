import React from "react";
import { Search } from "lucide-react";

export const EmptyState: React.FC<{ title: string; hint?: string; icon?: React.ReactNode }> = ({
  title,
  hint,
  icon,
}) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
      {icon || <Search className="h-5 w-5" />}
    </div>
    <p className="font-semibold text-slate-700">{title}</p>
    {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
  </div>
);
