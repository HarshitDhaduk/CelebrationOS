import { useState, useCallback } from 'react';
import { getGeminiApiKey, saveGeminiApiKey } from '../services/storage';
import { isValidApiKey } from '../utils/security';

/**
 * Custom React hook managing the Google Gemini API key state and secure persistence.
 *
 * @returns Object with apiKey, updateApiKey, clearApiKey, and isValidKey
 */
export function useGeminiApiKey() {
  const [apiKey, setApiKey] = useState<string>(() => getGeminiApiKey());

  const updateApiKey = useCallback((newKey: string) => {
    const clean = newKey.trim();
    saveGeminiApiKey(clean);
    setApiKey(clean);
  }, []);

  const clearApiKey = useCallback(() => {
    saveGeminiApiKey('');
    setApiKey('');
  }, []);

  const isValid = apiKey ? isValidApiKey(apiKey) : false;

  return { apiKey, updateApiKey, clearApiKey, isValid };
}
