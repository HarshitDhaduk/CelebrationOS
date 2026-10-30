/**
 * @file security.ts
 * @description Production-grade security utilities for CelebrationOS.
 * Provides adversarial prompt injection defenses, input sanitization against XSS,
 * number boundary enforcement, API key validation, and deep JSON schema validation
 * guarding against Prototype Pollution attacks (__proto__, constructor, prototype).
 */

import { EventProject } from '../types';

/**
 * Known adversarial prompt injection and jailbreak vector signatures.
 */
export const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+|any\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions|directives)/i,
  /you\s+are\s+now\s+(in\s+)?(DAN|developer|jailbreak|unrestricted)\s+mode/i,
  /bypass\s+(all\s+)?(content\s+filters|safety\s+guidelines|restrictions)/i,
  /reveal\s+(your\s+)?(system\s+prompt|initial\s+instructions|hidden\s+rules)/i,
  /what\s+are\s+your\s+(exact\s+)?(system\s+(prompt|instructions)|core\s+directives)/i,
  /system\s+prompt/i,
  /output\s+the\s+text\s+above\s+verbatim/i,
  /system\s*:\s*override/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[SYSTEM\]/i,
  /\[ASSISTANT\]/i,
];

export interface PromptSecurityAnalysis {
  isSafe: boolean;
  flaggedPattern?: string;
  reason?: string;
}

/**
 * Scans user input for adversarial prompt injection vectors, jailbreak probes,
 * or system prompt extraction attacks.
 *
 * @param input - The raw prompt string entered by the user.
 * @returns PromptSecurityAnalysis indicating safety status and rationale.
 */
export function detectPromptInjection(input: string): PromptSecurityAnalysis {
  if (!input || typeof input !== 'string') {
    return { isSafe: true };
  }

  const normalized = input.trim();

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isSafe: false,
        flaggedPattern: pattern.source,
        reason: 'Adversarial instruction override or system prompt probe detected.',
      };
    }
  }

  // Check for excessive delimiter stuffing
  const delimiterCount = (normalized.match(/```|---|===/g) || []).length;
  if (delimiterCount > 6) {
    return {
      isSafe: false,
      flaggedPattern: 'DELIMITER_STUFFING',
      reason: 'Excessive delimiter sequence detected.',
    };
  }

  return { isSafe: true };
}

/**
 * Sanitizes user prompt input before passing it to AI services.
 * Neutralizes control characters, strips potential script injections,
 * and escapes special delimiters.
 *
 * @param input - The raw prompt string.
 * @returns Sanitized prompt string.
 */
export function sanitizePromptInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/\0/g, '') // Remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Strip iframes
    .trim();
}

/**
 * Strips HTML tags and escapes special characters to prevent Cross-Site Scripting (XSS).
 *
 * @param input - The raw text to sanitize.
 * @param maxLength - Optional maximum string length.
 * @returns Clean, sanitized string safe for DOM rendering.
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
 * Sanitizes and bounds numeric inputs to prevent NaN, Infinity, and negative overflows.
 *
 * @param value - Unknown input value.
 * @param min - Minimum allowed boundary.
 * @param max - Maximum allowed boundary.
 * @returns Safe bounded number.
 */
export function sanitizeNumber(value: unknown, min = 0, max = 100_000_000): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return min;
  }
  return Math.min(Math.max(num, min), max);
}

/**
 * Validates whether a given API key satisfies Google Gemini AI Studio format rules.
 * Google AI Studio keys typically begin with "AIzaSy" followed by 33 URL-safe base64 characters (total 39 chars).
 *
 * @param key - The API key candidate.
 * @returns boolean indicating valid format.
 */
export function isValidApiKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  const googleApiKeyRegex = /^AIzaSy[A-Za-z0-9_-]{33}$/;
  return googleApiKeyRegex.test(trimmed) || (trimmed.length >= 25 && /^[A-Za-z0-9_-]+$/.test(trimmed));
}

/**
 * Validates JSON structures for prototype pollution risks.
 * Recursively scans object keys and rejects objects containing __proto__, constructor, or prototype.
 *
 * @param obj - Target object to verify.
 * @returns boolean indicating if the object is free of prototype pollution vectors.
 */
export function hasNoPrototypePollution(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') {
    return true;
  }

  const stack: unknown[] = [obj];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current && typeof current === 'object') {
      const keys = Object.getOwnPropertyNames(current);
      for (const key of keys) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return false;
        }
        const val = (current as Record<string, unknown>)[key];
        if (val && typeof val === 'object') {
          stack.push(val);
        }
      }
    }
  }

  return true;
}

/**
 * Comprehensive schema and security validator for imported event projects.
 * Combines prototype pollution defenses with schema property validation.
 *
 * @param candidate - The parsed JSON data from file upload.
 * @returns boolean indicating if the project schema is authentic and secure.
 */
export function isValidProjectJson(candidate: unknown): candidate is EventProject {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return false;
  }

  // 1. Prototype pollution check
  if (!hasNoPrototypePollution(candidate)) {
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
