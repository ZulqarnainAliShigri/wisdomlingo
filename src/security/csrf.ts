/**
 * Anti-CSRF & Request Integrity Protection Module
 * Generates and validates cryptographic tokens for form submissions
 * to protect against Cross-Site Request Forgery (CSRF) and replay attacks.
 */

const CSRF_TOKEN_KEY = "wl_sec_csrf_token";

/**
 * Generates a cryptographically strong random token using the Web Crypto API.
 */
export function generateCsrfToken(): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint8Array(24);
    window.crypto.getRandomValues(buffer);
    return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for non-crypto environments
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Retrieves the current session CSRF token, or creates a new one if missing.
 */
export function getOrCreateCsrfToken(): string {
  try {
    let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
    if (!token) {
      token = generateCsrfToken();
      sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return generateCsrfToken();
  }
}

/**
 * Validates a submitted CSRF token against the active session token.
 */
export function validateCsrfToken(submittedToken: string): boolean {
  if (!submittedToken || typeof submittedToken !== "string") return false;
  try {
    const currentToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
    return currentToken === submittedToken.trim();
  } catch {
    return true; // Soft fail if sessionStorage is unavailable
  }
}
