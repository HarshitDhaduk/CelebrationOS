import { EventProject, EventType } from '../types';
import { weddingPreset, birthdayPreset, communityPreset } from '../data/defaultPresets';
import { isValidProjectJson } from '../utils/security';

const STORAGE_KEY = 'celebration_os_active_project';
const API_KEY_STORAGE = 'celebration_os_gemini_key';

export function saveProjectToStorage(project: EventProject): void {
  try {
    const updated = {
      ...project,
      event: {
        ...project.event,
        updatedAt: new Date().toISOString()
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save project to localStorage', err);
  }
}

export function loadProjectFromStorage(): EventProject {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (isValidProjectJson(parsed)) {
        return parsed;
      }
      console.warn('Stored project schema invalid, resetting to default wedding preset');
    }
  } catch (err) {
    console.warn('Error reading from localStorage, using default wedding preset', err);
  }
  return JSON.parse(JSON.stringify(weddingPreset));
}

export function getPresetByEventType(type: EventType): EventProject {
  switch (type) {
    case 'wedding':
      return JSON.parse(JSON.stringify(weddingPreset));
    case 'birthday':
      return JSON.parse(JSON.stringify(birthdayPreset));
    case 'community':
      return JSON.parse(JSON.stringify(communityPreset));
    default:
      return JSON.parse(JSON.stringify(weddingPreset));
  }
}

export function exportProjectAsJson(project: EventProject): void {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_plan.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function saveGeminiApiKey(key: string): void {
  try {
    if (!key) {
      localStorage.removeItem(API_KEY_STORAGE);
    } else {
      localStorage.setItem(API_KEY_STORAGE, key.trim());
    }
  } catch (e) {
    console.error('Failed to store API key', e);
  }
}

export function getGeminiApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}
