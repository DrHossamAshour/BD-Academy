import { NextRequest, NextResponse } from 'next/server';
import { courseDB } from '@/lib/database';

// GET - Fetch all published courses for public viewing
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching public courses from MongoDB');
    
    // Get all courses and filter for published ones
    const allCourses = await courseDB.getAllCourses();
    const publishedCourses = allCourses.filter((course: any) => course.status === 'published');
    
    console.log('Published courses found:', publishedCourses.length);
    
    const response = NextResponse.json({
      success: true,
      data: publishedCourses,
      total: publishedCourses.length
    });

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=600');
    
    return response;
  } catch (error) {
    console.error('Error fetching public courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 