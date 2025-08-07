"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  Filter,
  Clock,
  Users,
  Award,
  Play,
  Lock,
  Globe
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

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
      category: 'Anatomy',
      level: 'Beginner'
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
      category: 'Restorative',
      level: 'Advanced'
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
      category: 'Orthodontics',
      level: 'Beginner'
    }
  ];

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses/public');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.data || []);
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = courses
    .map(course => course.category)
    .filter((category, index, arr) => arr.indexOf(category) === index);
  const levels = courses
    .map(course => course.level)
    .filter((level, index, arr) => arr.indexOf(level) === index);

  const handleEnrollClick = (courseId: string) => {
    if (!session?.user) {
      // Store the intended course in sessionStorage and redirect to login
      sessionStorage.setItem('redirectAfterLogin', `/courses/${courseId}`);
      window.location.href = '/auth/login';
      return;
    }
    // If user is logged in, redirect to checkout
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

  const handleViewCourse = (courseId: string) => {
    window.location.href = `/courses/${courseId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#d8bf78] to-[#c4a86a] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore Our Courses</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover comprehensive dental education courses from expert instructors. 
            Learn at your own pace and advance your professional skills.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search courses by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                >
                  <option value="all">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">
                {searchQuery || categoryFilter !== "all" || levelFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No courses are available at the moment."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course._id} className="hover:shadow-lg transition-shadow">
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
                          <Badge className="bg-red-500 text-white">Featured</Badge>
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
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-medium">{course.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({course.reviews} reviews)</span>
                      </div>
                      <div className="text-lg font-bold text-[#d8bf78]">
                        ${course.price}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewCourse(course._id)}
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
