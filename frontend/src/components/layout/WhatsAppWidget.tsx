import React, { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { COMPANY } from "../../config/site";

/** WhatsApp brand mark - lucide dropped brand icons, so the glyph lives here. */
const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488" />
  </svg>
);

const DEFAULT_MESSAGE = `Hi ${COMPANY.name}, I would like to know more about your programmes.`;

/**
 * Floating WhatsApp button with a small chat popup.
 *
 * Sits above the fixed mobile call bar on phones and drops to the corner from
 * `lg` up, where that bar is hidden.
 */
export const WhatsAppWidget: React.FC = () => {
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
      className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 sm:right-6 lg:bottom-6"
    >
      {open && (
        <div
          role="dialog"
          aria-label={`Chat with ${COMPANY.name} on WhatsApp`}
          className="w-[19rem] animate-fade-in-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
        >
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3.5 text-white">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <WhatsAppGlyph className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{COMPANY.name}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Typically replies within an hour
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-[#ECE5DD] px-4 py-5">
            <p className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm">
              Hi there 👋 Ask us about German classes, study abroad or an Ausbildung - we usually
              reply within the hour.
            </p>
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200 p-3">
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
              className="input !px-3.5 !py-2.5"
            />
            <a
              ref={sendRef}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label="Open WhatsApp"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1EBE5A]"
            >
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close WhatsApp chat" : `Chat with ${COMPANY.name} on WhatsApp`}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition hover:scale-105 hover:bg-[#1EBE5A] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        {!open && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 motion-safe:animate-ping"
          />
        )}
        {open ? (
          <X className="relative h-6 w-6" />
        ) : (
          <WhatsAppGlyph className="relative h-7 w-7" />
        )}
      </button>
    </div>
  );
};
