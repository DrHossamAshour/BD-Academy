"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  Play,
  Users,
  Star,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Video,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock course data
const coursesData = {
  totalCourses: 8,
  publishedCourses: 6,
  draftCourses: 2,
  totalStudents: 156,
  totalRevenue: 2450,
  averageRating: 4.8,
  courses: [
    {
      id: 1,
      title: "Advanced Dental Implantology",
      description: "Comprehensive course on advanced implant techniques and procedures",
      image: "https://ext.same-assets.com/1352620099/2409258185.webp",
      status: "published",
      price: 299,
      students: 89,
      rating: 4.9,
      reviews: 45,
      lessons: 24,
      duration: "12 hours",
      revenue: 1200,
      createdAt: "2024-01-15",
      lastUpdated: "2024-03-15",
      category: "Implantology",
      featured: true
    },
    {
      id: 2,
      title: "Modern Orthodontic Techniques",
      description: "Latest orthodontic methods and treatment planning",
      image: "https://ext.same-assets.com/1352620099/3921090386.webp",
      status: "published",
      price: 199,
      students: 67,
      rating: 4.7,
      reviews: 32,
      lessons: 18,
      duration: "8 hours",
      revenue: 890,
      createdAt: "2024-02-10",
      lastUpdated: "2024-03-10",
      category: "Orthodontics",
      featured: false
    },
    {
      id: 3,
      title: "Cosmetic Dentistry Masterclass",
      description: "Master the art of cosmetic dental procedures",
      image: "https://ext.same-assets.com/1352620099/2409258185.webp",
      status: "draft",
      price: 249,
      students: 0,
      rating: 0,
      reviews: 0,
      lessons: 20,
      duration: "10 hours",
      revenue: 0,
      createdAt: "2024-03-18",
      lastUpdated: "2024-03-18",
      category: "Cosmetic Dentistry",
      featured: false
    },
    {
      id: 4,
      title: "Endodontic Excellence",
      description: "Advanced endodontic techniques and case studies",
      image: "https://ext.same-assets.com/1352620099/3921090386.webp",
      status: "draft",
      price: 179,
      students: 0,
      rating: 0,
      reviews: 0,
      lessons: 16,
      duration: "6 hours",
      revenue: 0,
      createdAt: "2024-03-20",
      lastUpdated: "2024-03-20",
      category: "Endodontics",
      featured: false
    }
  ]
};

export default function InstructorCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching courses for instructor:', session?.user?.id);
      
      // Temporarily use debug endpoint to see all courses
      const response = await fetch('/api/courses/debug');
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.data && Array.isArray(data.data)) {
          setCourses(data.data);
          
          // Calculate stats
          const total = data.data.length;
          const published = data.data.filter((course: any) => course.isPublished).length;
          const draft = total - published;
          const students = data.data.reduce((sum: number, course: any) => sum + (course.students || 0), 0);
          
          setStats({
            totalCourses: total,
            publishedCourses: published,
            draftCourses: draft,
            totalStudents: students,
            totalRevenue: 0, // We'll calculate this when we have enrollment data
            averageRating: 0 // We'll calculate this when we have rating data
          });
        } else {
          console.error('Invalid data structure received:', data);
          setCourses([]);
        }
      } else {
        console.error('Failed to fetch courses:', response.status);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      alert('Error fetching courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

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

    // Fetch courses from API
    fetchCourses();
  }, [session, status, router, fetchCourses]);

  // Check for refresh parameter
  useEffect(() => {
    const refresh = searchParams.get('refresh');
    if (refresh === 'true') {
      fetchCourses();
      // Clean up the URL
      router.replace('/dashboard/instructor/courses');
    }
  }, [searchParams, router, fetchCourses]);

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingCourse(courseId);
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove course from local state
        setCourses(prev => prev.filter(course => course._id?.toString() !== courseId));
        alert('Course deleted successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(`Error deleting course: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setDeletingCourse(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "instructor") {
    return null;
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
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
      "bg-pink-100 text-pink-800"
    ];
    const colorIndex = category.length % colors.length;
    return <Badge className={colors[colorIndex]}>{category}</Badge>;
  };

  const statsData = [
    {
      title: "Total Courses",
      value: stats.totalCourses.toString(),
      change: "+2",
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      title: "Published",
      value: stats.publishedCourses.toString(),
      change: "+1",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      change: "+8%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+15%",
      icon: DollarSign,
      color: "text-orange-600"
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
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/dashboard/instructor">
                  <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">My Courses</h1>
              <p className="text-xl opacity-90">Manage your courses, track performance, and grow your audience</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                className="bg-white text-[#c4a86a] hover:bg-gray-100"
                onClick={() => router.push("/dashboard/instructor/courses/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
              <Button 
                variant="outline"
                className="text-[#d8bf78] border-[#d8bf78] hover:bg-[#d8bf78] hover:text-white"
                onClick={() => {
                  console.log('Manual refresh triggered');
                  fetchCourses();
                }}
              >
                🔄 Debug Refresh
              </Button>
              <Button 
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/courses/debug');
                    const data = await response.json();
                    console.log('Database Debug Info:', data);
                    alert(`Database contains ${data.total} courses. Check console for details.`);
                  } catch (error) {
                    console.error('Debug error:', error);
                    alert('Debug failed. Check console for error.');
                  }
                }}
              >
                🔍 Database Debug
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

      {/* Filters and Search */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search courses by title, description, or category..."
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
                    <option value="draft">Draft</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to a default image if the original fails
                        const target = e.target as HTMLImageElement;
                        target.src = "https://ext.same-assets.com/1352620099/2409258185.webp";
                      }}
                      unoptimized={course.image.startsWith('/uploads/')} // Don't optimize uploaded images
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(course.status)}
                    </div>
                    {course.featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-[#d8bf78] text-white">Featured</Badge>
                      </div>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {getCategoryBadge(course.category)}
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{course.students}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">${course.revenue}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({course.reviews} reviews)</span>
                    </div>
                    <div className="text-lg font-bold text-[#d8bf78]">${course.price}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/instructor/courses/${course._id}/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/instructor/courses/${course._id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => deleteCourse(course._id?.toString() || '')}
                      disabled={deletingCourse === course._id?.toString()}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingCourse === course._id?.toString() ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria."
                    : "You haven't created any courses yet. Start building your first course!"
                  }
                </p>
                <Button 
                  className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                  onClick={() => router.push("/dashboard/instructor/courses/new")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Debug Section - Temporary */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">🔧 Debug Information (Temporary)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p><strong>Current User ID:</strong> {session?.user?.id}</p>
                  <p><strong>Current User Role:</strong> {session?.user?.role}</p>
                  <p><strong>Total Courses in State:</strong> {courses.length}</p>
                </div>
                <div>
                  <p><strong>All Courses in Database:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(courses.map(c => ({ id: c.id, title: c.title, instructorId: c.instructorId })), null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
} 