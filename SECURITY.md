# BigDentist Security Implementation Guide

This document describes the comprehensive security measures implemented in the BigDentist Academy platform.

## 🔒 Security Features Overview

### 1. CORS (Cross-Origin Resource Sharing)
- **Location**: `lib/security/cors.ts`
- **Environment-aware configuration**: Different policies for development and production
- **Features**:
  - Origin validation
  - Credential handling
  - Security headers (X-XSS-Protection, X-Content-Type-Options, etc.)
  - Content Security Policy (CSP)

### 2. Rate Limiting
- **Location**: `lib/security/rate-limiter.ts`
- **In-memory implementation** (can be extended to use Redis for production scale)
- **Different limits by endpoint type**:
  - Authentication: 5 requests per 15 minutes
  - Payments: 10 requests per 1 hour
  - General API: 100 requests per 15 minutes
- **Features**:
  - Client IP detection with proxy support
  - Automatic cleanup of expired entries
  - Rate limit headers in responses

### 3. Input Sanitization
- **Location**: `lib/security/sanitizer.ts`
- **XSS Prevention**: Uses DOMPurify to sanitize HTML content
- **MongoDB Injection Protection**: Sanitizes query objects
- **Pre-built sanitizers**:
  - `sanitizeEmail()`: Email normalization and sanitization
  - `sanitizeName()`: Name field sanitization
  - `sanitizeDescription()`: HTML content with allowed tags
  - `sanitizeUrl()`: URL validation and sanitization

### 4. Security Middleware
- **Location**: `middleware.ts`
- **Global protection**: Applies to all routes except static files
- **Features**:
  - CORS handling
  - Rate limiting
  - Security headers injection
  - Origin validation

### 5. Enhanced API Security
- **Updated routes** with security wrapper (`withSecurity`)
- **Stronger password hashing**: Increased from 12 to 14 salt rounds
- **Input validation**: Combined Zod validation with sanitization

## 🚀 Usage Examples

### Using Input Sanitization in API Routes

```typescript
import { sanitizeObject, sanitizeEmail, withSecurity } from '@/lib/security';

async function createUserHandler(request: NextRequest) {
  const body = await request.json();
  
  // Sanitize all input fields
  const sanitizedData = sanitizeObject(body, {
    name: { stripHtml: true, stripScripts: true },
    email: { stripHtml: true, stripScripts: true },
    description: { 
      allowedTags: ['p', 'br', 'strong', 'em'],
      stripScripts: true 
    }
  });
  
  // Or use specific sanitizers
  const email = sanitizeEmail(body.email);
  
  // ... rest of handler
}

// Apply security middleware
export const POST = withSecurity(createUserHandler, { rateLimit: true });
```

### Custom Rate Limiting

```typescript
import { isRateLimited, getRateLimitConfig } from '@/lib/security/rate-limiter';

export async function POST(request: NextRequest) {
  // Custom rate limit check
  const config = getRateLimitConfig(request.nextUrl.pathname);
  if (isRateLimited(request, config)) {
    return new NextResponse('Rate limited', { status: 429 });
  }
  
  // ... rest of handler
}
```

### CORS Configuration

The CORS configuration automatically adapts based on the environment:

**Development**:
- Allows `localhost:3000` and `127.0.0.1:3000`
- Permissive for development workflow

**Production**:
- Restricts to specific domains
- Enhanced security headers
- HTTPS enforcement

## 🔧 Configuration

### Environment Variables

Add these to your `.env` file for enhanced security:

```env
# Security Configuration
NEXTAUTH_SECRET=your-very-secure-secret-here
NODE_ENV=production  # for production security headers

# CORS Origins (production)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Rate Limit Customization

Modify `lib/security/rate-limiter.ts` to adjust limits:

```typescript
export const rateLimitConfigs = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,          // requests per window
  },
  // ... other configs
};
```

### CSP (Content Security Policy) Customization

Update `lib/security/cors.ts` to modify CSP:

```typescript
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://trusted-domain.com",
  // ... add your trusted domains
].join('; ')
```

## 🛡️ Security Best Practices

### 1. Input Validation
- Always sanitize user input before processing
- Use both client-side and server-side validation
- Apply appropriate sanitization based on field type

### 2. Authentication
- Use strong password requirements
- Implement proper session management
- Regular security audits

### 3. Rate Limiting
- Monitor rate limit metrics
- Adjust limits based on usage patterns
- Consider using Redis for distributed systems

### 4. CORS
- Keep production origins list minimal
- Regularly review and update allowed origins
- Use HTTPS in production

### 5. Security Headers
- Regularly test with security scanners
- Keep CSP policies updated
- Monitor for policy violations

## 🔍 Testing Security

### Manual Testing

1. **XSS Testing**: Try submitting `<script>alert('xss')</script>` in forms
2. **Rate Limiting**: Make rapid requests to test limits
3. **CORS**: Test cross-origin requests from unauthorized domains
4. **CSP**: Check browser console for policy violations

### Security Tools

- **OWASP ZAP**: For comprehensive security testing
- **Nmap**: For port scanning and service detection
- **SSL Labs**: For HTTPS configuration testing

## 📊 Monitoring

### Rate Limiting Metrics
- Monitor rate limit hit rates
- Track blocked requests by IP
- Adjust limits based on legitimate usage patterns

### Security Logs
- Log security events (rate limiting, CORS violations)
- Monitor for suspicious patterns
- Set up alerts for security incidents

## 🚨 Incident Response

1. **Immediate Response**: Block malicious IPs via rate limiting
2. **Investigation**: Review logs and identify attack vectors
3. **Mitigation**: Adjust security policies as needed
4. **Recovery**: Ensure system integrity and data safety

## 📈 Performance Considerations

- Rate limiting uses in-memory storage (consider Redis for scale)
- Input sanitization adds processing overhead
- Security headers increase response size minimally
- Monitor performance impact and optimize as needed

## 🔄 Maintenance

- Regularly update security dependencies
- Review and update CSP policies
- Monitor for new security vulnerabilities
- Conduct periodic security audits

---

For questions or security concerns, please contact the development team or create an issue in the repository.