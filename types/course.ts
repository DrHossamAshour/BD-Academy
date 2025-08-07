// Course related type definitions

export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  duration: string;
  videoUrl?: string;
  vimeoUrl?: string;
  materials?: string[];
  isCompleted?: boolean;
  order: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  order: number;
}

export interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  price: number;
  originalPrice?: number;
  duration: string;
  lessons: number;
  image: string;
  video?: string;
  requirements: string[];
  whatYouLearn: string[];
  sections: CourseSection[];
  instructor: string;
  instructorId: string;
  isPublished: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  enableCertificate: boolean;
  enableDiscussion: boolean;
  tags: string[];
  maxStudents?: number;
  accessDuration: 'lifetime' | '1-year' | '6-months';
  rating?: number;
  students?: number;
  revenue?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCreateData {
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  level: string;
  language: string;
  price: string;
  originalPrice?: string;
  duration: string;
  lessons: number;
  image: string;
  video?: string;
  requirements: string[];
  whatYouLearn: string[];
  sections: CourseSection[];
  isPublished: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  enableCertificate: boolean;
  enableDiscussion: boolean;
  tags: string[];
  maxStudents?: string;
  accessDuration: string;
}

export interface CourseFilters {
  searchQuery: string;
  categoryFilter: string;
  levelFilter: string;
  priceFilter: string;
  sortBy: string;
}

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
}