# CelebrationOS Security Policy & Privacy Architecture 🔒

> **Zero-Secret Isolation, Client-Side PII Vault, Adversarial Prompt Defenses & Prototype Pollution Protection**  
> *Google PromptWars — Challenge 5: Celebration & Event Planner*

---

## 1. Security Architecture Principles

CelebrationOS is designed with an uncompromising defense-in-depth posture adhering to the principle of least privilege, zero-trust data ingestion, and client-side data sovereignty.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER BOUNDARY                           │
│                                                                        │
│  [User Prompt] ──▶ [Prompt Injection Filter]                           │
│                              │ (Safe)                                  │
│                              ▼                                         │
│                      [Client PII Vault]                                │
│                     (Luhn Algorithm Scrub)                             │
│                              │ (Masked: {{PII_EMAIL_1}})               │
│                              ▼                                         │
│                    [Sliding Rate Limiter]                              │
│                              │ (Quota Passed)                          │
│                              ▼                                         │
│                    [Dual-Tier LRU Cache]                               │
│                              │ (Miss)                                  │
│                              ▼                                         │
│               [HTTPS Direct to Google Gemini API]                      │
│                              │                                         │
└──────────────────────────────┼─────────────────────────────────────────┘
                               │ HTTPS Encrypted (TLS 1.3)
                               ▼
               [Google AI Studio: Gemini 2.5 Flash]
```

---

## 2. Core Security Controls

### 2.1 Zero-Secret Architecture
- **No Hardcoded Credentials**: No API keys, tokens, or environment secrets are embedded in the Git history or distribution bundles.
- **Client-Side Key Isolation**: Optional Google Gemini API keys provided by the user are stored strictly in client-side memory or browser `localStorage` and dispatched directly over TLS to Google's official endpoints (`generativelanguage.googleapis.com`). Keys never touch third-party proxy servers.

### 2.2 Client-Side PII Vault (`src/lib/pii.ts`)
- Sensitive personal data is intercepted and masked before any payload leaves the client browser.
- **Credit / Debit Cards**: Validated using the **Luhn Mod-10 algorithm** to avoid false positives on arbitrary integers. Real card numbers are replaced with `{{PII_CARD_n}}`.
- **Contact Details**: International and domestic phone numbers and RFC 5322 email addresses are scrubbed into `{{PII_PHONE_n}}` and `{{PII_EMAIL_n}}`.
- **Locations & IDs**: US SSNs/Taxpayer IDs and physical street addresses are masked into isolated tokens.
- **Token Rehydration**: Generated AI outputs pass through `rehydratePII()`, restoring original values securely on the user's screen without the external LLM ever seeing the raw data.

### 2.3 Adversarial Prompt Injection Defense (`src/lib/security.ts`)
CelebrationOS implements active pattern heuristics to neutralize known LLM jailbreak vectors:
- Detects instruction overrides (`"ignore previous instructions"`, `"disregard above"`).
- Flags personality hijacks (`"you are now DAN"`, `"developer mode"`).
- Blocks system prompt exfiltration probes (`"reveal your system prompt"`).
- Rejects delimiter stuffing and control character sequences.

### 2.4 Prototype Pollution Protection (`src/lib/security.ts`)
When importing JSON backup files, CelebrationOS executes deep recursive traversal to verify that no malicious objects contain prototype-polluting keys:
- Blocks `__proto__` property overrides.
- Blocks `constructor` prototype manipulation.
- Rejects invalid schemas via strict **Zod runtime validation** (`EventProjectSchema.safeParse()`).

### 2.5 Cross-Site Scripting (XSS) Sanitization
- All dynamic markdown rendering and user-supplied text strings are processed through `sanitizeText()`, stripping malicious `<script>`, `<iframe>`, `javascript:`, and inline event attributes (`onerror=`, `onload=`).
- Mathematical comparison operators (`<`, `>`) in financial planning are preserved safely.

### 2.6 Content Security Policy (CSP)
Strict CSP rules are enforced via HTML `<meta>` tags:
- `default-src 'self'`: Disallows loading unapproved external scripts.
- `connect-src 'self' https://generativelanguage.googleapis.com`: Restricts network communication exclusively to the origin and Google's official Gemini AI endpoint.
- `script-src 'self' 'unsafe-inline'`: Prevents external script injection.

---

## 3. Vulnerability Reporting

If you discover a security vulnerability in CelebrationOS, please report it privately:
- **Author**: Harshit Dhaduk
- **Email**: `harshitdhaduk5831@gmail.com`
- **Response SLA**: Within 24 hours.
