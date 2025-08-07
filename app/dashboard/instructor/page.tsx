"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  BarChart3,
  MessageSquare,
  Star,
  Clock,
  Eye
} from "lucide-react";
import Image from "next/image";

export default function InstructorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    monthlyEarnings: 0,
    courseRating: 0
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses/debug');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
        
        // Calculate basic stats
        const courseCount = data.data?.length || 0;
        const publishedCount = data.data?.filter((course: any) => course.isPublished)?.length || 0;
        const totalStudents = data.data?.reduce((sum: number, course: any) => sum + (course.students || 0), 0) || 0;
        
        setStats(prevStats => ({
          ...prevStats,
          totalCourses: courseCount,
          publishedCourses: publishedCount,
          totalStudents: totalStudents
        }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "instructor") {
      router.push("/dashboard");
      return;
    }

    loadDashboardData();
  }, [session, status, router, loadDashboardData]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      change: "+8%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Courses",
      value: stats.activeCourses.toString(),
      change: "+2",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Monthly Earnings",
      value: `$${stats.monthlyEarnings.toLocaleString()}`,
      change: "+15%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Course Rating",
      value: stats.courseRating.toString(),
      change: "+0.2",
      icon: Star,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Create New Course",
      description: "Start building your next course",
      icon: Plus,
      href: "/dashboard/instructor/courses/new"
    },
    {
      title: "View Analytics",
      description: "Check your course performance",
      icon: BarChart3,
      href: "/dashboard/instructor/analytics"
    },
    {
      title: "Student Messages",
      description: "Respond to student inquiries",
      icon: MessageSquare,
      href: "/dashboard/instructor/messages"
    },
    {
      title: "Earnings Report",
      description: "View your payment history",
      icon: DollarSign,
      href: "/dashboard/instructor/earnings"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Instructor Dashboard
          </h1>
          <p className="text-xl opacity-90">
            Welcome back, {session?.user?.name}. Manage your courses and track your success.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
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
            {/* My Courses */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    My Courses
                  </CardTitle>
                  <Button onClick={() => router.push("/dashboard/instructor/courses")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                        <p className="text-gray-600 mb-4">Start creating your first course to begin your teaching journey.</p>
                        <Button 
                          onClick={() => router.push("/dashboard/instructor/courses/new")}
                          className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Course
                        </Button>
                      </div>
                    ) : (
                      courses.map((course) => (
                        <div key={course._id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Image
                            src={course.image}
                            alt={course.title}
                            width={80}
                            height={60}
                            className="w-20 h-15 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://ext.same-assets.com/1352620099/2409258185.webp";
                            }}
                            unoptimized={course.image?.startsWith('/uploads/')}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {course.students || 0} students
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                {course.rating || 0}
                              </span>
                              {getStatusBadge(course.status)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${course.revenue || 0}</p>
                            <p className="text-sm text-gray-600">earnings</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/instructor/courses/${course._id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                    
                    {courses.length > 0 && (
                      <div className="text-center pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => router.push("/dashboard/instructor/courses")}
                          className="text-[#d8bf78] border-[#d8bf78] hover:bg-[#d8bf78] hover:text-white"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View All Courses
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
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
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 