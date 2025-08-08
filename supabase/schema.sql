-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE lesson_type AS ENUM ('video', 'text', 'quiz', 'assignment');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('stripe', 'paypal', 'apple_pay');
CREATE TYPE resource_type AS ENUM ('pdf', 'link', 'download', 'text');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role user_role DEFAULT 'student',
  avatar TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'English',
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  duration TEXT NOT NULL,
  image_url TEXT,
  instructor_id UUID REFERENCES public.profiles(id),
  is_published BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course sections table
CREATE TABLE public.course_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration TEXT,
  lesson_type lesson_type DEFAULT 'video',
  vimeo_url TEXT,
  vimeo_video_id TEXT,
  content TEXT,
  is_preview BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson resources table
CREATE TABLE public.lesson_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type resource_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User enrollments table
CREATE TABLE public.enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Completed lessons tracking
CREATE TABLE public.completed_lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status order_status DEFAULT 'pending',
  payment_intent_id TEXT,
  payment_method payment_method DEFAULT 'stripe',
  customer_name TEXT,
  customer_email TEXT,
  customer_address JSONB,
  completed_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates table
CREATE TABLE public.certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create indexes for performance
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_level ON public.courses(level);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_lessons_course_order ON public.lessons(course_id, order_index);
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX idx_completed_lessons_user ON public.completed_lessons(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their courses" ON public.courses
  FOR ALL USING (
    instructor_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('instructor', 'admin'))
  );

-- Lessons policies
CREATE POLICY "Anyone can view published lessons" ON public.lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Enrolled users can view course lessons" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE user_id = auth.uid() AND course_id = lessons.course_id
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can enroll in courses" ON public.enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Certificates policies
CREATE POLICY "Users can view their own certificates" ON public.certificates
  FOR SELECT USING (user_id = auth.uid());

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 