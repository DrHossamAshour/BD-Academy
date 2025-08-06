"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ArrowRight,
  UserPlus,
  Settings,
  BarChart3,
  Calendar,
  Award,
  MessageCircle,
  Shield,
  Activity,
  Target,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalOrders: 0,
    totalRevenue: 0,
    students: 0,
    instructors: 0,
    admins: 0,
    publishedCourses: 0,
    draftCourses: 0,
    completedOrders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

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

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersResponse, coursesResponse, ordersResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/courses/debug'),
        fetch('/api/admin/orders')
      ]);

      if (usersResponse.ok && coursesResponse.ok && ordersResponse.ok) {
        const [usersData, coursesData, ordersData] = await Promise.all([
          usersResponse.json(),
          coursesResponse.json(),
          ordersResponse.json()
        ]);

        setStats({
          totalUsers: usersData.stats?.totalUsers || 0,
          totalCourses: coursesData.total || 0,
          totalOrders: ordersData.stats?.totalOrders || 0,
          totalRevenue: ordersData.stats?.totalRevenue || 0,
          students: usersData.stats?.students || 0,
          instructors: usersData.stats?.instructors || 0,
          admins: usersData.stats?.admins || 0,
          publishedCourses: coursesData.data?.filter((c: any) => c.status === 'published').length || 0,
          draftCourses: coursesData.data?.filter((c: any) => c.status === 'draft').length || 0,
          completedOrders: ordersData.stats?.completedOrders || 0,
          pendingOrders: ordersData.stats?.pendingOrders || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Courses",
      value: stats.totalCourses.toString(),
      change: "+8%",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+23%",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+15%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View, edit, and manage user accounts",
      icon: Users,
      href: "/dashboard/admin/users",
      color: "bg-blue-500"
    },
    {
      title: "Manage Courses",
      description: "Review and manage all courses",
      icon: BookOpen,
      href: "/dashboard/admin/courses",
      color: "bg-green-500"
    },
    {
      title: "View Orders",
      description: "Monitor transactions and orders",
      icon: DollarSign,
      href: "/dashboard/admin/orders",
      color: "bg-orange-500"
    },
    {
      title: "Analytics",
      description: "Detailed platform analytics",
      icon: BarChart3,
      href: "/dashboard/admin/analytics",
      color: "bg-purple-500"
    }
  ];

  const recentActivity = [
    {
      type: "user",
      message: "New student registered",
      time: "2 minutes ago",
      icon: UserPlus,
      color: "text-blue-600"
    },
    {
      type: "course",
      message: "New course published",
      time: "15 minutes ago",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      type: "order",
      message: "New order completed",
      time: "1 hour ago",
      icon: DollarSign,
      color: "text-orange-600"
    },
    {
      type: "system",
      message: "System backup completed",
      time: "2 hours ago",
      icon: Shield,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Dashboard</h1>
              <p className="text-xl opacity-90">Manage your platform, monitor performance, and oversee all operations</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() => router.push("/dashboard/admin/settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
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
                    <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <Button variant="outline" onClick={fetchDashboardData}>
              <Activity className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Students</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(stats.students / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{stats.students}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Instructors</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(stats.instructors / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{stats.instructors}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Admins</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(stats.admins / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{stats.admins}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Published</span>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">{stats.publishedCourses}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Draft</span>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gray-100 text-gray-800">{stats.draftCourses}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total</span>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800">{stats.totalCourses}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
} 