import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { courseDB } from '@/lib/database';

// Temporary debug endpoint to see all courses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'instructor' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const allCourses = await courseDB.getAllCourses();
    const dbState = await courseDB.getDatabaseState();
    
    return NextResponse.json({
      success: true,
      data: allCourses,
      total: allCourses.length,
      debug: {
        currentUserId: session.user.id,
        currentUserRole: session.user.role,
        databaseState: dbState,
        allCourses: allCourses.map(c => ({
          id: c._id?.toString(),
          title: c.title,
          instructorId: c.instructorId,
          instructor: c.instructor,
          status: c.status
        }))
      }
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 