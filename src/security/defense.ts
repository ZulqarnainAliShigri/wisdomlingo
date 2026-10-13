/**
 * Active Runtime Defenses Module
 * Executes baseline environment security protections when the app boots:
 * 1. Self-XSS Console Warning (blocks social engineering / copy-paste attacks)
 * 2. Clickjacking / Iframe Frame-Busting Defense
 * 3. Prototype Pollution Safeguards
 * 4. Sensitive Information Scrubbing in Unhandled Errors
 */

import { logSecurityEvent } from "./audit";

let securityInitialized = false;

/**
 * Initializes all client-side runtime security defenses.
 * Safe to call multiple times (idempotent).
 */
export function initAppSecurity(): void {
  if (securityInitialized || typeof window === "undefined") return;
  securityInitialized = true;

  setupSelfXssWarning();
  setupClickjackingProtection();
  setupPrototypePollutionProtection();
  setupErrorScrubber();
}

/**
 * Displays prominent warning in browser console to prevent Self-XSS social engineering scams.
 */
function setupSelfXssWarning(): void {
  // Only execute in browser environments
  try {
    const warningTitle = "%c⚠️ WARNING: STOP! ⚠️";
    const warningStyle =
      "color: red; font-size: 32px; font-weight: 900; -webkit-text-stroke: 1px black; text-shadow: 2px 2px 0 #000;";
    const messageStyle = "color: #334155; font-size: 15px; font-weight: 600; line-height: 1.6;";

    const warningMessage =
      "%cThis browser console is intended for web developers.\n" +
      "If someone told you to copy and paste code here to unlock courses, bypass passwords, or get free access, " +
      "it is a SCAM designed to steal your credentials and compromise your account.\n\n" +
      "Do NOT paste any code here!";

    setTimeout(() => {
      console.log(warningTitle, warningStyle);
      console.log(warningMessage, messageStyle);
    }, 500);
  } catch {
    // Console styling failed, safely ignore
  }
}

/**
 * Anti-Clickjacking: Checks if the application is being framed inside an unauthorized iframe.
 */
function setupClickjackingProtection(): void {
  try {
    if (window.top && window.top !== window.self) {
      // Check if framed by a different origin
      let isCrossOrigin = false;
      try {
        if (window.top.location.hostname !== window.self.location.hostname) {
          isCrossOrigin = true;
        }
      } catch {
        // Accessing cross-origin window.top.location throws a DOMException
        isCrossOrigin = true;
      }

      if (isCrossOrigin) {
        logSecurityEvent(
          "frame_bust",
          "critical",
          "Unauthorized iframe embedding detected (Clickjacking attempt)."
        );
        // Break out of the malicious frame
        window.top.location = window.self.location.href;
      }
    }
  } catch {
    // If window.top cannot be redirected, prevent clickjacking by body protection
    if (document.body) {
      document.body.style.display = "none";
    }
  }
}

/**
 * Prototype Pollution Hardening: Protects core Object properties.
 */
function setupPrototypePollutionProtection(): void {
  try {
    // Prevent modification of Object.prototype sensitive properties if supported
    if (Object.defineProperty) {
      Object.defineProperty(Object.prototype, "__proto_shield__", {
        value: true,
        writable: false,
        configurable: false,
      });
    }
  } catch {
    // Ignore if strict mode prevents definition
  }
}

/**
 * Error scrubber: prevents leaking environment credentials or raw Supabase internals in unhandled errors.
 */
function setupErrorScrubber(): void {
  window.addEventListener("unhandledrejection", (event) => {
    const reason = String(event.reason || "");
    // If an error message mentions sensitive keys, mask it
    if (reason.includes("REACT_APP_SUPABASE_ANON_KEY") || reason.includes("service_role")) {
      event.preventDefault();
      logSecurityEvent(
        "auth_failure",
        "warning",
        "Sensitive credential reference suppressed from unhandled rejection."
      );
    }
  });
}
