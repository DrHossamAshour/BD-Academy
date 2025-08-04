import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';
import Lesson from '@/lib/models/Lesson';
import User from '@/lib/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const course = await Course.findById(params.id)
      .populate('instructor', 'name avatar')
      .populate('lessons');

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Get lessons for this course
    const lessons = await Lesson.find({ courseId: params.id })
      .sort({ order: 1 });

    return NextResponse.json({
      course: {
        ...course.toObject(),
        lessons,
      },
    });

  } catch (error) {
    console.error('Course fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user owns the course or is admin
    const user = await User.findById(session.user.id);
    if (!user || (course.instructor.toString() !== session.user.id && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own courses' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    const updatedCourse = await Course.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    ).populate('instructor', 'name avatar');

    return NextResponse.json({ course: updatedCourse });

  } catch (error) {
    console.error('Course update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user owns the course or is admin
    const user = await User.findById(session.user.id);
    if (!user || (course.instructor.toString() !== session.user.id && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden - You can only delete your own courses' },
        { status: 403 }
      );
    }

    // Delete all lessons for this course
    await Lesson.deleteMany({ courseId: params.id });
    
    // Delete the course
    await Course.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Course deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}