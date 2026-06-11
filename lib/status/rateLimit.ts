// lib/status/rateLimit.ts
// Simple in-memory rate limiter (per-IP / per-key).
// Resets on server restart — fine for edge/serverless with single instance caveats.

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

/**
 * Check and increment rate limit.
 * @param key    Unique key (e.g. IP address or `cardId:ip`)
 * @param limit  Max requests per window
 * @param windowMs  Window size in ms
 * @returns true if request is allowed, false if rate-limited
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

/** Time in ms until the rate limit resets for a key (0 if not limited) */
export function retryAfterMs(key: string): number {
  const entry = store.get(key);
  if (!entry) return 0;
  const remaining = entry.resetAt - Date.now();
  return remaining > 0 ? remaining : 0;
}
