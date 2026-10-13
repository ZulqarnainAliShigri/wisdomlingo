/**
 * Security Event Auditing & Intrusion Logging Module
 * Records security anomalies (honeypot triggers, brute-force attempts, sanitization catches)
 * for administrative diagnostics and security visibility.
 */

export type SecuritySeverity = "info" | "warning" | "critical";

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: "honeypot_triggered" | "rate_limit_exceeded" | "xss_vector_detected" | "frame_bust" | "auth_failure";
  severity: SecuritySeverity;
  details: string;
  source?: string;
}

const MAX_AUDIT_LOGS = 50;
const inMemoryAuditLogs: SecurityEvent[] = [];

export function logSecurityEvent(
  type: SecurityEvent["type"],
  severity: SecuritySeverity,
  details: string,
  source?: string
): void {
  const event: SecurityEvent = {
    id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    type,
    severity,
    details,
    source,
  };

  inMemoryAuditLogs.unshift(event);
  if (inMemoryAuditLogs.length > MAX_AUDIT_LOGS) {
    inMemoryAuditLogs.pop();
  }

  // In development, log a distinctive security warning in the console
  if (process.env.NODE_ENV !== "production") {
    const style =
      severity === "critical"
        ? "background: #ef4444; color: white; padding: 2px 6px; font-weight: bold; border-radius: 4px;"
        : "background: #f59e0b; color: black; padding: 2px 6px; font-weight: bold; border-radius: 4px;";
    console.warn(`%c[SECURITY AUDIT] [${severity.toUpperCase()}]`, style, details);
  }
}

export function getSecurityAuditLogs(): readonly SecurityEvent[] {
  return inMemoryAuditLogs;
}
