import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useCompany } from "../../hooks/useCompany";
import { FOOTER_GROUPS } from "../../config/navigation";
import { Logo } from "./Logo";

/**
 * lucide-react ships no TikTok glyph, so the mark is inlined. It is a filled
 * path rather than a stroked one, sized to sit level with the lucide icons.
 */
const TikTok: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.78.12V9.66a5.7 5.7 0 1 0 4.9 5.64V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.4 4.4 0 0 1-3.24-1.48Z" />
  </svg>
);

export const Footer: React.FC = () => {
  const COMPANY = useCompany();

  return (
    <footer className="mt-auto bg-slate-900 text-slate-400">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo tone="light" showTagline={false} />
          <p className="mt-5 text-sm leading-relaxed">
            Your trusted partner for educational and professional pathways in Europe.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { icon: Facebook, label: "Facebook", href: COMPANY.social.facebook },
              { icon: Instagram, label: "Instagram", href: COMPANY.social.instagram },
              { icon: Linkedin, label: "LinkedIn", href: COMPANY.social.linkedin },
              { icon: TikTok, label: "TikTok", href: COMPANY.social.tiktok },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${COMPANY.name} on ${label}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-primary hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="mt-6 space-y-2.5 text-xs text-slate-300">
            <p className="flex items-center gap-2.5">
              <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-medium text-slate-200 transition hover:text-white"
              >
                {COMPANY.email}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <a
                href={COMPANY.phoneHref}
                className="transition hover:text-white"
              >
                {COMPANY.phone}
              </a>
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
              <a
                href={COMPANY.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                {COMPANY.address || "House 3A, Park Road, F-8/1, Islamabad"}
              </a>
            </p>
          </div>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className="mb-4 text-sm font-bold text-white">{group.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800">
        <div className="container-page py-5 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} {COMPANY.name} Education Consultancy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
