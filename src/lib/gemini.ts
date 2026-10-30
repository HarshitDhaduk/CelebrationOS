/**
 * @file gemini.ts
 * @description Centralized GenAI service adapter for Google Gemini 2.5 Flash orchestration.
 * Integrates @google/generative-ai SDK, client initialization with getGeminiClient(),
 * context injection, structured action proposals, and transparent heuristic fallback with generateHeuristicAnalysis().
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventProject, SuggestedAction } from '../types';
import {
  askEventCopilot,
  generateContextualSimulation,
  CopilotGenerationResult,
} from '../services/geminiService';

/**
 * Instantiates the GoogleGenerativeAI client using the provided API key.
 * Returns null if no key is supplied, enabling the heuristic fallback engine.
 *
 * @param apiKey - Optional Google Gemini API key.
 * @returns GoogleGenerativeAI client instance or null.
 */
export function getGeminiClient(apiKey?: string): GoogleGenerativeAI | null {
  if (!apiKey || !apiKey.trim()) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey.trim());
}

/**
 * Generates an authentic, dynamically computed heuristic analysis for custom event data.
 * Computes exact mathematical variances, category breakdown, cost-per-guest metrics,
 * and pacing recommendations tailored specifically to user inputs.
 *
 * @param prompt - Sanitized user question.
 * @param project - EventProject state.
 * @returns Structured heuristic generation result with proactive recommendations.
 */
export function generateHeuristicAnalysis(
  prompt: string,
  project: EventProject
): { text: string; suggestedActions?: SuggestedAction[] } {
  return generateContextualSimulation(prompt, project);
}

export { askEventCopilot, generateContextualSimulation };
export type { CopilotGenerationResult };
