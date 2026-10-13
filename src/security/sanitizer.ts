/**
 * Advanced Input & HTML Sanitization Module
 * Protects against Cross-Site Scripting (XSS), HTML Injection,
 * and malicious protocol execution (e.g. javascript:, data:).
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
};

/**
 * Escapes HTML characters to prevent XSS in text injection contexts.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"'/`]/g, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Strips dangerous HTML tags and script vectors from input text.
 * Suitable for text inputs like names, emails, subject, addresses, and messages.
 */
export function sanitizeText(input: unknown): string {
  if (input === null || input === undefined) return "";
  let text = String(input);

  // Strip null bytes and control characters (used in bypass techniques)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Strip script, iframe, object, embed, style, meta, svg, and form tags
  text = text.replace(/<\/?(?:script|iframe|object|embed|style|meta|link|svg|math|applet|form|button)[^>]*>/gi, "");

  // Strip event handlers (e.g. onerror=, onload=, onclick=, etc.)
  text = text.replace(/\bon[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // Strip dangerous pseudo-protocols (javascript:, vbscript:, data:text/html)
  text = text.replace(/(?:javascript|vbscript|data):[^\s"'>]*/gi, "");

  return text.trim();
}

/**
 * Validates whether a given URL is safe to open or link to.
 * Strictly permits http, https, mailto, tel protocols and relative paths.
 * Rejects javascript:, data:, file:, and vbscript: URIs.
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();

  // Relative links are safe
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;

  try {
    const parsed = new URL(trimmed, window.location.origin);
    const safeProtocols = ["http:", "https:", "mailto:", "tel:"];
    return safeProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitizes a URL, returning a safe URL or a fallback if malicious.
 */
export function sanitizeUrl(url: string, fallback: string = "#"): string {
  if (isSafeUrl(url)) return url.trim();
  return fallback;
}

/**
 * Recursively sanitizes all string fields in a payload object.
 * Ideal for sanitizing entire form submission objects before sending to Supabase or APIs.
 */
export function sanitizePayload<T>(payload: T): T {
  if (payload === null || payload === undefined) return payload;

  if (typeof payload === "string") {
    return sanitizeText(payload) as unknown as T;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePayload(item)) as unknown as T;
  }

  if (typeof payload === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
      // Prevent prototype pollution keys
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        continue;
      }
      result[key] = sanitizePayload(value);
    }
    return result as T;
  }

  return payload;
}
