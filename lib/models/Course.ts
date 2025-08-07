import mongoose from 'mongoose';

const CourseLessonSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'text', 'quiz', 'assignment'],
    default: 'video',
  },
  duration: {
    type: String,
    required: true,
  },
  content: String,
  vimeoUrl: String,
  vimeoId: String,
  isProtected: {
    type: Boolean,
    default: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
});

const CourseSectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lessons: [CourseLessonSchema],
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: Number,
  duration: {
    type: String,
    required: true,
  },
  lessons: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
  video: String,
  requirements: [String],
  whatYouLearn: [String],
  sections: [CourseSectionSchema],
  isPublished: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  enableCertificate: {
    type: Boolean,
    default: true,
  },
  enableDiscussion: {
    type: Boolean,
    default: true,
  },
  maxStudents: Number,
  accessDuration: {
    type: String,
    default: 'lifetime',
  },
  instructor: {
    type: String,
    required: true,
  },
  instructorId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'pending'],
    default: 'draft',
  },
  students: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
CourseSchema.index({ instructorId: 1, status: 1 });
CourseSchema.index({ category: 1, status: 1 });
CourseSchema.index({ isFeatured: 1, status: 1 });
CourseSchema.index({ featured: 1, status: 1 });
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ price: 1, status: 1 });
CourseSchema.index({ rating: -1, status: 1 });
CourseSchema.index({ students: -1, status: 1 });
CourseSchema.index({ createdAt: -1, status: 1 });
CourseSchema.index({ level: 1, category: 1, status: 1 }); // Compound index for filtering

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);