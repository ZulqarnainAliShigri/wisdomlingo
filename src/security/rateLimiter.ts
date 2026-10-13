/**
 * Client-Side Rate Limiter & Brute-Force Defense System
 * Prevents credential stuffing on admin login, submission flooding on contact forms,
 * and API denial-of-service attempts.
 */

export interface RateLimitPolicy {
  /** Maximum number of allowed actions within the timeframe */
  maxAttempts: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Lockout duration in milliseconds when limit is breached */
  lockoutMs: number;
}

export const RATE_LIMIT_POLICIES: Record<string, RateLimitPolicy> = {
  // Admin login: max 5 attempts in 10 minutes, locked out for 5 minutes
  admin_login: {
    maxAttempts: 5,
    windowMs: 10 * 60 * 1000,
    lockoutMs: 5 * 60 * 1000,
  },
  // Contact enquiries: max 4 submissions in 5 minutes, locked out for 3 minutes
  contact_form: {
    maxAttempts: 4,
    windowMs: 5 * 60 * 1000,
    lockoutMs: 3 * 60 * 1000,
  },
  // General requests: max 30 actions in 1 minute
  general: {
    maxAttempts: 30,
    windowMs: 60 * 1000,
    lockoutMs: 60 * 1000,
  },
};

interface RateLimitRecord {
  timestamps: number[];
  lockedUntil: number;
}

const STORAGE_PREFIX = "wl_sec_rl_";

function getRecord(key: string): RateLimitRecord {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.timestamps) && typeof parsed.lockedUntil === "number") {
        return parsed;
      }
    }
  } catch {
    // SessionStorage unavailable or corrupted
  }
  return { timestamps: [], lockedUntil: 0 };
}

function saveRecord(key: string, record: RateLimitRecord): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(record));
  } catch {
    // SessionStorage blocked or quota exceeded
  }
}

export interface RateLimitCheckResult {
  allowed: boolean;
  remainingAttempts: number;
  lockoutRemainingSeconds: number;
  message?: string;
}

/**
 * Checks whether an action is currently allowed under its rate-limiting policy.
 */
export function checkRateLimit(
  actionKey: string,
  customPolicy?: Partial<RateLimitPolicy>
): RateLimitCheckResult {
  const policy: RateLimitPolicy = {
    ...(RATE_LIMIT_POLICIES[actionKey] || RATE_LIMIT_POLICIES.general),
    ...customPolicy,
  };

  const now = Date.now();
  const record = getRecord(actionKey);

  // Check if currently locked out
  if (record.lockedUntil > now) {
    const lockoutRemainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutRemainingSeconds,
      message: `Too many attempts. For security, please wait ${lockoutRemainingSeconds}s before trying again.`,
    };
  }

  // Filter timestamps within the rolling window
  const recentTimestamps = record.timestamps.filter((ts) => now - ts < policy.windowMs);

  if (recentTimestamps.length >= policy.maxAttempts) {
    // Trigger lockout
    record.lockedUntil = now + policy.lockoutMs;
    saveRecord(actionKey, record);
    const lockoutRemainingSeconds = Math.ceil(policy.lockoutMs / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutRemainingSeconds,
      message: `Rate limit exceeded. Temporarily locked for ${lockoutRemainingSeconds}s to protect against automated attacks.`,
    };
  }

  return {
    allowed: true,
    remainingAttempts: policy.maxAttempts - recentTimestamps.length,
    lockoutRemainingSeconds: 0,
  };
}

/**
 * Records an attempt for a rate-limited action.
 */
export function recordRateLimitAttempt(actionKey: string): void {
  const now = Date.now();
  const record = getRecord(actionKey);
  record.timestamps.push(now);
  saveRecord(actionKey, record);
}

/**
 * Clears the rate limit for an action (e.g., upon successful admin login).
 */
export function resetRateLimit(actionKey: string): void {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + actionKey);
  } catch {
    // Ignore error
  }
}
