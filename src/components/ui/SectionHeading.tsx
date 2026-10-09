import React from "react";

export const SectionHeading: React.FC<{
  eyebrow?: string;
  title?: string;
  /** Extra classes applied to the heading, e.g. "hidden sm:block" to hide on mobile. */
  titleClassName?: string;
  subtitle?: string;
  /** Extra classes applied to the subtitle paragraph, e.g. "hidden sm:block" to hide on mobile. */
  subtitleClassName?: string;
  align?: "left" | "center" | "responsive";
  /** "badge" is the pill used on the inner pages, "label" the plain caps label used on the home page. */
  eyebrowTone?: "badge" | "label";
}> = ({
  eyebrow,
  title,
  titleClassName = "",
  subtitle,
  subtitleClassName = "",
  align = "responsive",
}) => {
  const containerAlign =
    align === "center"
      ? "mx-auto max-w-3xl text-center"
      : align === "left"
      ? "max-w-3xl text-left"
      : "max-w-3xl text-center lg:text-left mx-auto lg:mx-0";

  const badgeAlign =
    align === "center"
      ? "justify-center"
      : align === "left"
      ? "justify-start"
      : "justify-center lg:justify-start";

  return (
    <div className={containerAlign}>
      {eyebrow && (
        <div className={`mb-2 sm:mb-3 flex ${badgeAlign}`}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200/90 bg-primary-50 px-3 py-0.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary shadow-2xs">
            {eyebrow}
          </span>
        </div>
      )}
      {title && (
        <h2
          className={`text-xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl ${titleClassName}`.trim()}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={`hidden sm:block mt-1.5 sm:mt-2 text-xs sm:text-sm lg:text-base leading-relaxed text-slate-600 ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
