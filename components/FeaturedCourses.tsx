"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FeaturedCourses() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback mock data when database connection fails
  const fallbackCourses = [
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
      originalPrice: 129
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
    const fetchFeaturedCourses = async () => {
      try {
        const response = await fetch('/api/courses/public');
        if (response.ok) {
          const data = await response.json();
          // Filter featured courses or use all if none are marked as featured
          const featuredCourses = data.filter((course: any) => course.isFeatured) || data.slice(0, 3);
          setCourses(featuredCourses);
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

    fetchFeaturedCourses();
  }, []);

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
      <section className="py-16 bg-gradient-to-r from-[#d8bf78] to-[#c4a86a]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null; // Don't show section if no courses
  }

  return (
    <section className="py-16 bg-gradient-to-r from-[#d8bf78] to-[#c4a86a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Featured Courses
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Discover our most popular dental education courses designed by industry experts
          </p>
        </div>

        {/* Using the exact same grid layout as courses page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="hover:shadow-lg transition-shadow bg-white">
              <div className="relative">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://ext.same-assets.com/1352620099/2409258185.webp";
                    }}
                    unoptimized={course.image?.startsWith('/uploads/')}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-[#d8bf78] text-white">
                      {course.duration}
                    </Badge>
                  </div>
                  {course.isFeatured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-[#d8bf78] text-white">Featured</Badge>
                    </div>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {course.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs border-[#d8bf78] text-[#d8bf78]">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-[#d8bf78] text-[#d8bf78]">
                    {course.level}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm font-medium">{course.rating || 4.5}</span>
                    <span className="text-xs text-gray-500 ml-1">({course.reviews || 0} reviews)</span>
                  </div>
                  <div className="text-lg font-bold text-[#d8bf78]">
                    ${course.price}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#d8bf78] text-[#d8bf78] hover:bg-[#d8bf78] hover:text-white"
                    onClick={() => window.location.href = `/courses/${course._id}`}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    View Course
                  </Button>
                  <Button 
                    className="flex-1 bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                    onClick={() => handleStartLearning(course._id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {session?.user ? 'Start Learning' : 'Login to Learn'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="bg-white text-[#d8bf78] hover:bg-gray-100 px-8 py-3">
            <Link href="/courses">
              View All Courses
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
