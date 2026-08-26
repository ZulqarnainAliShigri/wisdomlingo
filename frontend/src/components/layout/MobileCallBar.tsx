import React from "react";
import { Phone } from "lucide-react";
import { COMPANY } from "../../config/site";

/**
 * Fixed conversion bar, phones and tablets only. The desktop navbar already
 * carries the same two actions, so it is hidden from `lg` up.
 */
export const MobileCallBar: React.FC = () => (
  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
    <div className="mx-auto flex max-w-md gap-3">
      <a
        href={COMPANY.phoneHref}
        className="btn flex-1 border border-accent/40 text-accent hover:bg-accent-50"
      >
        <Phone className="h-4 w-4" /> Call Us
      </a>
      <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="btn-accent flex-1">
        Book Free
      </a>
    </div>
  </div>
);
