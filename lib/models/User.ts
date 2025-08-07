import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  avatar: {
    type: String,
    default: '',
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  }],
  certificates: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    certificateUrl: String,
  }],
}, {
  timestamps: true,
});

// Indexes for better performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ enrolledCourses: 1 });
UserSchema.index({ 'certificates.courseId': 1 });
UserSchema.index({ createdAt: -1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);