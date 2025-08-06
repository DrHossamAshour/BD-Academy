"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Star,
  Play,
  Target,
  Calendar,
  TrendingUp
} from "lucide-react";
import Image from "next/image";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Courses Enrolled",
      value: "5",
      change: "+2",
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      title: "Hours Learned",
      value: "24",
      change: "+8",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Certificates",
      value: "3",
      change: "+1",
      icon: Award,
      color: "text-purple-600"
    },
    {
      title: "Average Score",
      value: "92%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: "Performance Marketing Mastery",
      image: "https://ext.same-assets.com/1352620099/2409258185.webp",
      instructor: "Ahmed Hassan",
      progress: 65,
      totalLessons: 45,
      completedLessons: 29,
      lastWatched: "Setting Up Google Analytics",
      duration: "5 hours",
      nextLesson: "Advanced Targeting Strategies"
    },
    {
      id: 2,
      title: "Visual Content Creation",
      image: "https://ext.same-assets.com/1352620099/3921090386.webp",
      instructor: "Sarah Johnson",
      progress: 30,
      totalLessons: 25,
      completedLessons: 8,
      lastWatched: "Color Theory Basics",
      duration: "3 hours",
      nextLesson: "Typography Fundamentals"
    },
    {
      id: 3,
      title: "Social Media Strategy",
      image: "https://ext.same-assets.com/1352620099/2409258185.webp",
      instructor: "Mike Chen",
      progress: 0,
      totalLessons: 30,
      completedLessons: 0,
      lastWatched: "Not started yet",
      duration: "4 hours",
      nextLesson: "Introduction to Social Media"
    }
  ];

  const certificates = [
    {
      id: 1,
      title: "Digital Marketing Fundamentals",
      date: "2024-01-15",
      grade: "A+"
    },
    {
      id: 2,
      title: "Content Writing Mastery",
      date: "2024-02-20",
      grade: "A"
    },
    {
      id: 3,
      title: "SEO Optimization",
      date: "2024-03-10",
      grade: "A+"
    }
  ];

  const quickActions = [
    {
      title: "Browse Courses",
      description: "Discover new courses to enroll in",
      icon: BookOpen,
      href: "/courses"
    },
    {
      title: "View Certificates",
      description: "Access your earned certificates",
      icon: Award,
      href: "/dashboard/student/certificates"
    },
    {
      title: "Learning Goals",
      description: "Set and track your learning objectives",
      icon: Target,
      href: "/dashboard/student/goals"
    },
    {
      title: "Study Calendar",
      description: "Plan your learning schedule",
      icon: Calendar,
      href: "/dashboard/student/calendar"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Student Dashboard
          </h1>
          <p className="text-xl opacity-90">
            Welcome back, {session?.user?.name}. Continue your learning journey!
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change} from last month</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrolled Courses */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Continue Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-6">
                        <div className="flex space-x-4">
                          <Image
                            src={course.image}
                            alt={course.title}
                            width={80}
                            height={60}
                            className="w-20 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 mb-1">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              by {course.instructor}
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                              Last watched: {course.lastWatched}
                            </p>

                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-semibold">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[#d8bf78] h-2 rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {course.completedLessons} of {course.totalLessons} lessons completed
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <Button 
                                className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                                onClick={() => router.push(`/dashboard/student/course/${course.id}`)}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Continue
                              </Button>
                              <span className="text-sm text-gray-500">
                                Next: {course.nextLesson}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full h-auto p-4 justify-start"
                        onClick={() => router.push(action.href)}
                      >
                        <div className="flex items-center gap-3">
                          <action.icon className="h-5 w-5 text-[#d8bf78]" />
                          <div className="text-left">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-sm text-gray-500">{action.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{cert.title}</p>
                          <p className="text-xs text-gray-500">{cert.date}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {cert.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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