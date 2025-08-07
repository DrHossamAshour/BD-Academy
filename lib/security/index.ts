import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from './rateLimiter';
import { applySecurityHeaders, applyCORSHeaders, CORSOptions, SecurityHeadersOptions } from './headers';
import { validateAndSanitizeBody } from './sanitization';
import { withAuth, AuthMiddlewareOptions } from './auth';
import { z } from 'zod';

export interface SecurityMiddlewareOptions {
  rateLimiter?: RateLimiter;
  cors?: CORSOptions;
  securityHeaders?: SecurityHeadersOptions;
  auth?: AuthMiddlewareOptions;
  validation?: z.ZodSchema<any>;
  requireCSRF?: boolean;
  logRequests?: boolean;
}

/**
 * Comprehensive security middleware that combines all security features
 */
export function withSecurity(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  options: SecurityMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    
    try {
      // Log request if enabled
      if (options.logRequests) {
        console.log(`[${new Date().toISOString()}] ${request.method} ${request.url} - ${request.headers.get('user-agent')}`);
      }

      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });
        if (options.cors) {
          applyCORSHeaders(response, request, options.cors);
        }
        return response;
      }

      // Rate limiting
      if (options.rateLimiter) {
        const rateLimitResponse = await options.rateLimiter.middleware(request);
        if (rateLimitResponse) {
          return rateLimitResponse;
        }
      }

      // Input validation
      let validatedData: any = undefined;
      if (options.validation && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
        const validationResult = await validateAndSanitizeBody(request, options.validation);
        if (!validationResult.success) {
          return NextResponse.json(
            { 
              error: validationResult.error,
              issues: validationResult.issues 
            },
            { status: 400 }
          );
        }
        validatedData = validationResult.data;
      }

      // Authentication (if required)
      let session;
      if (options.auth) {
        const authMiddleware = withAuth(
          (req, sess) => {
            session = sess;
            return handler(req, { session, validatedData });
          },
          options.auth
        );
        
        const response = await authMiddleware(request);
        
        // Apply security headers and CORS
        if (options.securityHeaders) {
          applySecurityHeaders(response, options.securityHeaders);
        }
        if (options.cors) {
          applyCORSHeaders(response, request, options.cors);
        }
        
        return response;
      }

      // Execute main handler
      const response = await handler(request, { validatedData });

      // Apply security headers
      if (options.securityHeaders) {
        applySecurityHeaders(response, options.securityHeaders);
      }

      // Apply CORS headers
      if (options.cors) {
        applyCORSHeaders(response, request, options.cors);
      }

      // Log response time if logging is enabled
      if (options.logRequests) {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] ${request.method} ${request.url} - ${response.status} (${duration}ms)`);
      }

      return response;

    } catch (error) {
      console.error('Security middleware error:', error);
      
      // Create error response with security headers
      const errorResponse = NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );

      if (options.securityHeaders) {
        applySecurityHeaders(errorResponse, options.securityHeaders);
      }

      if (options.cors) {
        applyCORSHeaders(errorResponse, request, options.cors);
      }

      return errorResponse;
    }
  };
}

/**
 * Security presets for common use cases
 */

// Standard API security
export function withStandardSecurity(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  rateLimiter?: RateLimiter
) {
  return withSecurity(handler, {
    rateLimiter: rateLimiter,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.NEXTAUTH_URL || 'https://yourdomain.com']
        : true,
      credentials: true,
    },
    securityHeaders: {},
    logRequests: process.env.NODE_ENV === 'development',
  });
}

// Auth-required API security
export function withAuthSecurity(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  authOptions: AuthMiddlewareOptions = {},
  rateLimiter?: RateLimiter
) {
  return withSecurity(handler, {
    rateLimiter: rateLimiter,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.NEXTAUTH_URL || 'https://yourdomain.com']
        : true,
      credentials: true,
    },
    securityHeaders: {},
    auth: authOptions,
    logRequests: process.env.NODE_ENV === 'development',
  });
}

// Admin-only API security
export function withAdminSecurity(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  rateLimiter?: RateLimiter
) {
  return withAuthSecurity(handler, {
    requiredRole: 'admin',
    requireEmailVerification: true,
  }, rateLimiter);
}

// Public API with rate limiting
export function withPublicSecurity(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  rateLimiter?: RateLimiter
) {
  return withStandardSecurity(handler, rateLimiter);
}

/**
 * Utility function to create secure API route handlers
 */
export function createSecureHandler(handlers: {
  GET?: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse;
  POST?: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse;
  PUT?: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse;
  DELETE?: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse;
  PATCH?: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse;
}, securityOptions: SecurityMiddlewareOptions = {}) {
  const secureHandlers: any = {};

  Object.entries(handlers).forEach(([method, handler]) => {
    secureHandlers[method] = withSecurity(handler, securityOptions);
  });

  return secureHandlers;
}

export * from './rateLimiter';
export * from './sanitization';
export * from './headers';
export * from './auth';