import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { 
  withSecurity,
  authRateLimiter,
  sanitizedStringSchema,
  sanitizedEmailSchema,
  passwordSchema,
  trackFailedLogin,
  isLoginBlocked,
  getClientIP
} from '@/lib/security';

const registerSchema = z.object({
  name: sanitizedStringSchema(100),
  email: sanitizedEmailSchema,
  password: passwordSchema,
});

async function registerHandler(request: NextRequest, context: any) {
  try {
    const { validatedData } = context;
    const { name, email, password } = validatedData;

    // Check if IP is blocked due to failed attempts
    const clientIp = getClientIP(request);
    if (isLoginBlocked(clientIp)) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please try again later.' },
        { status: 429 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Track failed attempt (email already exists)
      trackFailedLogin(clientIp);
      return NextResponse.json(
        { error: 'Registration failed' }, // Don't reveal that email exists
        { status: 409 }
      );
    }

    // Hash password with higher security
    const saltRounds = 14; // Increased from 12 for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with additional security fields
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      lastLogin: null,
      loginAttempts: 0,
      accountLocked: false,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Log successful registration
    console.log(`User registered successfully: ${email} from IP: ${clientIp}`);

    return NextResponse.json(
      { 
        message: 'User created successfully. Please verify your email.',
        user: {
          id: userWithoutPassword._id,
          name: userWithoutPassword.name,
          email: userWithoutPassword.email,
          emailVerified: userWithoutPassword.emailVerified,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    // Track failed attempt on server error
    const clientIp = getClientIP(request);
    trackFailedLogin(clientIp);
    
    return NextResponse.json(
      { error: 'Registration failed' }, // Don't leak internal error details
      { status: 500 }
    );
  }
}

// Apply comprehensive security to the registration endpoint
export const POST = withSecurity(registerHandler, {
  rateLimiter: authRateLimiter,
  validation: registerSchema,
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXTAUTH_URL || 'https://yourdomain.com']
      : true,
    credentials: true,
  },
  securityHeaders: {},
  logRequests: process.env.NODE_ENV === 'development',
});