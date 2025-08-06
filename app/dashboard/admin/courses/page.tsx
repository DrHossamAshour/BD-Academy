"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Search,
  Filter,
  MoreHorizontal,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Award,
  AlertCircle,
  Play,
  FileText,
  Video,
  Image
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock course data
const coursesData = {
  totalCourses: 156,
  publishedCourses: 142,
  pendingReview: 23,
  draftCourses: 14,
  totalRevenue: 124750,
  averageRating: 4.7,
  courses: [
    {
      id: 1,
      title: "Advanced Dental Implantology",
      instructor: "Dr. Michael Chen",
      status: "published",
      category: "Implantology",
      price: 299,
      enrollments: 342,
      rating: 4.8,
      reviews: 156,
      createdAt: "2024-01-15",
      lastUpdated: "2024-03-15",
      lessons: 24,
      duration: "12 hours",
      revenue: 102258,
      thumbnail: "MC",
      description: "Comprehensive course on advanced implant techniques and procedures"
    },
    {
      id: 2,
      title: "Modern Orthodontic Techniques",
      instructor: "Dr. Sarah Johnson",
      status: "pending",
      category: "Orthodontics",
      price: 199,
      enrollments: 0,
      rating: 0,
      reviews: 0,
      createdAt: "2024-03-18",
      lastUpdated: "2024-03-18",
      lessons: 18,
      duration: "8 hours",
      revenue: 0,
      thumbnail: "SJ",
      description: "Latest orthodontic methods and treatment planning"
    },
    {
      id: 3,
      title: "Cosmetic Dentistry Masterclass",
      instructor: "Dr. Emily Rodriguez",
      status: "published",
      category: "Cosmetic Dentistry",
      price: 249,
      enrollments: 287,
      rating: 4.6,
      reviews: 98,
      createdAt: "2024-02-10",
      lastUpdated: "2024-03-10",
      lessons: 20,
      duration: "10 hours",
      revenue: 71463,
      thumbnail: "ER",
      description: "Master the art of cosmetic dental procedures"
    },
    {
      id: 4,
      title: "Endodontic Excellence",
      instructor: "Dr. James Wilson",
      status: "draft",
      category: "Endodontics",
      price: 179,
      enrollments: 0,
      rating: 0,
      reviews: 0,
      createdAt: "2024-03-20",
      lastUpdated: "2024-03-20",
      lessons: 16,
      duration: "6 hours",
      revenue: 0,
      thumbnail: "JW",
      description: "Advanced endodontic techniques and case studies"
    },
    {
      id: 5,
      title: "Periodontal Surgery Fundamentals",
      instructor: "Dr. Lisa Thompson",
      status: "published",
      category: "Periodontics",
      price: 229,
      enrollments: 198,
      rating: 4.7,
      reviews: 87,
      createdAt: "2024-01-25",
      lastUpdated: "2024-03-05",
      lessons: 22,
      duration: "11 hours",
      revenue: 45342,
      thumbnail: "LT",
      description: "Essential periodontal surgical procedures and techniques"
    },
    {
      id: 6,
      title: "Pediatric Dentistry Essentials",
      instructor: "Dr. Robert Davis",
      status: "pending",
      category: "Pediatric Dentistry",
      price: 159,
      enrollments: 0,
      rating: 0,
      reviews: 0,
      createdAt: "2024-03-19",
      lastUpdated: "2024-03-19",
      lessons: 14,
      duration: "7 hours",
      revenue: 0,
      thumbnail: "RD",
      description: "Comprehensive guide to pediatric dental care"
    }
  ],
  categories: [
    { name: "Implantology", count: 23, revenue: 45678 },
    { name: "Orthodontics", count: 18, revenue: 23456 },
    { name: "Cosmetic Dentistry", count: 15, revenue: 34567 },
    { name: "Endodontics", count: 12, revenue: 12345 },
    { name: "Periodontics", count: 10, revenue: 23456 },
    { name: "Pediatric Dentistry", count: 8, revenue: 9876 }
  ]
};

export default function AdminCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

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

  const filteredCourses = coursesData.courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800"
    ];
    const colorIndex = coursesData.categories.findIndex(cat => cat.name === category) % colors.length;
    return <Badge className={colors[colorIndex]}>{category}</Badge>;
  };

  const handleApproveCourse = (courseId: number) => {
    // Simulate course approval
    alert(`Course ${courseId} approved successfully!`);
  };

  const handleRejectCourse = (courseId: number) => {
    // Simulate course rejection
    alert(`Course ${courseId} rejected.`);
  };

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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Management</h1>
              <p className="text-gray-600">Review, approve, and manage all platform courses</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Review All
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coursesData.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8</span> new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coursesData.publishedCourses}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coursesData.pendingReview}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-600">Requires attention</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${coursesData.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+23%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Category Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursesData.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.count} courses</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${category.revenue.toLocaleString()}</div>
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
                <TrendingUp className="w-5 h-5" />
                <span>Course Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{coursesData.averageRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Enrollments</span>
                  <span className="font-medium">8,923</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Instructors</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-medium">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search courses by title, instructor, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending Review</option>
                  <option value="draft">Draft</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                >
                  <option value="all">All Categories</option>
                  {coursesData.categories.map((category, index) => (
                    <option key={index} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Courses ({filteredCourses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#d8bf78] rounded-lg flex items-center justify-center text-white font-semibold">
                          {course.thumbnail}
                        </div>
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.lessons} lessons • {course.duration}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{course.instructor}</div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(course.category)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(course.status)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${course.price}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{course.enrollments}</div>
                        <div className="text-gray-500">students</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{course.rating}</span>
                        <span className="text-xs text-gray-500">({course.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${course.revenue.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {course.status === "pending" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApproveCourse(course.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRejectCourse(course.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 