import React from "react";

export const SectionHeading: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** "badge" is the pill used on the inner pages, "label" the plain caps label used on the home page. */
  eyebrowTone?: "badge" | "label";
}> = ({ eyebrow, title, subtitle, align = "center", eyebrowTone = "badge" }) => (
  <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    {eyebrow &&
      (eyebrowTone === "label" ? (
        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </span>
      ) : (
        <span className="badge mb-3 bg-accent-50 text-accent">{eyebrow}</span>
      ))}
    <h2 className="h2">{title}</h2>
    {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-600">{subtitle}</p>}
  </div>
);
