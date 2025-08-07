import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { courseDB } from '@/lib/database';
import { 
  withAuthSecurity,
  generalApiRateLimiter,
  sanitizedStringSchema,
  sanitizedHtmlSchema,
  createSecureHandler
} from '@/lib/security';

// Input validation schema for course creation
const createCourseSchema = z.object({
  title: sanitizedStringSchema(200),
  description: sanitizedHtmlSchema(5000),
  price: z.number().min(0).max(10000),
  category: sanitizedStringSchema(100),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().min(1).max(500), // Duration in hours
  thumbnailUrl: z.string().url().optional(),
  tags: z.array(sanitizedStringSchema(50)).max(10).optional(),
});

// GET - Fetch all courses for an instructor
async function getCourses(request: NextRequest, context: any) {
  try {
    const { session } = context;
    
    if (session.user.role !== 'instructor' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('Fetching courses for instructor ID:', session.user.id);

    // Get courses for the instructor from MongoDB
    const instructorCourses = await courseDB.getInstructorCourses(session.user.id);
    
    console.log('Instructor courses found:', instructorCourses.length);

    return NextResponse.json({
      success: true,
      data: instructorCourses,
      total: instructorCourses.length,
      debug: {
        instructorId: session.user.id,
        instructorCoursesFound: instructorCourses.length
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST - Create a new course
async function createCourse(request: NextRequest, context: any) {
  try {
    const { session, validatedData } = context;
    
    if (session.user.role !== 'instructor' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create new course using MongoDB
    const newCourse = await courseDB.createCourse({
      ...validatedData,
      instructor: session.user.name,
      instructorId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft', // Default status
      enrollmentCount: 0,
    });

    console.log('Course created successfully in MongoDB:', newCourse._id);

    return NextResponse.json({
      success: true,
      data: {
        id: newCourse._id,
        title: newCourse.title,
        description: newCourse.description,
        price: newCourse.price,
        status: newCourse.status,
        createdAt: newCourse.createdAt,
      },
      message: 'Course created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

// Create secure handlers using the new security framework
export const { GET, POST } = createSecureHandler(
  {
    GET: getCourses,
    POST: createCourse,
  },
  {
    rateLimiter: generalApiRateLimiter,
    auth: {
      requiredRole: ['instructor', 'admin'],
    },
    validation: createCourseSchema, // Only applied to POST requests
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.NEXTAUTH_URL || 'https://yourdomain.com']
        : true,
      credentials: true,
    },
    securityHeaders: {},
    logRequests: process.env.NODE_ENV === 'development',
  }
);