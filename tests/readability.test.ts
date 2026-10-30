/**
 * @file readability.test.ts
 * @description Unit tests for speech and invitation readability calculations.
 */

import { describe, it, expect } from 'vitest';
import {
  countSyllables,
  calculateFleschReadingEase,
  calculateFleschKincaidGradeLevel,
  analyzeSpeechReadability,
} from '../src/lib/readability';

describe('Readability & Linguistic Engine Suite', () => {
  it('accurately counts syllables in common words', () => {
    expect(countSyllables('wedding')).toBe(2);
    expect(countSyllables('celebration')).toBe(4);
    expect(countSyllables('toast')).toBe(1);
    expect(countSyllables('cake')).toBe(1); // Silent 'e'
  });

  it('calculates Flesch Reading Ease correctly', () => {
    // 10 words, 1 sentence, 12 syllables -> 206.835 - 1.015*(10) - 84.6*(1.2) = ~95.2
    const score = calculateFleschReadingEase(10, 1, 12);
    expect(score).toBeGreaterThan(80);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('calculates Flesch-Kincaid Grade Level correctly', () => {
    const grade = calculateFleschKincaidGradeLevel(15, 1, 20);
    expect(grade).toBeGreaterThan(0);
    expect(grade).toBeLessThanOrEqual(12);
  });

  it('analyzes entire wedding toast speech for delivery cadence', () => {
    const toastText = `Welcome everyone to this joyful evening. We are here to celebrate love, laughter, and lifelong friendship. To the happy couple!`;
    const metrics = analyzeSpeechReadability(toastText, 130);

    expect(metrics.wordCount).toBeGreaterThan(15);
    expect(metrics.sentenceCount).toBe(3);
    expect(metrics.fleschReadingEase).toBeGreaterThan(50);
    expect(metrics.estimatedMinutes).toBeGreaterThan(0);
    expect(metrics.clarityAssessment).toBeDefined();
  });
});
