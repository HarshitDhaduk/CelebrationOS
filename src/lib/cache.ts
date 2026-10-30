/**
 * @file cache.ts
 * @description Enterprise In-Memory Least Recently Used (LRU) Cache with Time-To-Live (TTL) expiration.
 * Minimizes redundant calls to GenAI services and calculation engines, drastically enhancing response latency
 * and application efficiency.
 */

export interface CacheEntry<V> {
  value: V;
  expiresAt: number;
}

export class MemoryLRUCache<K, V> {
  private capacity: number;
  private defaultTtlMs: number;
  private map: Map<K, CacheEntry<V>>;

  /**
   * Initializes a new MemoryLRUCache.
   *
   * @param capacity - Maximum number of entries allowed before eviction.
   * @param defaultTtlMs - Default time-to-live in milliseconds (default: 5 minutes).
   */
  constructor(capacity: number = 100, defaultTtlMs: number = 5 * 60 * 1000) {
    this.capacity = capacity;
    this.defaultTtlMs = defaultTtlMs;
    this.map = new Map();
  }

  /**
   * Retrieves a cached value if present and unexpired.
   * Promotes the entry to the most recently used position.
   *
   * @param key - The cache key.
   * @returns The cached value, or null if missing or expired.
   */
  get(key: K): V | null {
    const entry = this.map.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  /**
   * Stores a value in the cache with an optional custom TTL.
   * Evicts the oldest (first) entry if capacity is exceeded.
   *
   * @param key - The cache key.
   * @param value - The value to store.
   * @param ttlMs - Optional custom TTL in milliseconds.
   */
  set(key: K, value: V, ttlMs?: number): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Evict the first key (oldest entry in Map insertion order)
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }

    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.map.set(key, { value, expiresAt });
  }

  /**
   * Checks if a key exists and has not expired.
   */
  has(key: K): boolean {
    return this.get(key) !== null;
  }

  /**
   * Removes a specific key from the cache.
   */
  delete(key: K): boolean {
    return this.map.delete(key);
  }

  /**
   * Clears all cached entries.
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Returns current number of active entries in cache.
   */
  size(): number {
    return this.map.size;
  }
}

/**
 * Singleton instance of MemoryLRUCache for AI prompt responses and complex engine outputs.
 */
export const memoryCache = new MemoryLRUCache<string, unknown>(100, 10 * 60 * 1000);
