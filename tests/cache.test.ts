/**
 * @file cache.test.ts
 * @description Root test suite for MemoryLRUCache and ClientStorageCache dual-tier architecture.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryLRUCache } from '../src/lib/cache';
import { ClientStorageCache, getOrSetDualCache } from '../src/lib/client-cache';

describe('Root Suite: Dual-Tier Cache & MemoryLRU', () => {
  let cache: MemoryLRUCache<string, number>;

  beforeEach(() => {
    cache = new MemoryLRUCache<string, number>(2, 500);
  });

  it('stores and retrieves cached numbers', () => {
    cache.set('totalBudget', 45000);
    expect(cache.get('totalBudget')).toBe(45000);
  });

  it('evicts least recently used items when limit exceeded', () => {
    cache.set('item1', 100);
    cache.set('item2', 200);
    cache.get('item1'); // Promotes item1
    cache.set('item3', 300); // Evicts item2

    expect(cache.get('item1')).toBe(100);
    expect(cache.get('item2')).toBeNull();
    expect(cache.get('item3')).toBe(300);
  });

  it('verifies client storage cache instantiation and helper methods', () => {
    const storageCache = new ClientStorageCache('test_');
    expect(storageCache).toBeDefined();
    expect(typeof storageCache.get).toBe('function');
    expect(typeof storageCache.set).toBe('function');
  });

  it('verifies getOrSetDualCache function interface', async () => {
    const fetcher = async () => 'computed_value';
    const result = await getOrSetDualCache('test_key', fetcher);
    expect(result).toBe('computed_value');
  });
});
