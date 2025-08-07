import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders, getSecurityHeaders, getHttpsHeaders, isValidOrigin } from './lib/security/cors';
import { isRateLimited, getRateLimitConfig, getRateLimitHeaders } from './lib/security/rate-limiter';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/api/courses',
  '/api/lessons',
  '/api/orders',
  '/api/payments/intent',
  '/checkout'
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/api/auth',
  '/api/courses/public',
  '/api/payments/webhook', // Webhook should be publicly accessible
  '/books',
  '/diplomas'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handlePreflightRequest(request);
  }
  
  // Apply rate limiting
  const rateLimitResult = checkRateLimit(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }
  
  // Check if route requires authentication
  const requiresAuth = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Create response with security headers
  const response = NextResponse.next();
  
  // Apply CORS headers
  const corsHeaders = getCorsHeaders(request);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Apply security headers
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Apply HTTPS headers for production
  const httpsHeaders = getHttpsHeaders();
  Object.entries(httpsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add rate limit headers
  const rateLimitConfig = getRateLimitConfig(pathname);
  const rateLimitHeaders = getRateLimitHeaders(request, rateLimitConfig);
  Object.entries(rateLimitHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Validate origin for sensitive operations
  if (pathname.startsWith('/api/') && !isValidOrigin(request.headers.get('origin'))) {
    // Allow same-origin requests (no origin header) and valid origins
    const origin = request.headers.get('origin');
    if (origin && !isValidOrigin(origin)) {
      return new NextResponse('Invalid origin', { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...securityHeaders
        }
      });
    }
  }
  
  return response;
}

function handlePreflightRequest(request: NextRequest): NextResponse {
  const corsHeaders = getCorsHeaders(request);
  const securityHeaders = getSecurityHeaders();
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders,
      ...securityHeaders
    }
  });
}

function checkRateLimit(request: NextRequest): NextResponse | null {
  const rateLimitConfig = getRateLimitConfig(request.nextUrl.pathname);
  
  if (isRateLimited(request, rateLimitConfig)) {
    const corsHeaders = getCorsHeaders(request);
    const securityHeaders = getSecurityHeaders();
    const rateLimitHeaders = getRateLimitHeaders(request, rateLimitConfig);
    
    return new NextResponse(
      JSON.stringify({
        error: rateLimitConfig.message || 'Too many requests',
        code: 'RATE_LIMITED'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...securityHeaders,
          ...rateLimitHeaders
        }
      }
    );
  }
  
  return null;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};