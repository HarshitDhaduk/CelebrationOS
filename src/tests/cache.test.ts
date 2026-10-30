/**
 * @file cache.test.ts
 * @description Unit tests for MemoryLRUCache and dual-tier caching strategies.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryLRUCache } from '../lib/cache';
import { ClientStorageCache, getOrSetDualCache } from '../lib/client-cache';

describe('MemoryLRUCache & Dual-Tier Caching Suite', () => {
  let cache: MemoryLRUCache<string, string>;

  beforeEach(() => {
    cache = new MemoryLRUCache<string, string>(3, 1000); // capacity 3, ttl 1000ms
  });

  it('stores and retrieves cached entries', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
    expect(cache.has('key1')).toBe(true);
  });

  it('evicts the least recently used item when capacity is exceeded', () => {
    cache.set('a', 'alpha');
    cache.set('b', 'beta');
    cache.set('c', 'charlie');

    // Access 'a' to promote it as recently used
    expect(cache.get('a')).toBe('alpha');

    // Add 4th item, which should evict 'b' (the oldest unaccessed)
    cache.set('d', 'delta');

    expect(cache.get('a')).toBe('alpha');
    expect(cache.get('b')).toBeNull(); // evicted
    expect(cache.get('c')).toBe('charlie');
    expect(cache.get('d')).toBe('delta');
  });

  it('expires entries after TTL duration', async () => {
    cache.set('temp', 'temporary', 50); // 50ms TTL
    expect(cache.get('temp')).toBe('temporary');

    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(cache.get('temp')).toBeNull();
  });

  it('clears all entries upon clear() call', () => {
    cache.set('k1', 'v1');
    cache.set('k2', 'v2');
    expect(cache.size()).toBe(2);

    cache.clear();
    expect(cache.size()).toBe(0);
    expect(cache.get('k1')).toBeNull();
  });

  it('ClientStorageCache persists and retrieves serialized payloads', () => {
    const storageCache = new ClientStorageCache('test_prefix_');
    const mockStorage = new Map<string, string>();

    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => mockStorage.get(k) || null,
      setItem: (k: string, v: string) => mockStorage.set(k, v),
      removeItem: (k: string) => mockStorage.delete(k),
      clear: () => mockStorage.clear(),
      key: () => null,
      length: 0,
    });

    storageCache.set('budget_summary', { total: 50000 });
    const fetched = storageCache.get<{ total: number }>('budget_summary');
    expect(fetched?.total).toBe(50000);

    storageCache.remove('budget_summary');
    expect(storageCache.get('budget_summary')).toBeNull();
  });

  it('getOrSetDualCache executes fetcher only on cache miss', async () => {
    const fetcherMock = vi.fn().mockResolvedValue({ status: 'fresh' });

    const result1 = await getOrSetDualCache('dual_key_1', fetcherMock);
    expect(result1).toEqual({ status: 'fresh' });
    expect(fetcherMock).toHaveBeenCalledTimes(1);

    // Second call should retrieve from Tier 1 Memory cache without calling fetcher
    const result2 = await getOrSetDualCache('dual_key_1', fetcherMock);
    expect(result2).toEqual({ status: 'fresh' });
    expect(fetcherMock).toHaveBeenCalledTimes(1);
  });
});
