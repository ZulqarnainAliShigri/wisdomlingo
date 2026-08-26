import React from "react";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { COMPANY } from "../../config/site";

interface LocationMapProps {
  /** Tailwind height classes for the embed. */
  heightClass?: string;
  showActions?: boolean;
}

/**
 * Google Maps embed of the WisdomLingo campus. Uses the keyless
 * `output=embed` endpoint, so no API key or billing account is needed.
 */
export const LocationMap: React.FC<LocationMapProps> = ({
  heightClass = "h-72 sm:h-80 lg:h-96",
  showActions = true,
}) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <iframe
      title={`${COMPANY.name} location on Google Maps`}
      src={COMPANY.googleMapsEmbedUrl}
      className={`w-full ${heightClass} border-0`}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />

    {showActions && (
      <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>
            <span className="block font-semibold text-slate-900">{COMPANY.legalName}</span>
            {COMPANY.address && <span className="block">{COMPANY.address}</span>}
            <span className="block text-xs text-slate-500">{COMPANY.hours}</span>
          </span>
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={COMPANY.googleDirectionsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary !py-2.5 text-xs"
          >
            <Navigation className="h-4 w-4" /> Get directions
          </a>
          <a
            href={COMPANY.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost !py-2.5 text-xs"
          >
            <ExternalLink className="h-4 w-4" /> View on Google
          </a>
        </div>
      </div>
    )}
  </div>
);
