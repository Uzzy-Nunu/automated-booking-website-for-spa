interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter.
 * @param identifier e.g., IP address or session_id
 * @param limit max requests allowed per window
 * @param windowMs window duration in milliseconds (default: 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = store[identifier];

  if (!record || now > record.resetTime) {
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, remaining: limit - 1, resetMs: windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetMs: record.resetTime - now };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, resetMs: record.resetTime - now };
}
