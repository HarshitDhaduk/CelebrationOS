import { describe, it, expect, vi } from 'vitest';
import { askEventCopilot, generateContextualSimulation } from '../services/geminiService';
import { weddingPreset } from '../data/defaultPresets';

describe('Gemini AI & Simulation Service Suite', () => {
  it('generates high-value budget intelligence in offline simulation', () => {
    const res = generateContextualSimulation('How can I optimize my wedding budget?', weddingPreset);
    expect(res.text).toContain('Budget Intelligence Analysis');
    expect(res.text).toContain('Total Planned Budget');
    expect(res.suggestedActions).toBeDefined();
    expect(res.suggestedActions!.length).toBeGreaterThan(0);
  });

  it('generates pacing and run-of-show advice for timeline queries', () => {
    const res = generateContextualSimulation('Review my timeline schedule and run of show', weddingPreset);
    expect(res.text).toContain('Run-of-Show & Timing Optimization');
    expect(res.text).toContain('Golden Hour Buffer');
    expect(res.suggestedActions?.some((a) => a.actionType === 'switch_tab' || a.actionType === 'add_timeline')).toBe(true);
  });

  it('generates vendor questions and RFP guidance for vendor queries', () => {
    const res = generateContextualSimulation('Help me find a catering vendor and draft RFP', weddingPreset);
    expect(res.text).toContain('Vendor Management & RFP Strategy');
    expect(res.text).toContain('Vendor RFP Inquiry Generator');
  });

  it('generates signature cocktail and creative theme ideas for creative queries', () => {
    const res = generateContextualSimulation('Give me ideas for signature cocktails and theme colors', weddingPreset);
    expect(res.text).toContain('Personalized Creative Ideation Studio');
    expect(res.text).toContain('Signature Beverage Concept');
  });

  it('askEventCopilot operates seamlessly offline when no API key is supplied', async () => {
    const res = await askEventCopilot('What is my cost per guest?', weddingPreset);
    expect(res.isLiveApi).toBe(false);
    expect(res.text.length).toBeGreaterThan(50);
  });

  it('falls back to simulation gracefully if network or API call fails', async () => {
    // Mock fetch to simulate API failure
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const res = await askEventCopilot('Check my budget', weddingPreset, 'AIzaSyFakeKey1234567890');
    expect(res.isLiveApi).toBe(false);
    expect(res.text).toContain('Live Gemini Note: Switched to Intelligent Local Engine');
    expect(res.text).toContain('Budget Intelligence Analysis');
  });
});
