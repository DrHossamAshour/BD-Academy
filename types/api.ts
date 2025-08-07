// API response types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: ValidationError[];
  statusCode?: number;
}

// Payment types
export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export interface Order {
  _id: string;
  userId: string;
  courseId: string;
  courseName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentIntentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Upload types
export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Vimeo types
export interface VimeoValidationResponse {
  isValid: boolean;
  videoId?: string;
  error?: string;
}

// Book types
export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  format: 'PDF' | 'eBook' | 'Hardcover' | 'Paperback';
  pages: number;
  language: string;
  features: string[];
  rating?: number;
  reviews?: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Diploma types
export interface Diploma {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
  skills: string[];
  requirements: string[];
  certification: string;
  instructor: string;
  rating?: number;
  students?: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}