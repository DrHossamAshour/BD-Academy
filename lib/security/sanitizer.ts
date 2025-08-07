// Input sanitization utilities
import DOMPurify from 'isomorphic-dompurify';

export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: { [key: string]: string[] };
  stripScripts?: boolean;
  stripHtml?: boolean;
}

// Default sanitization options
const defaultOptions: SanitizationOptions = {
  stripScripts: true,
  stripHtml: false,
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'
  ],
  allowedAttributes: {
    a: ['href', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height']
  }
};

// Strict sanitization for plain text (removes all HTML)
const strictOptions: SanitizationOptions = {
  stripHtml: true,
  stripScripts: true,
  allowedTags: [],
  allowedAttributes: {}
};

export function sanitizeString(input: string, options: SanitizationOptions = defaultOptions): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  let sanitized = input;

  // Remove null bytes and other dangerous characters
  sanitized = sanitized.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();

  try {
    if (options.stripHtml || (options.allowedTags && options.allowedTags.length === 0)) {
      // Strip all HTML tags
      const result = DOMPurify.sanitize(sanitized, { 
        ALLOWED_TAGS: [],
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_TRUSTED_TYPE: false
      });
      sanitized = String(result);
    } else {
      // Sanitize with allowed tags
      const purifyOptions: any = {
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_TRUSTED_TYPE: false
      };
      
      if (options.allowedTags) {
        purifyOptions.ALLOWED_TAGS = options.allowedTags;
      }
      
      if (options.allowedAttributes) {
        purifyOptions.ALLOWED_ATTR = Object.keys(options.allowedAttributes).reduce((acc, tag) => {
          return acc.concat(options.allowedAttributes![tag]);
        }, [] as string[]);
      }

      const result = DOMPurify.sanitize(sanitized, purifyOptions);
      sanitized = String(result);
    }
  } catch (error) {
    // Fallback: if DOMPurify fails, at least strip dangerous characters
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  }

  return sanitized;
}

export function sanitizeObject<T extends Record<string, any>>(
  obj: T, 
  fieldOptions: { [K in keyof T]?: SanitizationOptions } = {}
): T {
  const sanitized = { ...obj };
  
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      const options = fieldOptions[key as keyof T] || defaultOptions;
      sanitized[key as keyof T] = sanitizeString(value, options) as T[keyof T];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      sanitized[key as keyof T] = sanitizeObject(value, {}) as T[keyof T];
    } else if (Array.isArray(value)) {
      // Sanitize array elements
      sanitized[key as keyof T] = value.map(item => 
        typeof item === 'string' 
          ? sanitizeString(item, fieldOptions[key as keyof T] || defaultOptions)
          : item
      ) as T[keyof T];
    }
  }
  
  return sanitized;
}

// Predefined sanitization functions for common use cases
export function sanitizeEmail(email: string): string {
  return sanitizeString(email, strictOptions).toLowerCase();
}

export function sanitizeName(name: string): string {
  return sanitizeString(name, strictOptions);
}

export function sanitizeDescription(description: string): string {
  return sanitizeString(description, {
    allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    allowedAttributes: {},
    stripScripts: true
  });
}

export function sanitizeUrl(url: string): string {
  const sanitized = sanitizeString(url, strictOptions);
  
  // Basic URL validation
  try {
    const urlObj = new URL(sanitized);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid protocol');
    }
    return urlObj.toString();
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

// Validation helpers that work with Zod
export function createSanitizedStringSchema(options?: SanitizationOptions) {
  return {
    preprocess: (value: unknown) => {
      if (typeof value === 'string') {
        return sanitizeString(value, options);
      }
      return value;
    }
  };
}

// SQL injection prevention helpers
export function escapeSqlString(input: string): string {
  return input.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

// NoSQL injection prevention
export function sanitizeMongoQuery(query: any): any {
  if (typeof query !== 'object' || query === null) {
    return query;
  }

  const sanitized = { ...query };
  
  for (const [key, value] of Object.entries(sanitized)) {
    // Remove keys that start with $ (MongoDB operators) unless explicitly allowed
    if (key.startsWith('$') && !isAllowedMongoOperator(key)) {
      delete sanitized[key];
      continue;
    }
    
    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMongoQuery(value);
    }
  }
  
  return sanitized;
}

// Allowed MongoDB operators for queries
const allowedMongoOperators = [
  '$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin',
  '$and', '$or', '$not', '$nor', '$exists', '$type', '$regex'
];

function isAllowedMongoOperator(operator: string): boolean {
  return allowedMongoOperators.includes(operator);
}