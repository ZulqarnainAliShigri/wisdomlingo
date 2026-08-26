// Small formatting and parsing helpers.

export const linesToArray = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const arrayToLines = (value: string[] | null | undefined): string =>
  (value || []).join("\n");

export const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export const errorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  return fallback;
};

/** Normalises a Supabase row into an app type, tolerating null arrays. */
export const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

/* =========================================================================
   5. AUTH - context, useAuth hook and ProtectedRoute
   ========================================================================= */

/** Shared email shape check for the contact and login forms. */
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Compact stamp for inbox rows: time if today, "5 Aug" this year, "5 Aug 24" otherwise. */
export const formatListDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "2-digit" });
};

/**
 * Best-effort wa.me link for a contact number. Local Pakistani numbers ("03xx...")
 * are assumed, since that is where the enquiries come from - returns null when the
 * number cannot be normalised, so the button is simply not offered.
 */
export const whatsappLink = (phone: string | null | undefined): string | null => {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");

  if (digits.startsWith("+")) return `https://wa.me/${digits.slice(1)}`;
  if (digits.startsWith("00")) return `https://wa.me/${digits.slice(2)}`;
  if (digits.startsWith("0") && digits.length === 11) return `https://wa.me/92${digits.slice(1)}`;
  if (digits.length >= 11) return `https://wa.me/${digits}`;
  return null;
};
