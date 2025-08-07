import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title'],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitizes plain text input by removing potentially dangerous characters
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>'"&]/g, '') // Remove common XSS characters
    .trim()
    .substring(0, 10000); // Limit length to prevent DoS
}

/**
 * Sanitizes email addresses
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, ''); // Only allow word characters, @, ., and -
}

/**
 * Sanitizes file names to prevent path traversal
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace invalid characters with underscore
    .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 255); // Limit length
}

/**
 * Enhanced Zod schemas with sanitization
 */

// String schema with sanitization
export const sanitizedStringSchema = (maxLength = 1000) =>
  z.string()
    .min(1, 'Field cannot be empty')
    .max(maxLength, `Field must be ${maxLength} characters or less`)
    .transform(sanitizeText)
    .refine(val => val.length > 0, { message: 'Field cannot be empty after sanitization' });

// Email schema with sanitization
export const sanitizedEmailSchema = z.string()
  .email('Invalid email format')
  .min(5, 'Email must be at least 5 characters')
  .max(320, 'Email must be 320 characters or less')
  .transform(sanitizeEmail);

// HTML content schema with sanitization
export const sanitizedHtmlSchema = (maxLength = 50000) =>
  z.string()
    .max(maxLength, `Content must be ${maxLength} characters or less`)
    .transform(sanitizeHtml);

// Password schema with strength validation
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be 128 characters or less')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');

// Name schema with sanitization
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be 100 characters or less')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .transform(val => val.trim());

// URL schema with validation
export const urlSchema = z.string()
  .url('Invalid URL format')
  .regex(/^https?:\/\//, 'URL must start with http:// or https://');

// Numeric ID schema
export const idSchema = z.string()
  .regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format')
  .length(24, 'ID must be exactly 24 characters');

/**
 * Sanitize an entire object recursively
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize the key itself
      const sanitizedKey = sanitizeText(key);
      if (sanitizedKey) {
        sanitized[sanitizedKey] = sanitizeObject(value);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Validate and sanitize request body
 */
export async function validateAndSanitizeBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string; issues?: any[] }> {
  try {
    const body = await request.json();
    const sanitizedBody = sanitizeObject(body);
    
    const result = schema.safeParse(sanitizedBody);
    
    if (!result.success) {
      return {
        success: false,
        error: 'Validation failed',
        issues: result.error.issues,
      };
    }
    
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON in request body',
    };
  }
}

/**
 * Escape SQL-like injection attempts (for NoSQL)
 */
export function escapeMongoDB(query: any): any {
  if (typeof query === 'string') {
    return query.replace(/[${}]/g, '');
  }
  
  if (Array.isArray(query)) {
    return query.map(escapeMongoDB);
  }
  
  if (query && typeof query === 'object') {
    const escaped: any = {};
    for (const [key, value] of Object.entries(query)) {
      // Don't allow keys starting with $ (MongoDB operators)
      if (key.startsWith('$')) {
        continue;
      }
      escaped[key] = escapeMongoDB(value);
    }
    return escaped;
  }
  
  return query;
}