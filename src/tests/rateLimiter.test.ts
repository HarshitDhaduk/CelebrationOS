/**
 * @file rateLimiter.test.ts
 * @description Unit tests for sliding-window rate limiter throttling.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SlidingWindowRateLimiter } from '../lib/rate-limiter';

describe('SlidingWindowRateLimiter Suite', () => {
  let limiter: SlidingWindowRateLimiter;

  beforeEach(() => {
    limiter = new SlidingWindowRateLimiter(3, 100); // 3 requests per 100ms
  });

  it('permits requests within quota threshold', () => {
    const req1 = limiter.checkLimit();
    expect(req1.allowed).toBe(true);
    expect(req1.remaining).toBe(2);

    const req2 = limiter.checkLimit();
    expect(req2.allowed).toBe(true);
    expect(req2.remaining).toBe(1);

    const req3 = limiter.checkLimit();
    expect(req3.allowed).toBe(true);
    expect(req3.remaining).toBe(0);
  });

  it('throttles requests that exceed the active window quota', () => {
    limiter.checkLimit();
    limiter.checkLimit();
    limiter.checkLimit();

    // 4th request exceeds max of 3
    const req4 = limiter.checkLimit();
    expect(req4.allowed).toBe(false);
    expect(req4.remaining).toBe(0);
    expect(req4.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });

  it('replenishes quota after window expiration', async () => {
    limiter.checkLimit();
    limiter.checkLimit();
    limiter.checkLimit();
    expect(limiter.checkLimit().allowed).toBe(false);

    // Wait for rolling window to expire (100ms)
    await new Promise((resolve) => setTimeout(resolve, 110));

    const freshReq = limiter.checkLimit();
    expect(freshReq.allowed).toBe(true);
    expect(freshReq.remaining).toBe(2);
  });

  it('resets immediately on manual reset() invocation', () => {
    limiter.checkLimit();
    limiter.checkLimit();
    limiter.checkLimit();
    expect(limiter.getActiveRequestCount()).toBe(3);

    limiter.reset();
    expect(limiter.getActiveRequestCount()).toBe(0);
    expect(limiter.checkLimit().allowed).toBe(true);
  });
});
