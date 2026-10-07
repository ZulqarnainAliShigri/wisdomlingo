import React from "react";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useCompany } from "../../hooks/useCompany";

/**
 * Custom TikTok icon matching lucide-react glyph size.
 */
const TikTok: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.78.12V9.66a5.7 5.7 0 1 0 4.9 5.64V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.4 4.4 0 0 1-3.24-1.48Z" />
  </svg>
);

export const TopBar: React.FC = () => {
  const COMPANY = useCompany();

  // Items for mobile continuous marquee carousel (rendered twice for seamless loop)
  const renderMarqueeItems = () => (
    <div className="flex shrink-0 items-center gap-6 pr-6">
      {COMPANY.email && (
        <a
          href={`mailto:${COMPANY.email}`}
          className="inline-flex items-center gap-1.5 text-slate-700 transition hover:text-primary"
        >
          <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>{COMPANY.email}</span>
        </a>
      )}

      <span className="text-slate-300">•</span>

      {COMPANY.phone && (
        <a
          href={COMPANY.phoneHref}
          className="inline-flex items-center gap-1.5 font-semibold text-slate-700 transition hover:text-primary"
        >
          <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>{COMPANY.phone}</span>
        </a>
      )}

      {COMPANY.whatsapp && (
        <>
          <span className="text-slate-300">•</span>
          <a
            href={COMPANY.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            <span>WhatsApp</span>
          </a>
        </>
      )}

      {COMPANY.hours && (
        <>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-600">
            <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>{COMPANY.hours}</span>
          </span>
        </>
      )}

      {COMPANY.address && (
        <>
          <span className="text-slate-300">•</span>
          <a
            href={COMPANY.googleMapsUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-700 transition hover:text-primary"
          >
            <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
            <span>{COMPANY.address}</span>
          </a>
        </>
      )}

      <span className="text-slate-300">•</span>

      <div className="flex items-center gap-3">
        {COMPANY.social.facebook && (
          <a
            href={COMPANY.social.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="text-slate-500 transition hover:text-blue-600"
          >
            <Facebook className="h-3.5 w-3.5" />
          </a>
        )}
        {COMPANY.social.instagram && (
          <a
            href={COMPANY.social.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-slate-500 transition hover:text-pink-600"
          >
            <Instagram className="h-3.5 w-3.5" />
          </a>
        )}
        {COMPANY.social.linkedin && (
          <a
            href={COMPANY.social.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-slate-500 transition hover:text-blue-700"
          >
            <Linkedin className="h-3.5 w-3.5" />
          </a>
        )}
        {COMPANY.social.tiktok && (
          <a
            href={COMPANY.social.tiktok}
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="text-slate-500 transition hover:text-slate-900"
          >
            <TikTok className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="border-b border-slate-200 bg-white text-xs">
      {/* ────────────────────────────────────────────────────────
          MOBILE: Continuous Scrolling Marquee Carousel
         ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden md:hidden py-2" aria-label="Quick contact ticker">
        {/* Soft edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Scrolling continuous carousel */}
        <div className="animate-marquee">
          {renderMarqueeItems()}
          {renderMarqueeItems()}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          DESKTOP: Full clean static bar
         ──────────────────────────────────────────────────────── */}
      <div className="container-page hidden md:flex items-center justify-between gap-x-6 py-2">
        {/* Left: Contact Info & Hours */}
        <div className="flex items-center gap-x-5">
          {COMPANY.email && (
            <a
              href={`mailto:${COMPANY.email}`}
              className="inline-flex items-center gap-1.5 text-slate-600 transition hover:text-primary"
              title="Send us an email"
            >
              <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{COMPANY.email}</span>
            </a>
          )}

          {COMPANY.phone && (
            <a
              href={COMPANY.phoneHref}
              className="inline-flex items-center gap-1.5 text-slate-600 transition hover:text-primary"
              title="Call us directly"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{COMPANY.phone}</span>
            </a>
          )}

          {COMPANY.hours && (
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>{COMPANY.hours}</span>
            </span>
          )}
        </div>

        {/* Right: Location & Social Media */}
        <div className="flex items-center gap-x-5">
          {COMPANY.address && (
            <a
              href={COMPANY.googleMapsUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-slate-600 transition hover:text-primary"
              title="View campus location on Google Maps"
            >
              <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
              <span className="max-w-[280px] xl:max-w-none truncate">{COMPANY.address}</span>
            </a>
          )}

          {/* Social Icons & WhatsApp */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-5">
            {COMPANY.social.facebook && (
              <a
                href={COMPANY.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="text-slate-500 transition hover:text-blue-600"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
            )}
            {COMPANY.social.instagram && (
              <a
                href={COMPANY.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="text-slate-500 transition hover:text-pink-600"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
            )}
            {COMPANY.social.linkedin && (
              <a
                href={COMPANY.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="text-slate-500 transition hover:text-blue-700"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {COMPANY.social.tiktok && (
              <a
                href={COMPANY.social.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="text-slate-500 transition hover:text-slate-900"
              >
                <TikTok className="h-3.5 w-3.5" />
              </a>
            )}
            {COMPANY.whatsapp && (
              <a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
                className="inline-flex items-center gap-1 text-emerald-600 font-semibold transition hover:text-emerald-700 ml-1"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
