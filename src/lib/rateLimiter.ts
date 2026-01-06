// Simple in-memory rate limiter for endpoints
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function getRateLimiter(options: {
  windowMs?: number; // Time window in milliseconds (default: 15 minutes)
  maxRequests?: number; // Max requests per window (default: 5)
}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxRequests = options.maxRequests || 5;

  return (
    identifier: string
  ): { allowed: boolean; remaining: number; retryAfter?: number } => {
    const now = Date.now();
    const record = store[identifier];

    // Create new record if doesn't exist or window has expired
    if (!record || now > record.resetTime) {
      store[identifier] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return { allowed: true, remaining: maxRequests - 1 };
    }

    // Increment count
    record.count++;

    // Check if limit exceeded
    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    return { allowed: true, remaining: maxRequests - record.count };
  };
}

// Cleanup old entries periodically (every hour)
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 60 * 60 * 1000);
