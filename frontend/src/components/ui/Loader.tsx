import React from "react";
import { Loader2 } from "lucide-react";

export const FullPageLoader: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export const Spinner: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <Loader2 className={`animate-spin ${className}`} />
);
