"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { Course } from "@/types/course";
import { CourseCarouselProps } from "@/types/components";

export default function CourseCarousel({ title = "Featured Courses", subtitle, className }: CourseCarouselProps) {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Partial<Course>[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback mock data when database connection fails
  const fallbackCourses: Partial<Course>[] = [
    {
      _id: '1',
      title: 'Dental Anatomy Fundamentals',
      description: 'Learn the essential anatomy of teeth and oral structures',
      image: '/images/course-1.jpg',
      instructor: 'Dr. Sarah Johnson',
      price: 99,
      rating: 4.8,
      students: 1250,
      isFeatured: true,
      subtitle: 'Essential Knowledge',
      category: 'Anatomy',
      originalPrice: 129,
      level: 'Beginner' as const
    },
    {
      _id: '2', 
      title: 'Advanced Restorative Techniques',
      description: 'Master modern restorative dentistry procedures',
      image: '/images/course-2.jpg',
      instructor: 'Dr. Michael Chen',
      price: 149,
      rating: 4.9,
      students: 890,
      isFeatured: true,
      subtitle: 'Professional Skills',
      category: 'Restorative',
      originalPrice: 199
    },
    {
      _id: '3',
      title: 'Orthodontics for Beginners',
      description: 'Introduction to orthodontic principles and practices',
      image: '/images/course-3.jpg',
      instructor: 'Dr. Emily Rodriguez',
      price: 129,
      rating: 4.7,
      students: 1100,
      isFeatured: true,
      subtitle: 'Foundation Course',
      category: 'Orthodontics',
      originalPrice: 159
    }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses/public');
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          console.log('Using fallback courses due to database connection issue');
          setCourses(fallbackCourses);
        }
      } catch (error) {
        console.log('Database connection failed, using fallback courses');
        setCourses(fallbackCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [fallbackCourses]);

  // Auto-scroll functionality
  useEffect(() => {
    if (courses.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
      }, 4000); // Change slide every 4 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [courses.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
    // Reset auto-scroll timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + courses.length) % courses.length);
    // Reset auto-scroll timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleEnrollClick = (courseId: string) => {
    if (!session?.user) {
      sessionStorage.setItem('redirectAfterLogin', `/courses/${courseId}`);
      window.location.href = '/auth/login';
      return;
    }
    window.location.href = `/checkout?courseId=${courseId}`;
  };

  const handleStartLearning = (courseId: string) => {
    if (!session?.user) {
      sessionStorage.setItem('redirectAfterLogin', `/courses/${courseId}/learn`);
      window.location.href = '/auth/login';
      return;
    }
    window.location.href = `/courses/${courseId}/learn`;
  };

  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null; // Don't show carousel if no courses
  }

  // Determine display configuration based on course count
  const isManyCourses = courses.length > 8;
  const cardsPerView = isManyCourses ? 3 : 1;
  const cardWidth = isManyCourses ? 'w-1/3' : 'w-full';
  const showArrows = courses.length > cardsPerView;

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Navigation Arrows - Only show if there are more courses than cards per view */}
          {showArrows && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Course Cards */}
          <div className={`overflow-hidden ${showArrows ? 'mx-12' : 'mx-0'}`}>
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                width: `${(courses.length * 100) / cardsPerView}%`
              }}
            >
              {courses.map((course, index) => (
                <div key={course._id} className={`flex-shrink-0 ${cardWidth} px-3`}>
                  <Card className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white relative overflow-hidden h-full min-h-[500px]">
                    <div className="p-6 h-full flex flex-col">
                      {/* Badge */}
                      {course.isFeatured && (
                        <Badge className="absolute top-4 right-4 bg-yellow-400 text-black font-bold">
                          FEATURED
                        </Badge>
                      )}

                      {/* Content */}
                      <div className="space-y-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold line-clamp-2 mb-3 leading-tight">{course.title}</h3>
                          <h4 className="text-base opacity-90 line-clamp-1 mb-4">{course.subtitle || course.category}</h4>
                          <p className="text-sm opacity-80 leading-relaxed line-clamp-4 mb-4">
                            {course.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">${course.price}</span>
                            {course.originalPrice && (
                              <span className="text-sm opacity-70 line-through">${course.originalPrice}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-4 mt-auto">
                          <Button 
                            variant="outline" 
                            className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm"
                            onClick={() => window.location.href = `/courses/${course._id}`}
                          >
                            View Course
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="flex-1 bg-white text-[#c4a86a] hover:bg-gray-100 text-sm"
                            onClick={() => course._id && handleStartLearning(course._id)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {session?.user ? 'Start Learning' : 'Login to Learn'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none"></div>
                    <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-white/5 rounded-full pointer-events-none"></div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator - Only show if there are multiple courses */}
          {courses.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {courses.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-[#d8bf78]' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
