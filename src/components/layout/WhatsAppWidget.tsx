import React, { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { useCompany } from "../../hooks/useCompany";

/** WhatsApp brand mark - lucide dropped brand icons, so the glyph lives here. */
const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488" />
  </svg>
);

/**
 * Floating WhatsApp button with a small chat popup.
 *
 * Sits above the fixed mobile call bar on phones and drops to the corner from
 * `lg` up, where that bar is hidden.
 */
export const WhatsAppWidget: React.FC = () => {
  const COMPANY = useCompany();
  const DEFAULT_MESSAGE = `Hi ${COMPANY.name}, I would like to know more about your programmes.`;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLAnchorElement>(null);

  // Escape and outside clicks close the popup.
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  const href = `${COMPANY.whatsapp}?text=${encodeURIComponent(message.trim() || DEFAULT_MESSAGE)}`;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2.5 sm:bottom-24 sm:right-6 lg:bottom-6"
    >
      {/* Optional Desktop Quick Chat Pill */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group hidden items-center gap-2.5 rounded-full border border-emerald-200/80 bg-white/95 px-4 py-2 shadow-lg shadow-emerald-900/10 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:bg-white hover:shadow-xl hover:shadow-emerald-600/15 sm:flex"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </span>
          <span className="text-xs font-bold tracking-tight text-slate-800 transition group-hover:text-emerald-700">
            Chat with an Expert
          </span>
          <span className="flex h-5 items-center rounded-md bg-emerald-50 px-1.5 text-[10px] font-extrabold text-emerald-700">
            Online
          </span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={`Chat with ${COMPANY.name} on WhatsApp`}
          className="w-[19.5rem] animate-fade-in-up overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/25 ring-1 ring-black/5"
        >
          {/* WhatsApp Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] px-4 py-3.5 text-white shadow-sm">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs ring-2 ring-white/30">
              <WhatsAppGlyph className="h-5 w-5 text-white drop-shadow-xs" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075E54] bg-emerald-400 ring-1 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{COMPANY.name}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-100 font-medium">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                Online • Instant response
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="bg-[#EFEAE2] bg-opacity-95 p-4">
            <div className="max-w-[92%] rounded-2xl rounded-tl-xs bg-white p-3.5 text-xs leading-relaxed text-slate-700 shadow-sm border border-slate-200/40">
              <p className="font-medium text-slate-800">
                Hi there! 👋 Welcome to WisdomLingo.
              </p>
              <p className="mt-1 text-slate-600">
                Need details about German courses, public university admissions, or paid Ausbildung placement in Germany? We're active and ready to guide you.
              </p>
              <span className="mt-1.5 flex items-center justify-end gap-1 text-[10px] font-semibold text-slate-400">
                Just now • <span className="text-sky-500 font-bold">✓✓</span>
              </span>
            </div>
          </div>

          {/* Chat Footer */}
          <div className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendRef.current?.click();
                }
              }}
              placeholder="Ask anything or say hello..."
              aria-label="Your message"
              className="input !h-10 !rounded-full !border-slate-200 !px-4 !py-2 !text-xs !shadow-none focus:!border-emerald-500 focus:!ring-emerald-500/20"
            />
            <a
              ref={sendRef}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label="Send via WhatsApp"
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#1EBE5A] to-[#25D366] text-white shadow-md shadow-emerald-500/25 transition-all duration-200 hover:scale-108 hover:shadow-emerald-500/40 active:scale-95"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button with Ambient Glow & Multi-Ring Waves */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Wave Rings (only when closed) */}
        {!open && (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-16 w-16 rounded-full bg-emerald-500/25 animate-pulse-ring sm:h-20 sm:w-20"
            />
            <span
              aria-hidden="true"
              style={{ animationDelay: "1.2s" }}
              className="pointer-events-none absolute h-16 w-16 rounded-full bg-emerald-400/20 animate-pulse-ring sm:h-20 sm:w-20"
            />
          </>
        )}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close WhatsApp chat" : `Chat with ${COMPANY.name} on WhatsApp`}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#075E54] via-[#128C7E] to-[#25D366] p-3 text-white shadow-xl shadow-emerald-600/35 ring-4 ring-white/90 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-emerald-600/50 hover:ring-emerald-200/60 active:scale-95 focus:outline-none sm:h-16 sm:w-16 animate-float"
        >
          {/* Subtle Shimmer Overlay */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-80"
          />

          {/* Live Online Badge Indicator with Glow */}
          {!open && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-white">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </span>
          )}

          {open ? (
            <X className="relative h-6 w-6 transition-transform duration-300 rotate-0 group-hover:rotate-90 sm:h-7 sm:w-7" />
          ) : (
            <WhatsAppGlyph className="relative h-7 w-7 drop-shadow-md transition-transform duration-300 group-hover:scale-115 animate-wiggle sm:h-8 sm:w-8" />
          )}
        </button>
      </div>
    </div>
  );
};
