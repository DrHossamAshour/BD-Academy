import { NextResponse } from 'next/server';

export interface SecurityHeadersOptions {
  contentSecurityPolicy?: string;
  xFrameOptions?: string;
  xContentTypeOptions?: boolean;
  referrerPolicy?: string;
  permissionsPolicy?: string;
  strictTransportSecurity?: string;
  xXSSProtection?: string;
  crossOriginEmbedderPolicy?: string;
  crossOriginOpenerPolicy?: string;
  crossOriginResourcePolicy?: string;
}

const defaultSecurityHeaders: Required<SecurityHeadersOptions> = {
  contentSecurityPolicy: [
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
  ].join('; '),
  xFrameOptions: 'DENY',
  xContentTypeOptions: true,
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=(self)',
  ].join(', '),
  strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
  xXSSProtection: '1; mode=block',
  crossOriginEmbedderPolicy: 'require-corp',
  crossOriginOpenerPolicy: 'same-origin',
  crossOriginResourcePolicy: 'same-origin',
};

/**
 * Apply security headers to a NextResponse
 */
export function applySecurityHeaders(
  response: NextResponse,
  options: SecurityHeadersOptions = {}
): NextResponse {
  const headers = { ...defaultSecurityHeaders, ...options };

  // Content Security Policy
  response.headers.set('Content-Security-Policy', headers.contentSecurityPolicy);

  // X-Frame-Options
  response.headers.set('X-Frame-Options', headers.xFrameOptions);

  // X-Content-Type-Options
  if (headers.xContentTypeOptions) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }

  // Referrer Policy
  response.headers.set('Referrer-Policy', headers.referrerPolicy);

  // Permissions Policy
  response.headers.set('Permissions-Policy', headers.permissionsPolicy);

  // Strict Transport Security (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', headers.strictTransportSecurity);
  }

  // X-XSS-Protection
  response.headers.set('X-XSS-Protection', headers.xXSSProtection);

  // Cross-Origin Embedder Policy
  response.headers.set('Cross-Origin-Embedder-Policy', headers.crossOriginEmbedderPolicy);

  // Cross-Origin Opener Policy
  response.headers.set('Cross-Origin-Opener-Policy', headers.crossOriginOpenerPolicy);

  // Cross-Origin Resource Policy
  response.headers.set('Cross-Origin-Resource-Policy', headers.crossOriginResourcePolicy);

  // Additional security headers
  response.headers.set('X-Powered-By', ''); // Remove X-Powered-By header
  response.headers.set('Server', ''); // Remove Server header
  
  return response;
}

/**
 * Create a security headers middleware for API routes
 */
export function withSecurityHeaders(
  handler: (request: Request) => Promise<NextResponse> | NextResponse,
  options: SecurityHeadersOptions = {}
) {
  return async (request: Request): Promise<NextResponse> => {
    const response = await handler(request);
    return applySecurityHeaders(response, options);
  };
}

/**
 * CORS configuration
 */
export interface CORSOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultCORSOptions: Required<CORSOptions> = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.NEXTAUTH_URL || 'https://yourdomain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Apply CORS headers to a response
 */
export function applyCORSHeaders(
  response: NextResponse,
  request: Request,
  options: CORSOptions = {}
): NextResponse {
  const corsOptions = { ...defaultCORSOptions, ...options };
  const origin = request.headers.get('origin');

  // Handle origin
  if (corsOptions.origin === true) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  } else if (corsOptions.origin === false) {
    // Don't set any origin header
  } else if (typeof corsOptions.origin === 'string') {
    response.headers.set('Access-Control-Allow-Origin', corsOptions.origin);
  } else if (Array.isArray(corsOptions.origin)) {
    if (origin && corsOptions.origin.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
  }

  // Set other CORS headers
  response.headers.set('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  
  if (corsOptions.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  response.headers.set('Access-Control-Max-Age', corsOptions.maxAge.toString());

  return response;
}

/**
 * Handle CORS preflight requests
 */
export function handleCORSPreflight(request: Request, options: CORSOptions = {}): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return applyCORSHeaders(response, request, options);
}

/**
 * Combined security and CORS middleware
 */
export function withSecurityAndCORS(
  handler: (request: Request) => Promise<NextResponse> | NextResponse,
  securityOptions: SecurityHeadersOptions = {},
  corsOptions: CORSOptions = {}
) {
  return async (request: Request): Promise<NextResponse> => {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORSPreflight(request, corsOptions);
    }

    const response = await handler(request);
    
    // Apply CORS headers
    applyCORSHeaders(response, request, corsOptions);
    
    // Apply security headers
    applySecurityHeaders(response, securityOptions);
    
    return response;
  };
}