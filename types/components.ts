// Component prop types

import { ReactNode } from 'react';
import { Course, CourseStats } from './course';
import { User } from './user';

// Layout component props
export interface LayoutProps {
  children: ReactNode;
}

// Header component props
export interface HeaderProps {
  className?: string;
}

// Footer component props
export interface FooterProps {
  className?: string;
}

// Course component props
export interface CourseCardProps {
  course: Course;
  showInstructor?: boolean;
  showProgress?: boolean;
  progress?: number;
  onEnrollClick?: (courseId: string) => void;
}

export interface CourseGridProps {
  courses: Course[];
  loading?: boolean;
  showFilters?: boolean;
  onCourseSelect?: (course: Course) => void;
}

export interface CourseCarouselProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export interface FeaturedCoursesProps {
  className?: string;
}

// UI component props
export interface ButtonProps {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

export interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  rows?: number;
}

export interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
}

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

// Image upload component props
export interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2';
  className?: string;
}

// Video player component props
export interface VimeoPlayerProps {
  vimeoUrl: string;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
}

// Category grid props
export interface CategoryGridProps {
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    courseCount: number;
    description?: string;
  }>;
  onCategorySelect?: (categoryId: string) => void;
}

// Instructors section props
export interface InstructorsSectionProps {
  instructors: User[];
  className?: string;
}

// Stats section props
export interface StatsSectionProps {
  stats: CourseStats;
  className?: string;
}