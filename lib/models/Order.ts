import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentIntentId: {
    type: String, // Stripe payment intent ID
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'apple_pay'],
    default: 'stripe',
  },
  customerInfo: {
    name: String,
    email: String,
    address: {
      line1: String,
      city: String,
      country: String,
      postal_code: String,
    },
  },
  completedAt: Date,
  refundedAt: Date,
  refundAmount: Number,
}, {
  timestamps: true,
});

// Index for user orders
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ paymentIntentId: 1 });
OrderSchema.index({ courseId: 1, status: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ userId: 1, courseId: 1 }, { unique: true }); // Prevent duplicate orders

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);