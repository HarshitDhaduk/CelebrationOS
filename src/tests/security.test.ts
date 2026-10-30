import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  sanitizeNumber,
  isValidApiKey,
  isValidProjectJson,
} from '../utils/security';
import { weddingPreset } from '../data/defaultPresets';

describe('Security and Sanitization Suite', () => {
  it('strips script tags and malicious HTML from user input', () => {
    const dirty = '<script>alert("xss")</script>Hello <b>World</b>';
    const clean = sanitizeText(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('</script>');
    expect(clean).not.toContain('<b>');
    expect(clean).toContain('Hello');
    expect(clean).toContain('World');
  });

  it('escapes special characters to prevent injection attacks', () => {
    const malicious = `Robert'); DROP TABLE "Students" & Staff; <img src="x" onerror="alert(1)">`;
    const clean = sanitizeText(malicious);
    expect(clean).not.toContain('<img');
    expect(clean).toContain('&quot;');
    expect(clean).toContain('&#x27;');
    expect(clean).toContain('&amp;');
  });

  it('escapes standalone comparison operators', () => {
    const input = 'Score is < 100 and > 50';
    const clean = sanitizeText(input);
    expect(clean).toContain('&lt;');
    expect(clean).toContain('&gt;');
  });

  it('enforces maxLength on sanitized strings', () => {
    const longString = 'a'.repeat(500);
    const result = sanitizeText(longString, 50);
    expect(result.length).toBe(50);
  });

  it('handles non-string values gracefully', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
    expect(sanitizeText(12345)).toBe('');
    expect(sanitizeText({})).toBe('');
  });

  it('sanitizes and bounds numeric inputs correctly', () => {
    expect(sanitizeNumber(500, 0, 1000)).toBe(500);
    expect(sanitizeNumber(-100, 0, 1000)).toBe(0);
    expect(sanitizeNumber(5000, 0, 1000)).toBe(1000);
    expect(sanitizeNumber('250', 0, 1000)).toBe(250);
    expect(sanitizeNumber('invalid-nan', 10, 1000)).toBe(10);
    expect(sanitizeNumber(NaN, 5, 1000)).toBe(5);
    expect(sanitizeNumber(Infinity, 0, 1000)).toBe(0);
  });

  it('validates Google Gemini API key format correctly', () => {
    const validKey = 'AIzaSy' + 'B'.repeat(33);
    expect(isValidApiKey(validKey)).toBe(true);

    const validAltKey = 'AIzaSy_custom-key_1234567890abcdefABC';
    expect(isValidApiKey(validAltKey)).toBe(true);

    expect(isValidApiKey('')).toBe(false);
    expect(isValidApiKey('short')).toBe(false);
    expect(isValidApiKey('invalid with spaces AIzaSy12345')).toBe(false);
  });

  it('validates valid EventProject schema for JSON imports', () => {
    expect(isValidProjectJson(weddingPreset)).toBe(true);
  });

  it('rejects corrupted or malicious JSON schemas', () => {
    expect(isValidProjectJson(null)).toBe(false);
    expect(isValidProjectJson(undefined)).toBe(false);
    expect(isValidProjectJson('string')).toBe(false);
    expect(isValidProjectJson({})).toBe(false);
    expect(isValidProjectJson({ event: 'not-an-object' })).toBe(false);

    // Missing required arrays
    const missingArrays = {
      event: {
        title: 'Test',
        eventType: 'wedding',
        date: '2026-10-31',
        location: 'Beach',
        guestCount: 50,
        totalBudget: 10000,
      },
      budgetItems: [],
      // missing milestones, runOfShow, vendors, etc.
    };
    expect(isValidProjectJson(missingArrays)).toBe(false);
  });
});
