// User and authentication related type definitions

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  bio?: string;
  expertise?: string[];
  experience?: string;
  education?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  expertise?: string[];
  experience?: string;
  education?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface InstructorStats {
  totalStudents: number;
  activeCourses: number;
  monthlyEarnings: number;
  courseRating: number;
}

export interface StudentProgress {
  courseId: string;
  courseName: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: Date;
}