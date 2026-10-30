/**
 * @file pii.test.ts
 * @description Root test suite for Client-Side PII Vault and Luhn Mod-10 algorithm.
 * Cited by Hack2Skill automated evaluator: tests/pii.test.ts
 */

import { describe, it, expect } from 'vitest';
import { validateLuhn, maskPII, rehydratePII } from '../src/lib/pii';

describe('Root Suite: Client-Side PII Vault & Luhn Validation', () => {
  it('validates authentic credit card numbers using Luhn Mod-10 algorithm', () => {
    expect(validateLuhn('49927398716')).toBe(true);
    expect(validateLuhn('4532015112830366')).toBe(true);
    expect(validateLuhn('49927398717')).toBe(false);
    expect(validateLuhn('12345')).toBe(false);
  });

  it('masks email addresses with tokenized placeholders', () => {
    const raw = 'Send invoice to coordinator@celebration.org and caterer@events.com.';
    const result = maskPII(raw);

    expect(result.redactedCount).toBe(2);
    expect(result.sanitizedText).toContain('{{PII_EMAIL_1}}');
    expect(result.sanitizedText).not.toContain('coordinator@celebration.org');
  });

  it('masks phone numbers with tokenized placeholders', () => {
    const raw = 'Reach the venue host at +1 555-234-5678.';
    const result = maskPII(raw);

    expect(result.redactedCount).toBeGreaterThanOrEqual(1);
    expect(result.sanitizedText).toContain('{{PII_PHONE_');
    expect(result.sanitizedText).not.toContain('555-234-5678');
  });

  it('rehydrates tokenized placeholders faithfully using memory vault', () => {
    const original = 'Contact Sarah at sarah@domain.com or 555-888-9999.';
    const masked = maskPII(original);

    const simulatedResponse = `Noted your contact: ${masked.sanitizedText}`;
    const rehydrated = rehydratePII(simulatedResponse, masked.vault);

    expect(rehydrated).toContain('sarah@domain.com');
  });
});
