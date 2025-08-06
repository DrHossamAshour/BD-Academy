import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { courseDB } from '@/lib/database';

// GET - Fetch a single course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'instructor' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const course = await courseDB.getCourseById(params.id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if the instructor owns this course (unless admin)
    if (session.user.role === 'instructor' && course.instructorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

// PUT - Update a course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'instructor' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const course = await courseDB.getCourseById(params.id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if the instructor owns this course (unless admin)
    if (session.user.role === 'instructor' && course.instructorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData = await request.json();

    // Validate required fields
    if (!updateData.title || !updateData.description || !updateData.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the course using MongoDB
    const updatedCourse = await courseDB.updateCourse(params.id, updateData);

    if (!updatedCourse) {
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
    }

    console.log('Course updated successfully in MongoDB:', params.id);

    return NextResponse.json({
      success: true,
      data: updatedCourse,
      message: 'Course updated successfully'
    });

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'instructor' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const course = await courseDB.getCourseById(params.id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if the instructor owns this course (unless admin)
    if (session.user.role === 'instructor' && course.instructorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the course using MongoDB
    const success = await courseDB.deleteCourse(params.id);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }

    console.log('Course deleted successfully from MongoDB:', params.id);

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}