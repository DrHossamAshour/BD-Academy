import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory storage for rate limiting (in production, use Redis or database)
const store: RateLimitStore = {};

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  statusCode?: number;
}

export class RateLimiter {
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = {
      statusCode: 429,
      message: 'Too many requests, please try again later.',
      ...options,
    };
  }

  private getClientKey(request: NextRequest): string {
    // Get client IP from various possible headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
    
    // Include user agent to make it more unique
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    return `${clientIp}:${userAgent}`;
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    Object.keys(store).forEach(key => {
      if (store[key].resetTime <= now) {
        delete store[key];
      }
    });
  }

  async isRateLimited(request: NextRequest): Promise<{
    isLimited: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const key = this.getClientKey(request);
    const now = Date.now();

    // Clean up expired entries periodically
    this.cleanupExpiredEntries();

    // Check if entry exists and is still valid
    if (!store[key] || store[key].resetTime <= now) {
      // Create new entry or reset existing one
      store[key] = {
        count: 1,
        resetTime: now + this.options.windowMs,
      };
      
      return {
        isLimited: false,
        remaining: this.options.maxRequests - 1,
        resetTime: store[key].resetTime,
      };
    }

    // Increment count
    store[key].count++;

    const isLimited = store[key].count > this.options.maxRequests;
    const remaining = Math.max(0, this.options.maxRequests - store[key].count);

    return {
      isLimited,
      remaining,
      resetTime: store[key].resetTime,
    };
  }

  async middleware(request: NextRequest): Promise<NextResponse | null> {
    const { isLimited, remaining, resetTime } = await this.isRateLimited(request);

    if (isLimited) {
      const response = NextResponse.json(
        { 
          error: this.options.message,
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        },
        { status: this.options.statusCode }
      );

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', this.options.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());
      response.headers.set('Retry-After', Math.ceil((resetTime - Date.now()) / 1000).toString());

      return response;
    }

    return null; // Continue to next handler
  }
}

// Pre-configured rate limiters for different use cases
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
});

export const generalApiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'Rate limit exceeded, please slow down your requests.',
});

export const strictApiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute for sensitive operations
  message: 'Rate limit exceeded for sensitive operations.',
});