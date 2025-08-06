import { NextRequest, NextResponse } from 'next/server';
import { courseDB } from '@/lib/database';

// GET - Fetch a single course by ID (public access)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await courseDB.getCourseById(params.id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Only return published courses for public access
    if (course.status !== 'published') {
      return NextResponse.json({ error: 'Course not available' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 