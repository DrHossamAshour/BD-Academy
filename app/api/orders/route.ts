import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = { userId: session.user.id };
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('courseId', 'title image instructor')
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Orders fetch error:', error);
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
    const { courseId, customerInfo } = body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user already enrolled in this course
    const existingOrder = await Order.findOne({
      userId: session.user.id,
      courseId,
      status: 'completed'
    });

    if (existingOrder) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 409 }
      );
    }

    // Create order
    const order = await Order.create({
      userId: session.user.id,
      courseId,
      amount: course.price,
      currency: course.currency || 'USD',
      customerInfo,
      status: 'pending',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('courseId', 'title image instructor price');

    return NextResponse.json(
      { order: populatedOrder },
      { status: 201 }
    );

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Complete order (called by payment webhook)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentIntentId, status } = body;

    await dbConnect();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    order.status = status;
    order.paymentIntentId = paymentIntentId;
    
    if (status === 'completed') {
      order.completedAt = new Date();
      
      // Enroll user in course
      await User.findByIdAndUpdate(order.userId, {
        $addToSet: { enrolledCourses: order.courseId }
      });

      // Increment course enrollment count
      await Course.findByIdAndUpdate(order.courseId, {
        $inc: { enrollmentCount: 1 }
      });
    }

    await order.save();

    return NextResponse.json({ order });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}