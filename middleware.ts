import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply security headers to all responses
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');

  // Add CSP header
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);

  // HTTPS redirect in production
  if (process.env.NODE_ENV === 'production' && !request.nextUrl.protocol.includes('https')) {
    return NextResponse.redirect(`https://${request.nextUrl.host}${request.nextUrl.pathname}${request.nextUrl.search}`);
  }

  // Basic rate limiting for auth endpoints (more sophisticated limiting should be done in API routes)
  if (pathname.startsWith('/api/auth/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // This is a basic implementation - in production use Redis or a proper rate limiting service
    // For now, we'll rely on the rate limiting implemented in individual API routes
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')) {
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Protect instructor routes
  if (pathname.startsWith('/dashboard/instructor')) {
    const token = await getToken({ req: request });
    
    if (!token || (token.role !== 'instructor' && token.role !== 'admin')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Protect general dashboard routes
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/public')) {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};