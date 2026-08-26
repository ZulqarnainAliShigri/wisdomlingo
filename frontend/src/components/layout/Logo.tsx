import React from "react";
import { COMPANY } from "../../config/site";

/** Public path of the WL&C mark in `frontend/public/images`. */
export const LOGO_SRC = `${process.env.PUBLIC_URL}/images/logo.png`;

type LogoSize = "md" | "lg";

const MARK_SIZES: Record<LogoSize, string> = {
  md: "h-10 w-auto sm:h-11",
  lg: "h-[3.5rem] w-auto sm:h-[3.875rem]",
};

interface LogoProps {
  /** "light" is for dark backgrounds - the mark sits on a white chip so the navy stays readable. */
  tone?: "dark" | "light";
  /** Hide the wordmark and show the mark only (useful in tight spaces). */
  markOnly?: boolean;
  /** "lg" is used in the navbar. */
  size?: LogoSize;
  /** The "Education Consultancy" line under the wordmark. Off in the navbar and footer. */
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  tone = "dark",
  markOnly = false,
  size = "md",
  showTagline = true,
}) => (
  <span className="flex items-center gap-2.5">
    <span
      className={
        tone === "light"
          ? "flex items-center rounded-xl bg-white px-2 py-1.5 shadow-sm"
          : "flex items-center"
      }
    >
      <img
        src={LOGO_SRC}
        alt={`${COMPANY.name} logo`}
        width={538}
        height={313}
        className={MARK_SIZES[size]}
      />
    </span>

    {!markOnly && (
      <span className="leading-none">
        <span
          className={`block text-base font-extrabold tracking-tight sm:text-lg ${
            tone === "dark" ? "text-slate-900" : "text-white"
          }`}
        >
          Wisdom<span className="text-accent">Lingo</span>
        </span>
        {showTagline && (
          <span
            className={`mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.16em] ${
              tone === "dark" ? "text-slate-500" : "text-blue-200"
            }`}
          >
            Education Consultancy
          </span>
        )}
      </span>
    )}
  </span>
);
