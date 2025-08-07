import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { courseDB } from '@/lib/database';
import { z } from 'zod';

// Validation schema for course creation
const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must not exceed 100 characters'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must not exceed 1000 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  language: z.string().min(1, 'Language is required'),
  price: z.number().min(0, 'Price must be non-negative').max(99999, 'Price must not exceed 99999'),
  originalPrice: z.number().min(0).optional(),
  duration: z.string().min(1, 'Duration is required'),
  lessons: z.number().int().min(1, 'Must have at least 1 lesson'),
  image: z.string().url('Image must be a valid URL').optional(),
  video: z.string().url('Video must be a valid URL').optional(),
  requirements: z.array(z.string()).default([]),
  whatYouLearn: z.array(z.string()).default([]),
  sections: z.array(z.any()).default([]), // More detailed validation can be added for sections
  isPublished: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  enableCertificate: z.boolean().default(true),
  enableDiscussion: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  maxStudents: z.number().int().positive().optional(),
  accessDuration: z.enum(['lifetime', '1-year', '6-months']).default('lifetime')
});

type CreateCourseInput = z.infer<typeof createCourseSchema>;

// GET - Fetch all courses for an instructor
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'instructor') {
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new course
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Validate input data
    const result = createCourseSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const courseData: CreateCourseInput = result.data;

    // Create new course using MongoDB
    const newCourse = await courseDB.createCourse({
      ...courseData,
      instructor: session.user.name || 'Unknown Instructor',
      instructorId: session.user.id
    });

    console.log('Course created successfully in MongoDB:', newCourse._id);

    return NextResponse.json({
      success: true,
      data: newCourse,
      message: 'Course created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}