"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  BookOpen,
  Download,
  ArrowLeft,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  image: string;
  duration: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "student") {
      router.push("/dashboard");
      return;
    }

    // Mock course data - in real app, fetch from API
    setCourse({
      id: params.id,
      title: "Performance Marketing Mastery",
      description: "Learn advanced digital marketing strategies to boost your business performance and drive results.",
      instructor: "Ahmed Hassan",
      image: "https://ext.same-assets.com/1352620099/2409258185.webp",
      duration: "5 hours",
      lessons: [
        { id: 1, title: "Introduction to Performance Marketing", duration: "15 min", completed: true },
        { id: 2, title: "Setting Up Google Analytics", duration: "25 min", completed: true },
        { id: 3, title: "Advanced Targeting Strategies", duration: "30 min", completed: false },
        { id: 4, title: "Conversion Rate Optimization", duration: "45 min", completed: false },
        { id: 5, title: "A/B Testing Fundamentals", duration: "35 min", completed: false },
        { id: 6, title: "Retargeting Campaigns", duration: "40 min", completed: false },
        { id: 7, title: "Performance Analytics", duration: "30 min", completed: false },
        { id: 8, title: "Final Project & Certification", duration: "60 min", completed: false }
      ]
    });
    setLoading(false);
  }, [session, status, router, params.id]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
            <p className="text-gray-600 mb-8">The course you're looking for doesn't exist.</p>
            <Link href="/dashboard/student">
              <Button className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const progress = Math.round((completedLessons / course.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Course Header */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/dashboard/student" className="hover:opacity-80">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl opacity-90 mb-6">{course.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {course.lessons.length} lessons
                </span>
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  4.9 rating
                </span>
              </div>
            </div>
            <div className="lg:w-1/3">
              <Image
                src={course.image}
                alt={course.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lessons List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Course Content</span>
                    <span className="text-sm font-normal text-gray-600">
                      {completedLessons} of {course.lessons.length} completed
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#d8bf78] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-3">
                    {course.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                          lesson.completed
                            ? 'bg-green-50 border-green-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          // Handle lesson click - in real app, navigate to lesson content
                          console.log(`Navigate to lesson ${lesson.id}`);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            lesson.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {lesson.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              lesson.completed ? 'text-green-800' : 'text-gray-900'
                            }`}>
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-500">{lesson.duration}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={lesson.completed ? 'text-green-600' : 'text-gray-400'}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Instructor</h4>
                    <p className="text-gray-600">{course.instructor}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Duration</h4>
                    <p className="text-gray-600">{course.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Level</h4>
                    <p className="text-gray-600">Intermediate</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Category</h4>
                    <p className="text-gray-600">Digital Marketing</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/dashboard/student/course/${course.id}/resources`}>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resources
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 