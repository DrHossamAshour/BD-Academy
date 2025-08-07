import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import crypto from 'crypto';

// Session tracking for additional security
interface SessionTracker {
  [sessionId: string]: {
    lastActivity: number;
    ipAddress: string;
    userAgent: string;
    isValid: boolean;
  };
}

// In-memory session tracking (use Redis in production)
const sessionStore: SessionTracker = {};

// Failed login attempts tracking
interface LoginAttempts {
  [identifier: string]: {
    count: number;
    lastAttempt: number;
    blockedUntil?: number;
  };
}

const loginAttempts: LoginAttempts = {};

export interface AuthMiddlewareOptions {
  requiredRole?: string | string[];
  requireEmailVerification?: boolean;
  allowGuests?: boolean;
  maxSessionDuration?: number; // in milliseconds
  maxInactiveTime?: number; // in milliseconds
}

const defaultAuthOptions: Required<AuthMiddlewareOptions> = {
  requiredRole: [],
  requireEmailVerification: false,
  allowGuests: false,
  maxSessionDuration: 24 * 60 * 60 * 1000, // 24 hours
  maxInactiveTime: 2 * 60 * 60 * 1000, // 2 hours
};

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate session security
 */
export function validateSessionSecurity(
  request: NextRequest,
  sessionId: string
): { isValid: boolean; reason?: string } {
  const session = sessionStore[sessionId];
  
  if (!session) {
    return { isValid: false, reason: 'Session not found' };
  }

  if (!session.isValid) {
    return { isValid: false, reason: 'Session invalidated' };
  }

  const now = Date.now();
  const clientIp = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';

  // Check session timeout
  if (now - session.lastActivity > defaultAuthOptions.maxInactiveTime) {
    invalidateSession(sessionId);
    return { isValid: false, reason: 'Session expired due to inactivity' };
  }

  // Check IP address consistency (optional, might be too strict for mobile users)
  // if (session.ipAddress !== clientIp) {
  //   return { isValid: false, reason: 'IP address mismatch' };
  // }

  // Check user agent consistency
  if (session.userAgent !== userAgent) {
    invalidateSession(sessionId);
    return { isValid: false, reason: 'User agent mismatch - potential session hijacking' };
  }

  // Update last activity
  session.lastActivity = now;

  return { isValid: true };
}

/**
 * Track session for security monitoring
 */
export function trackSession(sessionId: string, request: NextRequest): void {
  const clientIp = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';

  sessionStore[sessionId] = {
    lastActivity: Date.now(),
    ipAddress: clientIp,
    userAgent,
    isValid: true,
  };
}

/**
 * Invalidate a session
 */
export function invalidateSession(sessionId: string): void {
  if (sessionStore[sessionId]) {
    sessionStore[sessionId].isValid = false;
  }
}

/**
 * Get client IP address
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
}

/**
 * Track failed login attempts
 */
export function trackFailedLogin(identifier: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts[identifier];

  if (!attempts) {
    loginAttempts[identifier] = {
      count: 1,
      lastAttempt: now,
    };
    return false; // Not blocked
  }

  // Check if still blocked
  if (attempts.blockedUntil && now < attempts.blockedUntil) {
    return true; // Still blocked
  }

  // Reset if more than 15 minutes since last attempt
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 1;
    attempts.lastAttempt = now;
    delete attempts.blockedUntil;
    return false;
  }

  // Increment attempts
  attempts.count++;
  attempts.lastAttempt = now;

  // Block after 5 failed attempts
  if (attempts.count >= 5) {
    attempts.blockedUntil = now + (30 * 60 * 1000); // Block for 30 minutes
    return true;
  }

  return false;
}

/**
 * Check if identifier is blocked
 */
export function isLoginBlocked(identifier: string): boolean {
  const attempts = loginAttempts[identifier];
  if (!attempts || !attempts.blockedUntil) {
    return false;
  }

  return Date.now() < attempts.blockedUntil;
}

/**
 * Clear failed login attempts (on successful login)
 */
export function clearFailedLogins(identifier: string): void {
  delete loginAttempts[identifier];
}

/**
 * Enhanced authentication middleware
 */
export function withAuth(
  handler: (request: NextRequest, session: any) => Promise<NextResponse> | NextResponse,
  options: AuthMiddlewareOptions = {}
) {
  const authOptions = { ...defaultAuthOptions, ...options };

  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Get session
      const session = await getServerSession(authOptions as any) as any;

      // Handle guests
      if (!session && authOptions.allowGuests) {
        return handler(request, null);
      }

      // Check if authenticated
      if (!session) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Validate session security if session ID is available
      if (session?.user?.id) {
        const sessionValidation = validateSessionSecurity(request, session.user.id);
        if (!sessionValidation.isValid) {
          return NextResponse.json(
            { error: 'Session invalid', reason: sessionValidation.reason },
            { status: 401 }
          );
        }
      }

      // Check email verification if required
      if (authOptions.requireEmailVerification && session?.user && !session.user.emailVerified) {
        return NextResponse.json(
          { error: 'Email verification required' },
          { status: 403 }
        );
      }

      // Check role authorization
      if (authOptions.requiredRole && authOptions.requiredRole.length > 0 && session?.user) {
        const userRole = session.user.role;
        const requiredRoles = Array.isArray(authOptions.requiredRole) 
          ? authOptions.requiredRole 
          : [authOptions.requiredRole];

        if (!userRole || !requiredRoles.includes(userRole)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          );
        }
      }

      // Track session activity
      if (session?.user?.id) {
        trackSession(session.user.id, request);
      }

      return handler(request, session);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware specifically for admin routes
 */
export function withAdminAuth(
  handler: (request: NextRequest, session: any) => Promise<NextResponse> | NextResponse
) {
  return withAuth(handler, {
    requiredRole: 'admin',
    requireEmailVerification: true,
  });
}

/**
 * Middleware for instructor routes
 */
export function withInstructorAuth(
  handler: (request: NextRequest, session: any) => Promise<NextResponse> | NextResponse
) {
  return withAuth(handler, {
    requiredRole: ['admin', 'instructor'],
  });
}

/**
 * CSRF Token generation and validation
 */
const csrfTokens = new Set<string>();

export function generateCSRFToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.add(token);
  // Clean up old tokens periodically
  if (csrfTokens.size > 1000) {
    const tokensArray = Array.from(csrfTokens);
    tokensArray.slice(0, 500).forEach(token => csrfTokens.delete(token));
  }
  return token;
}

export function validateCSRFToken(token: string): boolean {
  return csrfTokens.has(token);
}

export function removeCSRFToken(token: string): void {
  csrfTokens.delete(token);
}

/**
 * CSRF protection middleware
 */
export function withCSRFProtection(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Skip CSRF for GET requests
    if (request.method === 'GET') {
      return handler(request);
    }

    const csrfToken = request.headers.get('x-csrf-token');
    
    if (!csrfToken || !validateCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    // Remove token after use (one-time use)
    removeCSRFToken(csrfToken);

    return handler(request);
  };
}