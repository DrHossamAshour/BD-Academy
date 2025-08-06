import { NextRequest, NextResponse } from 'next/server';
import { courseDB } from '@/lib/database';

// GET - Fetch all published courses for public viewing
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching public courses from MongoDB');
    
    // Get all courses and filter for published ones
    const allCourses = await courseDB.getAllCourses();
    const publishedCourses = allCourses.filter(course => course.status === 'published');
    
    console.log('Published courses found:', publishedCourses.length);
    
    return NextResponse.json({
      success: true,
      data: publishedCourses,
      total: publishedCourses.length
    });
  } catch (error) {
    console.error('Error fetching public courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 