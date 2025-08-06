"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BookOpen,
  Star,
  Eye,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  Award,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock analytics data
const analyticsData = {
  overview: {
    totalStudents: 1247,
    totalRevenue: 45680,
    totalCourses: 8,
    averageRating: 4.8,
    studentGrowth: 12.5,
    revenueGrowth: 8.3,
    courseGrowth: 2.1,
    ratingGrowth: 0.2
  },
  monthlyStats: [
    { month: "Jan", students: 120, revenue: 4200, enrollments: 45 },
    { month: "Feb", students: 180, revenue: 5800, enrollments: 62 },
    { month: "Mar", students: 220, revenue: 7200, enrollments: 78 },
    { month: "Apr", students: 280, revenue: 8900, enrollments: 95 },
    { month: "May", students: 320, revenue: 10200, enrollments: 108 },
    { month: "Jun", students: 380, revenue: 11800, enrollments: 125 },
    { month: "Jul", students: 420, revenue: 13200, enrollments: 142 },
    { month: "Aug", students: 480, revenue: 14800, enrollments: 158 },
    { month: "Sep", students: 520, revenue: 16200, enrollments: 175 },
    { month: "Oct", students: 580, revenue: 17800, enrollments: 192 },
    { month: "Nov", students: 640, revenue: 19500, enrollments: 208 },
    { month: "Dec", students: 720, revenue: 21400, enrollments: 225 }
  ],
  topCourses: [
    {
      id: 1,
      title: "Advanced Dental Implantology",
      students: 456,
      revenue: 13680,
      rating: 4.9,
      completionRate: 87
    },
    {
      id: 2,
      title: "Modern Orthodontic Techniques",
      students: 389,
      revenue: 7780,
      rating: 4.8,
      completionRate: 92
    },
    {
      id: 3,
      title: "Cosmetic Dentistry Masterclass",
      students: 324,
      revenue: 8100,
      rating: 4.7,
      completionRate: 85
    },
    {
      id: 4,
      title: "Endodontic Excellence",
      students: 298,
      revenue: 5364,
      rating: 4.6,
      completionRate: 89
    },
    {
      id: 5,
      title: "Periodontal Surgery",
      students: 267,
      revenue: 5340,
      rating: 4.5,
      completionRate: 83
    }
  ],
  studentEngagement: {
    activeStudents: 892,
    inactiveStudents: 355,
    newStudents: 156,
    returningStudents: 736
  },
  recentActivity: [
    {
      id: 1,
      type: "enrollment",
      message: "New student enrolled in Advanced Dental Implantology",
      time: "2 minutes ago",
      student: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      type: "completion",
      message: "Student completed Modern Orthodontic Techniques",
      time: "15 minutes ago",
      student: "Dr. Michael Chen"
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review received",
      time: "1 hour ago",
      student: "Dr. Emily Rodriguez"
    },
    {
      id: 4,
      type: "revenue",
      message: "Course sale: $299",
      time: "2 hours ago",
      student: "Dr. James Wilson"
    }
  ]
};

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("30d");

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
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "instructor") {
    return null;
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUp className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDown className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment": return <Users className="w-4 h-4 text-blue-500" />;
      case "completion": return <Award className="w-4 h-4 text-green-500" />;
      case "review": return <Star className="w-4 h-4 text-yellow-500" />;
      case "revenue": return <DollarSign className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your course performance and student engagement</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Link href="/dashboard/instructor">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.overview.totalStudents.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.overview.studentGrowth)}
                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.studentGrowth)}`}>
                      {analyticsData.overview.studentGrowth}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analyticsData.overview.totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                      {analyticsData.overview.revenueGrowth}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.overview.totalCourses}
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.overview.courseGrowth)}
                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.courseGrowth)}`}>
                      {analyticsData.overview.courseGrowth}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.overview.averageRating}
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.overview.ratingGrowth)}
                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.ratingGrowth)}`}>
                      {analyticsData.overview.ratingGrowth}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performing Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Top Performing Courses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topCourses.map((course, index) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-[#d8bf78] rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{course.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {course.students} students
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1" />
                              {course.rating}
                            </span>
                            <span className="flex items-center">
                              <Target className="w-4 h-4 mr-1" />
                              {course.completionRate}% completion
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${course.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Engagement */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Student Engagement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Students</span>
                    <span className="font-semibold text-green-600">
                      {analyticsData.studentEngagement.activeStudents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(analyticsData.studentEngagement.activeStudents / analyticsData.overview.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Students</span>
                    <span className="font-semibold text-blue-600">
                      {analyticsData.studentEngagement.newStudents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(analyticsData.studentEngagement.newStudents / analyticsData.overview.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Returning Students</span>
                    <span className="font-semibold text-purple-600">
                      {analyticsData.studentEngagement.returningStudents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${(analyticsData.studentEngagement.returningStudents / analyticsData.overview.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.student} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Chart Placeholder */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Monthly Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Monthly student growth and revenue trends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 