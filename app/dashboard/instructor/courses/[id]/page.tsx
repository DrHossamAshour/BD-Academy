"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Edit,
  ArrowLeft,
  Eye,
  Clock,
  DollarSign,
  Users,
  Star,
  Play,
  Lock,
  Globe,
  FileText,
  Video,
  CheckCircle,
  AlertCircle,
  Calendar,
  Award,
  MessageCircle,
  Settings,
  Plus,
  Trash2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CourseSection {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: string;
  content?: string;
  vimeoUrl?: string;
  videoUrl?: string;
  isProtected?: boolean;
  isPublic?: boolean;
}

export default function ViewCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const loadCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}`);
      
      if (!response.ok) {
        throw new Error('Course not found');
      }

      const data = await response.json();
      setCourse(data.data);
    } catch (error) {
      console.error('Error loading course:', error);
      alert('Error loading course data. Please try again.');
      router.push('/dashboard/instructor/courses');
    } finally {
      setLoading(false);
    }
  }, [courseId, router]);

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

    loadCourseData();
  }, [session, status, router, courseId, loadCourseData]);

  const handleLessonClick = (lesson: any) => {
    console.log('Lesson clicked:', lesson);
    
    if (lesson.videoUrl || lesson.vimeoUrl) {
      setSelectedLesson(lesson);
    } else {
      alert('This lesson does not have a video available.');
    }
  };

  const getLessonIcon = (lesson: any) => {
    if (lesson.videoUrl || lesson.vimeoUrl) {
      return <Play className="w-4 h-4 text-[#d8bf78] mr-3" />;
    } else {
      return <FileText className="w-4 h-4 text-gray-400 mr-3" />;
    }
  };

  const getLessonStatusIcon = (lesson: any) => {
    if (lesson.isPublic) {
      return (
        <div className="flex items-center text-green-600">
          <Globe className="w-3 h-3 mr-1" />
          <span className="text-xs">Public</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <Lock className="w-3 h-3 mr-1" />
          <span className="text-xs">Private</span>
        </div>
      );
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Course not found</h3>
          <p className="text-gray-600 mb-4">The course you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/dashboard/instructor/courses')}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

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

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      case 'assignment':
        return <Award className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-blue-600 bg-blue-50';
      case 'text':
        return 'text-green-600 bg-green-50';
      case 'quiz':
        return 'text-purple-600 bg-purple-50';
      case 'assignment':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/dashboard/instructor/courses">
                  <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Courses
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl opacity-90">{course.subtitle || course.description}</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() => router.push(`/dashboard/instructor/courses/${course._id}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Course
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Image */}
      {course.image && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  unoptimized={course.image.startsWith('/uploads/')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://ext.same-assets.com/1352620099/2409258185.webp";
                  }}
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(course.status)}
                </div>
                {course.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#d8bf78] text-white">Featured</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Navigation Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
                { id: 'analytics', label: 'Analytics', icon: Users },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#d8bf78] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Course Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Students</p>
                          <p className="text-2xl font-bold text-gray-900">{course.students}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                          <Users className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Rating</p>
                          <p className="text-2xl font-bold text-gray-900">{course.rating}</p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                          <Star className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">${course.revenue}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                          <DollarSign className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Duration</p>
                          <p className="text-2xl font-bold text-gray-900">{course.duration}</p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                          <Clock className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Course Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Category</p>
                        <p className="text-gray-900">{course.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Level</p>
                        <p className="text-gray-900">{course.level}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Language</p>
                        <p className="text-gray-900">{course.language}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Price</p>
                        <p className="text-gray-900">${course.price}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Description</p>
                      <p className="text-gray-900 mt-1">{course.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* What Students Will Learn */}
                {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>What Students Will Learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.whatYouLearn.map((item: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.requirements.map((item: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                  <Button 
                    onClick={() => router.push(`/dashboard/instructor/courses/${course._id}/edit`)}
                    className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Curriculum
                  </Button>
                </div>

                {course.sections && course.sections.length > 0 ? (
                  <div className="space-y-4">
                    {course.sections.map((section: CourseSection, sectionIndex: number) => (
                      <Card key={section.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Section {sectionIndex + 1}: {section.title}</span>
                            <Badge variant="outline">{section.lessons.length} lessons</Badge>
                          </CardTitle>
                          {section.description && (
                            <p className="text-gray-600">{section.description}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {section.lessons.map((lesson: CourseLesson, lessonIndex: number) => (
                              <div 
                                key={lesson.id} 
                                className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                  (lesson.videoUrl || lesson.vimeoUrl) ? 'hover:border-[#d8bf78]' : ''
                                }`}
                                onClick={() => handleLessonClick(lesson)}
                              >
                                <div className="flex items-center space-x-3">
                                  {getLessonIcon(lesson)}
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      Lesson {lessonIndex + 1}: {lesson.title}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {lesson.duration} min
                                      </span>
                                      {getLessonStatusIcon(lesson)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={getLessonTypeColor(lesson.type)}>
                                    {lesson.type}
                                  </Badge>
                                  {(lesson.videoUrl || lesson.vimeoUrl) && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                      <Play className="w-3 h-3 mr-1" />
                                      Play
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No curriculum yet</h3>
                      <p className="text-gray-600 mb-4">Start building your course curriculum by adding sections and lessons.</p>
                      <Button 
                        onClick={() => router.push(`/dashboard/instructor/courses/${course._id}/edit`)}
                        className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Curriculum
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Analytics</h2>
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-600">Detailed analytics and insights will be available here.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Settings</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Course Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <div className="mt-1">{getStatusBadge(course.status)}</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Featured</p>
                        <div className="mt-1">
                          {course.isFeatured ? (
                            <Badge className="bg-green-100 text-green-800">Yes</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">No</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Certificates</p>
                        <div className="mt-1">
                          {course.enableCertificate ? (
                            <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Discussions</p>
                        <div className="mt-1">
                          {course.enableDiscussion ? (
                            <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button 
                        onClick={() => router.push(`/dashboard/instructor/courses/${course._id}/edit`)}
                        className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">{selectedLesson.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLesson(null)}
              >
                ✕
              </Button>
            </div>
            <div className="aspect-video">
              <iframe
                src={selectedLesson.videoUrl || selectedLesson.vimeoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
} 