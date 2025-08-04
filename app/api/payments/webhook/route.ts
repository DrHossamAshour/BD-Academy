import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    });

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    await dbConnect();

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const order = await Order.findOne({
          paymentIntentId: paymentIntent.id,
        });

        if (order) {
          // Update order status
          order.status = 'completed';
          order.completedAt = new Date();
          await order.save();

          // Enroll user in course
          await User.findByIdAndUpdate(order.userId, {
            $addToSet: { enrolledCourses: order.courseId }
          });

          // Increment course enrollment count
          await Course.findByIdAndUpdate(order.courseId, {
            $inc: { enrollmentCount: 1 }
          });

          console.log('Payment succeeded for order:', order._id);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        
        const failedOrder = await Order.findOne({
          paymentIntentId: failedPayment.id,
        });

        if (failedOrder) {
          failedOrder.status = 'failed';
          await failedOrder.save();
          console.log('Payment failed for order:', failedOrder._id);
        }
        break;

      case 'charge.dispute.created':
        // Handle dispute created
        const dispute = event.data.object as Stripe.Dispute;
        console.log('Dispute created:', dispute.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}