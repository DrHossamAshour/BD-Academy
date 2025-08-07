// Rate limiting configuration and utilities
import { NextRequest } from 'next/server';

// In-memory store for rate limiting (for development/small scale)
// In production, consider using Redis or other distributed cache
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
}

// Default rate limit configurations
export const rateLimitConfigs = {
  // General API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: 'Too many requests, please try again later.'
  },
  // Authentication endpoints (more restrictive)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.'
  },
  // Payment endpoints (very restrictive)
  payment: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 payment attempts per hour
    message: 'Too many payment attempts, please try again later.'
  }
};

export function isRateLimited(request: NextRequest, config: RateLimitConfig): boolean {
  const clientIp = getClientIP(request);
  const key = `${clientIp}:${request.nextUrl.pathname}`;
  const now = Date.now();
  
  // Clean expired entries periodically
  cleanExpiredEntries(now);
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // First request or window has expired, reset the counter
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return false;
  }
  
  if (entry.count >= config.maxRequests) {
    return true; // Rate limited
  }
  
  // Increment counter
  entry.count++;
  return false;
}

export function getRateLimitHeaders(request: NextRequest, config: RateLimitConfig) {
  const clientIp = getClientIP(request);
  const key = `${clientIp}:${request.nextUrl.pathname}`;
  const entry = rateLimitStore.get(key);
  
  const remaining = entry ? Math.max(0, config.maxRequests - entry.count) : config.maxRequests;
  const resetTime = entry ? Math.ceil((entry.resetTime - Date.now()) / 1000) : Math.ceil(config.windowMs / 1000);
  
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString()
  };
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from headers (for production behind proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = request.headers.get('x-client-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  return realIp || clientIp || request.ip || '127.0.0.1';
}

function cleanExpiredEntries(now: number) {
  // Clean expired entries every 100 requests to prevent memory leaks
  if (Math.random() < 0.01) { // 1% chance
    rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }
}

export function getRateLimitConfig(pathname: string): RateLimitConfig {
  if (pathname.includes('/api/auth/')) {
    return rateLimitConfigs.auth;
  }
  
  if (pathname.includes('/api/payments/')) {
    return rateLimitConfigs.payment;
  }
  
  return rateLimitConfigs.api;
}