import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import Course from '@/lib/models/Course';
import Order from '@/lib/models/Order';

const paymentIntentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    });

    await dbConnect();

    const body = await request.json();
    
    // Validate input
    const result = paymentIntentSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const { courseId, orderId } = result.data;

    // Get course and order details
    const [course, order] = await Promise.all([
      Course.findById(courseId),
      Order.findById(orderId)
    ]);

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order belongs to current user
    if (order.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100), // Convert to cents
      currency: course.currency?.toLowerCase() || 'usd',
      metadata: {
        courseId: course._id.toString(),
        orderId: order._id.toString(),
        userId: session.user.id,
      },
      description: `Course: ${course.title}`,
    });

    // Update order with payment intent ID
    await Order.findByIdAndUpdate(orderId, {
      paymentIntentId: paymentIntent.id,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}