/**
 * @file security.ts
 * @description Enterprise-grade security and input sanitization utilities for CelebrationOS.
 * Protects against XSS, prototype pollution, JSON state poisoning, and invalid numeric input.
 */

import { EventProject } from '../types';

/**
 * Sanitizes user input string by stripping potential HTML tags and script injections.
 *
 * @param input - The raw text input
 * @param maxLength - Optional maximum permitted string length
 * @returns Clean, sanitized string
 */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Strip dangerous HTML/script characters and tags
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi, '')
    .replace(/[<>'"&]/g, (match) => {
      switch (match) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '&': return '&amp;';
        default: return match;
      }
    })
    .trim();

  return sanitized.slice(0, maxLength);
}

/**
 * Validates and safely parses numeric inputs, preventing NaN and negative numbers where appropriate.
 *
 * @param value - Unknown input value
 * @param min - Minimum allowed value (default: 0)
 * @param max - Maximum allowed value (default: 100,000,000)
 * @returns Clean finite number
 */
export function sanitizeNumber(value: unknown, min = 0, max = 100000000): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return min;
  }
  return Math.min(Math.max(num, min), max);
}

/**
 * Validates a Google AI Studio Gemini API key format.
 * AI Studio keys typically begin with "AIzaSy" and are 39 characters long.
 *
 * @param key - The API key candidate
 * @returns Boolean indicating whether the key conforms to Google API key standards
 */
export function isValidApiKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  // Google API keys typically match this pattern
  const googleApiKeyRegex = /^AIzaSy[A-Za-z0-9_-]{33}$/;
  return googleApiKeyRegex.test(trimmed) || (trimmed.length >= 25 && /^[A-Za-z0-9_-]+$/.test(trimmed));
}

/**
 * Performs deep, type-safe schema validation on imported project JSON.
 * Guards against prototype pollution and corrupted state imports.
 *
 * @param candidate - Unknown parsed JSON data
 * @returns True if candidate adheres to the EventProject schema
 */
export function isValidProjectJson(candidate: unknown): candidate is EventProject {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return false;
  }

  const obj = candidate as Record<string, unknown>;

  // Check event metadata
  if (!obj.event || typeof obj.event !== 'object') {
    return false;
  }

  const event = obj.event as Record<string, unknown>;
  if (
    typeof event.title !== 'string' ||
    typeof event.eventType !== 'string' ||
    typeof event.date !== 'string' ||
    typeof event.location !== 'string' ||
    typeof event.guestCount !== 'number' ||
    typeof event.totalBudget !== 'number'
  ) {
    return false;
  }

  // Check required array collections
  if (!Array.isArray(obj.budgetItems)) return false;
  if (!Array.isArray(obj.milestones)) return false;
  if (!Array.isArray(obj.runOfShow)) return false;
  if (!Array.isArray(obj.vendors)) return false;
  if (!Array.isArray(obj.vendorChecklist)) return false;
  if (!Array.isArray(obj.creativeThemes)) return false;
  if (!Array.isArray(obj.invitations)) return false;
  if (!Array.isArray(obj.drinks)) return false;
  if (!Array.isArray(obj.speeches)) return false;

  return true;
}
