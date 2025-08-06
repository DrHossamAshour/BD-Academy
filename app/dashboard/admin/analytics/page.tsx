"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BookOpen,
  GraduationCap,
  Calendar,
  ArrowLeft,
  Download,
  Filter,
  PieChart,
  Activity,
  Target,
  Award,
  Clock,
  Star,
  Eye,
  UserPlus,
  ShoppingCart,
  CreditCard,
  BarChart,
  LineChart,
  PieChart as PieChartIcon
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock analytics data
const analyticsData = {
  overview: {
    totalRevenue: 124750,
    totalUsers: 2847,
    totalCourses: 156,
    totalEnrollments: 8923,
    monthlyGrowth: 23,
    userGrowth: 12,
    courseGrowth: 8,
    enrollmentGrowth: 15
  },
  revenueData: {
    monthly: [
      { month: "Jan", revenue: 8500, enrollments: 234 },
      { month: "Feb", revenue: 9200, enrollments: 267 },
      { month: "Mar", revenue: 11200, enrollments: 312 },
      { month: "Apr", revenue: 9800, enrollments: 289 },
      { month: "May", revenue: 13400, enrollments: 378 },
      { month: "Jun", revenue: 15600, enrollments: 445 }
    ],
    byCategory: [
      { category: "Implantology", revenue: 45678, percentage: 36.6 },
      { category: "Orthodontics", revenue: 23456, percentage: 18.8 },
      { category: "Cosmetic Dentistry", revenue: 34567, percentage: 27.7 },
      { category: "Endodontics", revenue: 12345, percentage: 9.9 },
      { category: "Periodontics", revenue: 23456, percentage: 18.8 },
      { category: "Pediatric Dentistry", revenue: 9876, percentage: 7.9 }
    ]
  },
  userAnalytics: {
    userTypes: [
      { type: "Students", count: 2341, percentage: 82.2 },
      { type: "Instructors", count: 156, percentage: 5.5 },
      { type: "Admins", count: 5, percentage: 0.2 },
      { type: "Premium Users", count: 892, percentage: 31.3 }
    ],
    userGrowth: [
      { month: "Jan", newUsers: 156, activeUsers: 1247 },
      { month: "Feb", newUsers: 178, activeUsers: 1345 },
      { month: "Mar", newUsers: 234, activeUsers: 1847 },
      { month: "Apr", newUsers: 198, activeUsers: 1656 },
      { month: "May", newUsers: 267, activeUsers: 1987 },
      { month: "Jun", newUsers: 289, activeUsers: 2145 }
    ],
    topInstructors: [
      { name: "Dr. Michael Chen", courses: 8, students: 342, revenue: 28470 },
      { name: "Dr. Emily Rodriguez", courses: 6, students: 287, revenue: 21450 },
      { name: "Dr. Lisa Thompson", courses: 5, students: 198, revenue: 15680 },
      { name: "Dr. James Wilson", courses: 4, students: 145, revenue: 12340 },
      { name: "Dr. Sarah Johnson", courses: 3, students: 98, revenue: 8760 }
    ]
  },
  courseAnalytics: {
    courseStatus: [
      { status: "Published", count: 142, percentage: 91.0 },
      { status: "Pending Review", count: 23, percentage: 14.7 },
      { status: "Draft", count: 14, percentage: 9.0 },
      { status: "Rejected", count: 8, percentage: 5.1 }
    ],
    topCourses: [
      { title: "Advanced Dental Implantology", enrollments: 342, revenue: 102258, rating: 4.8 },
      { title: "Cosmetic Dentistry Masterclass", enrollments: 287, revenue: 71463, rating: 4.6 },
      { title: "Periodontal Surgery Fundamentals", enrollments: 198, revenue: 45342, rating: 4.7 },
      { title: "Modern Orthodontic Techniques", enrollments: 156, revenue: 31044, rating: 4.5 },
      { title: "Endodontic Excellence", enrollments: 134, revenue: 23986, rating: 4.4 }
    ],
    categoryDistribution: [
      { category: "Implantology", courses: 23, enrollments: 1245 },
      { category: "Orthodontics", courses: 18, enrollments: 987 },
      { category: "Cosmetic Dentistry", courses: 15, enrollments: 1456 },
      { category: "Endodontics", courses: 12, enrollments: 678 },
      { category: "Periodontics", courses: 10, enrollments: 543 },
      { category: "Pediatric Dentistry", courses: 8, enrollments: 234 }
    ]
  },
  platformMetrics: {
    systemHealth: {
      uptime: "99.9%",
      responseTime: "245ms",
      errorRate: "0.1%",
      activeSessions: 847
    },
    performance: {
      pageLoadTime: "1.2s",
      videoStreaming: "98.5%",
      mobileOptimization: "95.2%",
      searchAccuracy: "94.8%"
    }
  }
};

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("6months");

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "admin") {
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

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  const renderPieChart = (data: any[], title: string, colors: string[]) => {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm font-medium">{item.category || item.type || item.status}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {item.revenue ? `$${item.revenue.toLocaleString()}` : item.count}
                </div>
                <div className="text-xs text-gray-500">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBarChart = (data: any[], title: string, valueKey: string, labelKey: string) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]));
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item[labelKey]}</span>
                <span className="text-sm text-gray-600">{item[valueKey]}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#d8bf78] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const pieColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/dashboard/admin">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive platform analytics and performance metrics</p>
            </div>
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analyticsData.overview.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analyticsData.overview.monthlyGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analyticsData.overview.userGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analyticsData.overview.courseGrowth}</span> new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalEnrollments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analyticsData.overview.enrollmentGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5" />
                <span>Revenue by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderPieChart(analyticsData.revenueData.byCategory, "Revenue Distribution", pieColors)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="w-5 h-5" />
                <span>Monthly Revenue Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderBarChart(analyticsData.revenueData.monthly, "Revenue Growth", "revenue", "month")}
            </CardContent>
          </Card>
        </div>

        {/* User Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5" />
                <span>User Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderPieChart(analyticsData.userAnalytics.userTypes, "User Types", pieColors)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="w-5 h-5" />
                <span>User Growth Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderBarChart(analyticsData.userAnalytics.userGrowth, "New Users", "newUsers", "month")}
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Top Instructors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.userAnalytics.topInstructors.map((instructor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{instructor.name}</div>
                      <div className="text-sm text-gray-500">{instructor.courses} courses • {instructor.students} students</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${instructor.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Top Performing Courses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.courseAnalytics.topCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.enrollments} enrollments • ⭐ {course.rating}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${course.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>System Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <Badge className="bg-green-100 text-green-800">{analyticsData.platformMetrics.systemHealth.uptime}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium">{analyticsData.platformMetrics.systemHealth.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className="text-sm font-medium">{analyticsData.platformMetrics.systemHealth.errorRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm font-medium">{analyticsData.platformMetrics.systemHealth.activeSessions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Page Load Time</span>
                  <span className="text-sm font-medium">{analyticsData.platformMetrics.performance.pageLoadTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Video Streaming</span>
                  <span className="text-sm font-medium">{analyticsData.platformMetrics.performance.videoStreaming}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mobile Optimization</span>
                  <span className="text-sm font-medium">{analyticsData.platformMetrics.performance.mobileOptimization}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Search Accuracy</span>
                  <span className="text-sm font-medium">{analyticsData.platformMetrics.performance.searchAccuracy}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5" />
              <span>Course Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.courseAnalytics.courseStatus.map((status, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#d8bf78]">{status.count}</div>
                  <div className="text-sm font-medium text-gray-900">{status.status}</div>
                  <div className="text-xs text-gray-500">{status.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 