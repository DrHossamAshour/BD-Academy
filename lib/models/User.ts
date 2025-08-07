import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 320,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  avatar: {
    type: String,
    default: '',
    maxlength: 500,
  },
  // Security-related fields
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    default: null,
  },
  emailVerificationExpires: {
    type: Date,
    default: null,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  accountLocked: {
    type: Boolean,
    default: false,
  },
  accountLockedUntil: {
    type: Date,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
    default: null,
  },
  // Existing fields
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

// Index for performance and security
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });
UserSchema.index({ accountLocked: 1, accountLockedUntil: 1 });

// Security methods
UserSchema.methods.isAccountLocked = function() {
  return this.accountLocked && this.accountLockedUntil && this.accountLockedUntil > Date.now();
};

UserSchema.methods.incrementLoginAttempts = function() {
  // Max 5 attempts before locking for 30 minutes
  if (this.loginAttempts + 1 >= 5) {
    this.accountLocked = true;
    this.accountLockedUntil = Date.now() + (30 * 60 * 1000); // 30 minutes
  }
  this.loginAttempts += 1;
  return this.save();
};

UserSchema.methods.resetLoginAttempts = function() {
  this.loginAttempts = 0;
  this.accountLocked = false;
  this.accountLockedUntil = null;
  this.lastLogin = new Date();
  return this.save();
};

export default mongoose.models.User || mongoose.model('User', UserSchema);