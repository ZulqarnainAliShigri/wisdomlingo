/**
 * HTTP Security Headers & Content Security Policy (CSP) Specifications
 * Defines recommended headers that protect the application against MIME-confusion attacks,
 * Clickjacking, Cross-Site Scripting, and unauthorized hardware access.
 */

export interface SecurityHeaderDefinition {
  key: string;
  value: string;
  description: string;
}

export const RECOMMENDED_SECURITY_HEADERS: SecurityHeaderDefinition[] = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
    description: "Prevents other domains from framing the site, eliminating Clickjacking attacks.",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
    description: "Forces browsers to stick to declared MIME types, preventing script execution from image/text files.",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
    description: "Enables legacy browser reflective XSS filtering.",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
    description: "Prevents leaking sensitive URLs or authentication tokens in HTTP Referer headers.",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
    description: "Restricts access to hardware sensors and device APIs to prevent malicious fingerprinting.",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
    description: "Enforces strict HTTPS communication for all requests.",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.google.com https://maps.googleapis.com https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://maps.googleapis.com",
      "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' mailto: https://mail.google.com",
    ].join("; "),
    description: "Controls what external resources and scripts the browser is permitted to execute.",
  },
];
