import React from "react";

export const SectionHeading: React.FC<{
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Extra classes applied to the subtitle paragraph, e.g. "hidden sm:block" to hide on mobile. */
  subtitleClassName?: string;
  align?: "left" | "center";
  /** "badge" is the pill used on the inner pages, "label" the plain caps label used on the home page. */
  eyebrowTone?: "badge" | "label";
}> = ({ eyebrow, title, subtitle, subtitleClassName = "", align = "center" }) => (
  <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    {eyebrow && (
      <div className="mb-3.5">
        <span className="inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      </div>
    )}
    {title && <h2 className="h2">{title}</h2>}
    {subtitle && (
      <p className={`mt-4 text-base leading-relaxed text-slate-600 ${subtitleClassName}`}>
        {subtitle}
      </p>
    )}
  </div>
);
