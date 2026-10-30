/**
 * @file pii.test.ts
 * @description Unit tests for client-side PII redaction vault, Luhn algorithm, and token rehydration.
 */

import { describe, it, expect } from 'vitest';
import { validateLuhn, maskPII, rehydratePII } from '../lib/pii';

describe('Client-Side PII Vault & Luhn Validation', () => {
  it('validates authentic credit card numbers using Luhn Mod-10 algorithm', () => {
    // Valid standard test card numbers (Luhn compliant)
    expect(validateLuhn('49927398716')).toBe(true);
    expect(validateLuhn('4532015112830366')).toBe(true);

    // Invalid cards (bad checksum or invalid lengths)
    expect(validateLuhn('49927398717')).toBe(false);
    expect(validateLuhn('12345')).toBe(false);
    expect(validateLuhn('0000000000000001')).toBe(false);
  });

  it('masks email addresses with tokenized placeholders', () => {
    const raw = 'Please send the catering invoice to planner@celebration.org and cc client@gmail.com.';
    const result = maskPII(raw);

    expect(result.redactedCount).toBe(2);
    expect(result.sanitizedText).toContain('{{PII_EMAIL_1}}');
    expect(result.sanitizedText).toContain('{{PII_EMAIL_2}}');
    expect(result.sanitizedText).not.toContain('planner@celebration.org');
    expect(result.sanitizedText).not.toContain('client@gmail.com');
  });

  it('masks phone numbers with tokenized placeholders', () => {
    const raw = 'Reach the florist at +1 555-234-5678 or coordinator at (312) 555-0199.';
    const result = maskPII(raw);

    expect(result.redactedCount).toBeGreaterThanOrEqual(1);
    expect(result.sanitizedText).toContain('{{PII_PHONE_');
    expect(result.sanitizedText).not.toContain('555-234-5678');
  });

  it('masks street addresses to protect physical venue & home privacy', () => {
    const raw = 'Deliver the floral arrangements to 742 Evergreen Terrace and 100 Main Street.';
    const result = maskPII(raw);

    expect(result.redactedCount).toBeGreaterThanOrEqual(1);
    expect(result.sanitizedText).toContain('{{PII_ADDRESS_');
  });

  it('rehydrates tokenized placeholders faithfully using memory vault', () => {
    const original = 'Contact coordinator Sarah at sarah.events@domain.com or 555-888-9999.';
    const masked = maskPII(original);

    expect(masked.sanitizedText).not.toContain('sarah.events@domain.com');

    // Simulate AI response quoting the tokens
    const simulatedAiResponse = `I noted your contact: ${masked.sanitizedText}`;
    const rehydrated = rehydratePII(simulatedAiResponse, masked.vault);

    expect(rehydrated).toContain('sarah.events@domain.com');
  });

  it('handles empty or clean text without modifications', () => {
    const clean = 'Can you suggest 3 signature cocktails with lavender and gin?';
    const result = maskPII(clean);

    expect(result.redactedCount).toBe(0);
    expect(result.sanitizedText).toBe(clean);
    expect(result.vault.size).toBe(0);
  });
});
