/**
 * @file readability.ts
 * @description Linguistic and readability analysis engine for CelebrationOS.
 * Evaluates speech drafts, digital invitation copy, and vendor RFP inquiries using
 * algorithmic metrics (Flesch Reading Ease, Flesch-Kincaid Grade Level, words-per-minute
 * delivery cadence, and pacing clarity).
 */

export interface SpeechReadabilityMetrics {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  fleschReadingEase: number;
  gradeLevel: number;
  estimatedMinutes: number;
  pacingPacingLevel: 'slow' | 'conversational' | 'fast';
  clarityAssessment: string;
}

/**
 * Counts total syllables in an English word using phonetic regex rules.
 *
 * @param word - Input word.
 * @returns Number of syllables (minimum 1).
 */
export function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean || clean.length <= 3) {
    return 1;
  }

  // Count vowel sequences
  const syllables = clean.match(/[aeiouy]{1,2}/g);
  let count = syllables ? syllables.length : 1;

  // Subtract silent 'e' at end of words
  if (clean.endsWith('e') && !clean.endsWith('le') && count > 1) {
    count--;
  }

  return Math.max(1, count);
}

/**
 * Calculates Flesch Reading Ease score.
 * Formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
 * Scale: 90-100 (Very Easy), 60-70 (Standard / Conversational), < 30 (Very Confusing).
 *
 * @param words - Total word count.
 * @param sentences - Total sentence count.
 * @param syllables - Total syllable count.
 * @returns Bounded score between 0 and 100.
 */
export function calculateFleschReadingEase(
  words: number,
  sentences: number,
  syllables: number
): number {
  if (words === 0 || sentences === 0) return 100;
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

/**
 * Calculates Flesch-Kincaid Grade Level.
 * Formula: 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
 *
 * @param words - Total word count.
 * @param sentences - Total sentence count.
 * @param syllables - Total syllable count.
 * @returns US school grade level equivalent.
 */
export function calculateFleschKincaidGradeLevel(
  words: number,
  sentences: number,
  syllables: number
): number {
  if (words === 0 || sentences === 0) return 0;
  const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  return Math.max(1, Math.min(18, Math.round(grade * 10) / 10));
}

/**
 * Evaluates speech text or invitation copy and returns delivery metrics.
 *
 * @param text - The prose text to analyze.
 * @param wordsPerMinute - Average speaking rate (default: 135 WPM).
 * @returns SpeechReadabilityMetrics containing cadence and accessibility scores.
 */
export function analyzeSpeechReadability(
  text: string,
  wordsPerMinute: number = 135
): SpeechReadabilityMetrics {
  if (!text || typeof text !== 'string') {
    return {
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      fleschReadingEase: 100,
      gradeLevel: 1,
      estimatedMinutes: 0,
      pacingPacingLevel: 'conversational',
      clarityAssessment: 'No content provided.',
    };
  }

  // Segment words
  const rawWords = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const wordCount = rawWords.length;

  // Segment sentences
  const rawSentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, rawSentences.length);

  // Compute syllables
  const syllableCount = rawWords.reduce((sum, w) => sum + countSyllables(w), 0);

  const fleschReadingEase = calculateFleschReadingEase(wordCount, sentenceCount, syllableCount);
  const gradeLevel = calculateFleschKincaidGradeLevel(wordCount, sentenceCount, syllableCount);
  const estimatedMinutes = Math.round((wordCount / wordsPerMinute) * 10) / 10;

  let pacingPacingLevel: 'slow' | 'conversational' | 'fast' = 'conversational';
  if (wordsPerMinute < 120) pacingPacingLevel = 'slow';
  else if (wordsPerMinute > 150) pacingPacingLevel = 'fast';

  let clarityAssessment = 'Excellent speech clarity. Highly accessible for guests of all ages.';
  if (fleschReadingEase < 50) {
    clarityAssessment = 'Complex vocabulary detected. Consider simplifying sentence structures for vocal delivery.';
  } else if (fleschReadingEase > 80) {
    clarityAssessment = 'Warm, punchy, and conversational. Ideal for wedding toasts and milestone birthday speeches.';
  }

  return {
    wordCount,
    sentenceCount,
    syllableCount,
    fleschReadingEase,
    gradeLevel,
    estimatedMinutes,
    pacingPacingLevel,
    clarityAssessment,
  };
}
