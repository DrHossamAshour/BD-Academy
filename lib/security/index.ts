// Security utilities index - central export for all security functions
export * from './cors';
export * from './rate-limiter';
export * from './sanitizer';

// Convenience function to apply all security measures to API routes
import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders, getSecurityHeaders } from './cors';
import { isRateLimited, getRateLimitConfig } from './rate-limiter';

export function withSecurity(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    rateLimit?: boolean;
  } = {}
) {
  return async (request: NextRequest) => {
    // Apply rate limiting if enabled
    if (options.rateLimit !== false) {
      const rateLimitConfig = getRateLimitConfig(request.nextUrl.pathname);
      
      if (isRateLimited(request, rateLimitConfig)) {
        return new NextResponse(
          JSON.stringify({
            error: rateLimitConfig.message || 'Too many requests',
            code: 'RATE_LIMITED'
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              ...getCorsHeaders(request),
              ...getSecurityHeaders()
            }
          }
        );
      }
    }

    try {
      // Call the original handler
      const response = await handler(request);
      
      // Add security headers to response
      const corsHeaders = getCorsHeaders(request);
      const securityHeaders = getSecurityHeaders();
      
      Object.entries({ ...corsHeaders, ...securityHeaders }).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      console.error('API Error:', error);
      
      return new NextResponse(
        JSON.stringify({
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request),
            ...getSecurityHeaders()
          }
        }
      );
    }
  };
}

// Utility to validate and sanitize request body
export async function getSecureRequestBody<T>(
  request: NextRequest,
  sanitizer?: (data: any) => T
): Promise<T> {
  try {
    const body = await request.json();
    
    if (sanitizer) {
      return sanitizer(body);
    }
    
    return body;
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}