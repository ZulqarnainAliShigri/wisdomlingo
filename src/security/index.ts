/**
 * WisdomLingo Application Security Suite (src/security)
 * Comprehensive protection framework defending against:
 * - Cross-Site Scripting (XSS) & HTML Injections
 * - Credential stuffing & Brute-force attacks
 * - Automated headless bots, spam scrapers, & form flooding
 * - Cross-Site Request Forgery (CSRF) & Clickjacking
 * - Self-XSS social engineering scams
 * - Prototype pollution & sensitive data exposure
 */

export * from "./sanitizer";
export * from "./rateLimiter";
export * from "./botProtection";
export * from "./csrf";
export * from "./audit";
export * from "./defense";
export * from "./headers";
