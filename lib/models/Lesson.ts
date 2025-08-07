import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  duration: {
    type: String, // e.g., "15 minutes"
  },
  vimeoUrl: {
    type: String,
    required: true,
  },
  vimeoVideoId: {
    type: String,
    required: true,
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'download', 'text'],
    },
  }],
  isPreview: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for course lessons ordering
LessonSchema.index({ courseId: 1, order: 1 });
LessonSchema.index({ courseId: 1, isPublished: 1 });
LessonSchema.index({ isPreview: 1, courseId: 1 });

export default mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);