import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { courseDB } from '@/lib/database';
import { sanitizeObject, sanitizeName, sanitizeDescription, withSecurity } from '@/lib/security';

// GET - Fetch all courses for an instructor
async function getCoursesHandler(request: NextRequest) {
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
async function createCourseHandler(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const courseData = await request.json();

    // Sanitize course data
    const sanitizedCourseData = sanitizeObject(courseData, {
      title: { stripHtml: true, stripScripts: true },
      description: { 
        allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
        stripScripts: true
      },
      instructor: { stripHtml: true, stripScripts: true }
    });

    // Validate required fields
    if (!sanitizedCourseData.title || !sanitizedCourseData.description || !sanitizedCourseData.price) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, price' },
        { status: 400 }
      );
    }

    // Additional validation
    if (typeof sanitizedCourseData.price !== 'number' || sanitizedCourseData.price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Create new course using MongoDB
    const newCourse = await courseDB.createCourse({
      ...sanitizedCourseData,
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

// Apply security middleware
export const GET = withSecurity(getCoursesHandler, { rateLimit: true });
export const POST = withSecurity(createCourseHandler, { rateLimit: true });