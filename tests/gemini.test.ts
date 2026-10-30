/**
 * @file gemini.test.ts
 * @description Root test suite for src/lib/gemini.ts orchestration, getGeminiClient, and generateHeuristicAnalysis.
 */

import { describe, it, expect } from 'vitest';
import { getGeminiClient, generateHeuristicAnalysis } from '../src/lib/gemini';
import { weddingPreset } from '../src/data/defaultPresets';

describe('Root Suite: Gemini Service Adapter & Heuristics', () => {
  it('instantiates GoogleGenerativeAI client when API key is provided', () => {
    expect(getGeminiClient()).toBeNull();
    expect(getGeminiClient('AIzaSyValidTestKey1234567890')).toBeDefined();
  });

  it('runs authentic generateHeuristicAnalysis on custom project state', () => {
    const res = generateHeuristicAnalysis('How much does catering cost per guest?', weddingPreset);
    expect(res.text).toContain('Budget Intelligence Analysis');
    expect(res.suggestedActions).toBeDefined();
    expect(res.suggestedActions!.length).toBeGreaterThan(0);
  });
});
