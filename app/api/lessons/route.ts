import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import Lesson from '@/lib/models/Lesson';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';

const createLessonSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  vimeoUrl: z.string().url('Invalid Vimeo URL').refine(
    (url) => url.includes('vimeo.com'), 
    'Must be a valid Vimeo URL'
  ),
  duration: z.number().min(0).optional(),
  isPublished: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const lessons = await Lesson.find({ 
      courseId,
      isPublished: true 
    }).sort({ order: 1 });

    return NextResponse.json({ lessons });

  } catch (error) {
    console.error('Lessons fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    
    // Validate input
    const result = createLessonSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { courseId, vimeoUrl, ...lessonData } = result.data;

    // Check if course exists and user has permission
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user || (course.instructor.toString() !== session.user.id && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden - You can only add lessons to your own courses' },
        { status: 403 }
      );
    }

    // Extract Vimeo video ID from URL
    const vimeoVideoId = extractVimeoId(vimeoUrl);
    if (!vimeoVideoId) {
      return NextResponse.json(
        { error: 'Invalid Vimeo URL' },
        { status: 400 }
      );
    }

    // Get the next order number
    const lastLesson = await Lesson.findOne({ courseId })
      .sort({ order: -1 })
      .limit(1);
    
    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = await Lesson.create({
      ...lessonData,
      courseId,
      vimeoUrl,
      vimeoVideoId,
      order: nextOrder,
    });

    // Update course lessons array
    await Course.findByIdAndUpdate(courseId, {
      $push: { lessons: lesson._id }
    });

    return NextResponse.json(
      { lesson },
      { status: 201 }
    );

  } catch (error) {
    console.error('Lesson creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractVimeoId(url: string): string | null {
  const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(vimeoRegex);
  return match ? match[1] : null;
}