// CORS configuration for BigDentist Academy
import { NextRequest } from 'next/server';

export interface CorsOptions {
  origin: string[] | string | boolean;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  optionsSuccessStatus: number;
  maxAge?: number;
}

// Development CORS configuration
const developmentCors: CorsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
};

// Production CORS configuration
const productionCors: CorsOptions = {
  origin: [
    'https://bd-academy.vercel.app',
    'https://bigdentist.com',
    'https://www.bigdentist.com'
    // Add your production domains here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
};

export function getCorsConfig(): CorsOptions {
  return process.env.NODE_ENV === 'production' ? productionCors : developmentCors;
}

export function getCorsHeaders(request: NextRequest): Record<string, string> {
  const corsConfig = getCorsConfig();
  const origin = request.headers.get('origin');
  const headers: Record<string, string> = {};

  // Handle origin
  if (corsConfig.origin === true) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (typeof corsConfig.origin === 'string') {
    headers['Access-Control-Allow-Origin'] = corsConfig.origin;
  } else if (Array.isArray(corsConfig.origin) && origin) {
    if (corsConfig.origin.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
    }
  }

  // Handle credentials
  if (corsConfig.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  // Handle methods
  headers['Access-Control-Allow-Methods'] = corsConfig.methods.join(', ');

  // Handle headers
  headers['Access-Control-Allow-Headers'] = corsConfig.allowedHeaders.join(', ');

  // Handle max age for preflight requests
  if (corsConfig.maxAge) {
    headers['Access-Control-Max-Age'] = corsConfig.maxAge.toString();
  }

  return headers;
}

export function isValidOrigin(origin: string | null): boolean {
  if (!origin) return false;
  
  const corsConfig = getCorsConfig();
  
  if (corsConfig.origin === true) {
    return true;
  }
  
  if (typeof corsConfig.origin === 'string') {
    return origin === corsConfig.origin;
  }
  
  if (Array.isArray(corsConfig.origin)) {
    return corsConfig.origin.includes(origin);
  }
  
  return false;
}

// Additional security headers
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Content Security Policy (basic, can be customized)
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://api.vimeo.com https://www.google-analytics.com",
      "frame-src https://js.stripe.com https://player.vimeo.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()'
    ].join(', ')
  };
}

// HTTPS enforcement headers (for production)
export function getHttpsHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (process.env.NODE_ENV === 'production') {
    // HTTP Strict Transport Security
    headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload';
  }
  
  return headers;
}