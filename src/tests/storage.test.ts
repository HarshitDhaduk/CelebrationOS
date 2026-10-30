import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveProjectToStorage,
  loadProjectFromStorage,
  getPresetByEventType,
  saveGeminiApiKey,
  getGeminiApiKey,
} from '../services/storage';
import { weddingPreset } from '../data/defaultPresets';

const storageMap = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => storageMap.get(key) || null),
  setItem: vi.fn((key: string, value: string) => { storageMap.set(key, value); }),
  removeItem: vi.fn((key: string) => { storageMap.delete(key); }),
  clear: vi.fn(() => { storageMap.clear(); }),
};

vi.stubGlobal('localStorage', localStorageMock);

describe('Storage Service Suite', () => {
  beforeEach(() => {
    storageMap.clear();
    vi.clearAllMocks();
  });

  it('saves and reloads a project from localStorage correctly', () => {
    saveProjectToStorage(weddingPreset);
    const loaded = loadProjectFromStorage();
    expect(loaded.event.title).toBe(weddingPreset.event.title);
    expect(loaded.event.totalBudget).toBe(weddingPreset.event.totalBudget);
    expect(loaded.budgetItems.length).toBe(weddingPreset.budgetItems.length);
  });

  it('falls back to deep-cloned wedding preset if localStorage is empty', () => {
    const loaded = loadProjectFromStorage();
    expect(loaded.event.eventType).toBe('wedding');
    expect(loaded.event.title).toContain('Elena & Marcus');
  });

  it('deep clones presets so mutating one does not pollute the original data', () => {
    const wedding1 = getPresetByEventType('wedding');
    wedding1.event.title = 'Mutated Wedding Title';

    const wedding2 = getPresetByEventType('wedding');
    expect(wedding2.event.title).not.toBe('Mutated Wedding Title');
    expect(wedding2.event.title).toContain('Elena & Marcus');
  });

  it('returns appropriate presets for birthday and community types', () => {
    const birthday = getPresetByEventType('birthday');
    expect(birthday.event.eventType).toBe('birthday');
    expect(birthday.event.title).toContain('30th');

    const community = getPresetByEventType('community');
    expect(community.event.eventType).toBe('community');
    expect(community.event.title).toContain('Oakridge');
  });

  it('stores, retrieves, and clears the Gemini API key safely', () => {
    saveGeminiApiKey('AIzaSyCustomKey1234567890');
    expect(getGeminiApiKey()).toBe('AIzaSyCustomKey1234567890');

    saveGeminiApiKey('');
    expect(getGeminiApiKey()).toBe('');
  });
});
