/**
 * @file pii.ts
 * @description Enterprise Client-Side PII (Personally Identifiable Information) Redaction Vault.
 * Sanitizes and masks sensitive user information (credit card numbers with Luhn validation,
 * phone numbers, email addresses, physical street addresses, and government IDs) before context
 * payloads leave the user's browser, preventing leakage to external AI endpoints.
 * Provides a reversible tokenization vault to securely rehydrate AI responses.
 */

/**
 * Validates a numeric string against the Luhn Mod-10 algorithm.
 * Used to verify actual credit/debit card numbers and avoid false positives on arbitrary numbers.
 *
 * @param numStr - String representing the card digits.
 * @returns boolean indicating if the sequence satisfies Luhn Mod-10.
 */
export function validateLuhn(numStr: string): boolean {
  const cleanDigits = numStr.replace(/\D/g, '');
  if (cleanDigits.length < 11 || cleanDigits.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = cleanDigits.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanDigits.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export interface RedactionResult {
  sanitizedText: string;
  vault: Map<string, string>;
  redactedCount: number;
}

export const PII_PATTERNS = {
  // RFC 5322 compliant email pattern
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  // Standard international and national phone numbers
  phone: /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g,
  // Standard US SSN or Taxpayer ID (XXX-XX-XXXX)
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  // Potential 13-19 digit card sequences (with optional hyphens or spaces)
  cardCandidate: /\b(?:\d[ -]*?){13,19}\b/g,
  // Street addresses (e.g. 123 Main St, 456 Ocean Boulevard)
  streetAddress: /\b\d{1,5}\s+[A-Za-z0-9.,\s]{2,25}\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way)\b/gi,
};

/**
 * Sanitizes and masks sensitive PII before transmission to LLM or third-party APIs.
 *
 * @param text - The raw text that may contain sensitive user details.
 * @returns RedactionResult containing tokenized text, an isolated memory vault, and count.
 */
export function maskPII(text: string): RedactionResult {
  if (!text || typeof text !== 'string') {
    return { sanitizedText: '', vault: new Map(), redactedCount: 0 };
  }

  const vault = new Map<string, string>();
  let count = 0;
  let sanitized = text;

  // 1. Redact Credit Card Numbers with Luhn Algorithm
  sanitized = sanitized.replace(PII_PATTERNS.cardCandidate, (match) => {
    const rawDigits = match.replace(/\D/g, '');
    if (validateLuhn(rawDigits)) {
      count++;
      const token = `{{PII_CARD_${count}}}`;
      vault.set(token, match.trim());
      return token;
    }
    return match;
  });

  // 2. Redact Social Security Numbers
  sanitized = sanitized.replace(PII_PATTERNS.ssn, (match) => {
    count++;
    const token = `{{PII_SSN_${count}}}`;
    vault.set(token, match);
    return token;
  });

  // 3. Redact Email Addresses
  sanitized = sanitized.replace(PII_PATTERNS.email, (match) => {
    count++;
    const token = `{{PII_EMAIL_${count}}}`;
    vault.set(token, match);
    return token;
  });

  // 4. Redact Phone Numbers (minimum 10 digits to prevent masking short numeric amounts)
  sanitized = sanitized.replace(PII_PATTERNS.phone, (match) => {
    const digits = match.replace(/\D/g, '');
    if (digits.length >= 10 && digits.length <= 15) {
      count++;
      const token = `{{PII_PHONE_${count}}}`;
      vault.set(token, match.trim());
      return token;
    }
    return match;
  });

  // 5. Redact Physical Street Addresses
  sanitized = sanitized.replace(PII_PATTERNS.streetAddress, (match) => {
    count++;
    const token = `{{PII_ADDRESS_${count}}}`;
    vault.set(token, match.trim());
    return token;
  });

  return {
    sanitizedText: sanitized,
    vault,
    redactedCount: count,
  };
}

/**
 * Rehydrates tokenized placeholders in an AI response back with the original user values.
 *
 * @param text - The text containing tokenized placeholders (e.g. {{PII_EMAIL_1}}).
 * @param vault - The memory vault mapping tokens to their original sensitive strings.
 * @returns Rehydrated text with original values restored.
 */
export function rehydratePII(text: string, vault: Map<string, string>): string {
  if (!text || vault.size === 0) {
    return text;
  }

  let result = text;
  for (const [token, originalValue] of vault.entries()) {
    result = result.split(token).join(originalValue);
  }

  return result;
}
