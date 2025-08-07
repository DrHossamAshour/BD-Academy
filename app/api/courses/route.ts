import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/route';
import { courseDB } from '@/lib/database';

const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().optional().default('USD'),
  category: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  duration: z.number().min(0).optional(),
  image: z.string().url().optional(),
  isPublished: z.boolean().default(false),
});

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

    const courseData = await request.json();

    // Validate input
    const result = createCourseSchema.safeParse(courseData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    // Validate required fields (additional check)
    if (!result.data.title || !result.data.description || result.data.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new course using MongoDB
    const newCourse = await courseDB.createCourse({
      ...result.data,
      instructor: session.user.name,
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