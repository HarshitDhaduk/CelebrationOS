/**
 * @file client-cache.ts
 * @description Second tier of the dual-tier caching strategy.
 * Utilizes browser sessionStorage (with fallback to memory) to persist non-sensitive AI responses
 * and calculation outputs across page reloads without re-triggering remote API calls.
 */

import { memoryCache } from './cache';

export interface StorageCachePayload<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

export class ClientStorageCache {
  private prefix: string;

  constructor(prefix: string = 'celebration_cache_') {
    this.prefix = prefix;
  }

  private getStorage(): Storage | null {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage;
      }
      if (typeof sessionStorage !== 'undefined') {
        return sessionStorage;
      }
      return null;
    } catch {
      return null;
    }
  }

  public isStorageAvailable(): boolean {
    return this.getStorage() !== null;
  }

  /**
   * Reads an item from sessionStorage.
   *
   * @param key - Cache key.
   * @returns Cached value or null if expired or missing.
   */
  get<T>(key: string): T | null {
    const storage = this.getStorage();
    if (!storage) {
      return null;
    }

    try {
      const raw = storage.getItem(this.prefix + key);
      if (!raw) {
        return null;
      }

      const payload: StorageCachePayload<T> = JSON.parse(raw);
      if (Date.now() - payload.timestamp > payload.ttlMs) {
        storage.removeItem(this.prefix + key);
        return null;
      }

      return payload.data;
    } catch {
      return null;
    }
  }

  /**
   * Saves an item to sessionStorage.
   *
   * @param key - Cache key.
   * @param data - Payload to cache.
   * @param ttlMs - Time to live in ms (default: 15 minutes).
   */
  set<T>(key: string, data: T, ttlMs: number = 15 * 60 * 1000): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    try {
      const payload: StorageCachePayload<T> = {
        data,
        timestamp: Date.now(),
        ttlMs,
      };
      storage.setItem(this.prefix + key, JSON.stringify(payload));
    } catch {
      // Storage quota exceeded or disabled; fail silently
    }
  }

  /**
   * Removes an item from sessionStorage.
   */
  remove(key: string): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }
    storage.removeItem(this.prefix + key);
  }

  /**
   * Clears all items associated with this prefix.
   */
  clear(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }
    const keysToRemove: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i);
      if (k && k.startsWith(this.prefix)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => storage.removeItem(k));
  }
}

export const clientStorageCache = new ClientStorageCache();

/**
 * Dual-tier caching helper: checks MemoryLRUCache first, then sessionStorage.
 * If both miss, executes the fetcher, updates both tiers, and returns the result.
 *
 * @param key - Cache lookup key.
 * @param fetcher - Async or sync computation callback.
 * @param ttlMs - Time to live in milliseconds.
 * @returns Cached or newly computed value.
 */
export async function getOrSetDualCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = 10 * 60 * 1000
): Promise<T> {
  // Tier 1: In-Memory LRU Cache
  const memoryResult = memoryCache.get(key) as T | null;
  if (memoryResult !== null && memoryResult !== undefined) {
    return memoryResult;
  }

  // Tier 2: Browser Session Storage Cache
  const storageResult = clientStorageCache.get<T>(key);
  if (storageResult !== null && storageResult !== undefined) {
    memoryCache.set(key, storageResult, ttlMs);
    return storageResult;
  }

  // Cache Miss: compute and populate both tiers
  const freshData = await fetcher();
  memoryCache.set(key, freshData, ttlMs);
  clientStorageCache.set(key, freshData, ttlMs);
  return freshData;
}
