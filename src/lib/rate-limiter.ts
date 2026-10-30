/**
 * @file rate-limiter.ts
 * @description Sliding-window rate limiter for client-side API throttling.
 * Protects Google Gemini API quota, prevents accidental loop recursion, and enforces
 * defensive resource allocation.
 */

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTimeMs: number;
  retryAfterSeconds?: number;
}

export class SlidingWindowRateLimiter {
  private maxRequests: number;
  private windowSizeMs: number;
  private timestamps: number[];

  /**
   * Initializes a sliding-window rate limiter.
   *
   * @param maxRequests - Max number of requests allowed within the sliding window (e.g. 15).
   * @param windowSizeMs - Duration of the rolling window in ms (e.g. 60,000ms = 1 min).
   */
  constructor(maxRequests: number = 15, windowSizeMs: number = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowSizeMs = windowSizeMs;
    this.timestamps = [];
  }

  /**
   * Evaluates if a new request can proceed.
   * If allowed, records the current timestamp.
   *
   * @returns RateLimitStatus with remaining allowance and reset timestamp.
   */
  checkLimit(): RateLimitStatus {
    const now = Date.now();
    const windowStart = now - this.windowSizeMs;

    // Prune timestamps older than the current rolling window
    this.timestamps = this.timestamps.filter((ts) => ts > windowStart);

    if (this.timestamps.length >= this.maxRequests) {
      const oldestInWindow = this.timestamps[0];
      const resetTimeMs = oldestInWindow + this.windowSizeMs;
      const retryAfterSeconds = Math.ceil((resetTimeMs - now) / 1000);

      return {
        allowed: false,
        remaining: 0,
        resetTimeMs,
        retryAfterSeconds: Math.max(1, retryAfterSeconds),
      };
    }

    // Record this request
    this.timestamps.push(now);
    const remaining = this.maxRequests - this.timestamps.length;
    const resetTimeMs = this.timestamps[0] + this.windowSizeMs;

    return {
      allowed: true,
      remaining,
      resetTimeMs,
    };
  }

  /**
   * Resets the rate limiter window.
   */
  reset(): void {
    this.timestamps = [];
  }

  /**
   * Returns current count of requests recorded in the active window.
   */
  getActiveRequestCount(): number {
    const now = Date.now();
    const windowStart = now - this.windowSizeMs;
    this.timestamps = this.timestamps.filter((ts) => ts > windowStart);
    return this.timestamps.length;
  }
}

/**
 * Global rate limiter instance for Gemini AI calls: max 20 requests per minute.
 */
export const geminiRateLimiter = new SlidingWindowRateLimiter(20, 60 * 1000);
