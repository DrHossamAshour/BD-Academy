// Simple in-memory cache implementation
// In production, consider using Redis or similar

interface CacheEntry {
  data: any;
  expiry: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  set(key: string, data: any, ttlSeconds: number = 300): void {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { data, expiry });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Global cache instance
const cache = new MemoryCache();

export default cache;

// Cache keys constants
export const CACHE_KEYS = {
  COURSES_PUBLIC: 'courses:public',
  COURSE_BY_ID: (id: string) => `course:${id}`,
  USER_BY_ID: (id: string) => `user:${id}`,
  USER_BY_EMAIL: (email: string) => `user:email:${email}`,
  INSTRUCTOR_COURSES: (id: string) => `instructor:courses:${id}`,
  COURSE_STATS: (id?: string) => id ? `stats:course:${id}` : 'stats:courses',
  USER_STATS: 'stats:users',
  ORDER_STATS: 'stats:orders',
};

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  SHORT: 60,      // 1 minute
  MEDIUM: 300,    // 5 minutes
  LONG: 1800,     // 30 minutes
  VERY_LONG: 3600 // 1 hour
};