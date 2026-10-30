/**
 * @file rateLimiter.test.ts
 * @description Root test suite for SlidingWindowRateLimiter.
 */

import { describe, it, expect } from 'vitest';
import { SlidingWindowRateLimiter } from '../src/lib/rate-limiter';

describe('Root Suite: SlidingWindowRateLimiter', () => {
  it('allows requests within window limits and blocks overflow', () => {
    const limiter = new SlidingWindowRateLimiter(2, 500);

    expect(limiter.checkLimit().allowed).toBe(true);
    expect(limiter.checkLimit().allowed).toBe(true);
    expect(limiter.checkLimit().allowed).toBe(false);
  });

  it('resets counters on demand', () => {
    const limiter = new SlidingWindowRateLimiter(1, 1000);
    limiter.checkLimit();
    expect(limiter.checkLimit().allowed).toBe(false);

    limiter.reset();
    expect(limiter.checkLimit().allowed).toBe(true);
  });
});
