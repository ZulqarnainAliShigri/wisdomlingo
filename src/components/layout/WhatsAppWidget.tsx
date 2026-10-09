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
          className="group hidden items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-3.5 py-1.5 shadow-md shadow-slate-900/5 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:bg-white hover:shadow-lg sm:flex"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-slate-700 transition group-hover:text-emerald-700">
            Chat with us
          </span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={`Chat with ${COMPANY.name} on WhatsApp`}
          className="w-[19.5rem] animate-fade-in-up overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20"
        >
          {/* WhatsApp Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#075E54] to-[#128C7E] px-4 py-3.5 text-white">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
              <WhatsAppGlyph className="h-5 w-5 text-white" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#075E54] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{COMPANY.name}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Online • Typically replies instantly
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="bg-[#EFEAE2] bg-opacity-95 p-4">
            <div className="max-w-[90%] rounded-2xl rounded-tl-xs bg-white p-3 text-xs leading-relaxed text-slate-700 shadow-xs">
              <p>
                Hi there 👋 Ask us about German courses, university admissions or paid Ausbildung programs. We are online and happy to help!
              </p>
              <span className="mt-1 block text-right text-[10px] text-slate-400">
                Just now • ✓✓
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
              placeholder="Type your message..."
              aria-label="Your message"
              className="input !h-10 !rounded-full !border-slate-200 !px-4 !py-2 !text-xs !shadow-none focus:!border-emerald-500 focus:!ring-emerald-500/20"
            />
            <a
              ref={sendRef}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label="Send via WhatsApp"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#1EBE5A] to-[#25D366] text-white shadow-md shadow-emerald-500/20 transition hover:scale-105 hover:from-[#1EBE5A] hover:to-[#22c55e] active:scale-95"
            >
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close WhatsApp chat" : `Chat with ${COMPANY.name} on WhatsApp`}
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#34D399] p-3 text-white shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-500/15 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-emerald-600/40 hover:ring-emerald-500/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 sm:h-14 sm:w-14"
      >
        {/* Live Online Badge Indicator */}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </span>
        )}

        {open ? (
          <X className="relative h-6 w-6 transition-transform duration-200" />
        ) : (
          <WhatsAppGlyph className="relative h-6 w-6 drop-shadow-xs transition-transform duration-200 group-hover:scale-105 sm:h-7 sm:w-7" />
        )}
      </button>
    </div>
  );
};
