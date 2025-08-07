import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';

const createOrderSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  customerInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
  }),
});

const updateOrderSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
  status: z.enum(['pending', 'completed', 'cancelled', 'failed']),
});

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
    
    // Validate input
    const result = createOrderSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const { courseId, customerInfo } = result.data;

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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = updateOrderSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const { orderId, paymentIntentId, status } = result.data;

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