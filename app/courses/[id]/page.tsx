"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Clock,
  Users,
  Award,
  Play,
  Download,
  Globe,
  ChevronRight,
  Check,
  MessageSquare,
  ThumbsUp,
  Lock,
  Eye,
  Home,
  Settings,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/public/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data.data);
          
          // Set first lesson as current if available
          if (data.data.sections && data.data.sections.length > 0) {
            const firstSection = data.data.sections[0];
            if (firstSection.lessons && firstSection.lessons.length > 0) {
              setCurrentLesson(firstSection.lessons[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const handleLessonClick = (lesson: any) => {
    if (canAccessLesson(lesson)) {
      setCurrentLesson(lesson);
    } else {
      alert('Please login to access this lesson.');
    }
  };

  const canAccessLesson = (lesson: any) => {
    return lesson.isPublic || session?.user;
  };

  const markLessonComplete = () => {
    if (currentLesson && session?.user) {
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      // Find next lesson
      let nextLesson = null;
      let foundCurrent = false;
      
      for (const section of course.sections) {
        for (const lesson of section.lessons) {
          if (foundCurrent && canAccessLesson(lesson)) {
            nextLesson = lesson;
            break;
          }
          if (lesson.id === currentLesson.id) {
            foundCurrent = true;
          }
        }
        if (nextLesson) break;
      }
      
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      }
    }
  };

  const getLessonIcon = (lesson: any) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const isCurrent = currentLesson?.id === lesson.id;
    
    if (isCurrent) {
      return <div className="w-4 h-4 bg-[#d8bf78] rounded-full flex items-center justify-center">
        <Play className="w-2 h-2 text-white" />
      </div>;
    } else if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (canAccessLesson(lesson)) {
      return <div className="w-4 h-4 border-2 border-[#d8bf78] rounded-full"></div>;
    } else {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course not found</h1>
          <p className="text-gray-400 mb-8">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button asChild className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
            <Link href="/courses">Browse All Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Sidebar - Dark Theme (Matching Reference) */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Top Navigation Icons */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Golden Separator */}
        <div className="h-1 bg-[#d8bf78]"></div>
        
        {/* Course Title */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-white font-semibold text-sm">{currentLesson?.title || course.title}</h1>
        </div>
        
        {/* Course Content Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {course.sections?.map((section: any, sectionIndex: number) => (
              <div key={sectionIndex} className="mb-6">
                <h3 className="text-white font-medium mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.lessons?.map((lesson: any, lessonIndex: number) => (
                    <div
                      key={lessonIndex}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        currentLesson?.id === lesson.id 
                          ? 'bg-[#d8bf78] text-white' 
                          : canAccessLesson(lesson)
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex items-center space-x-3">
                        {getLessonIcon(lesson)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{lesson.title}</p>
                          <p className="text-xs opacity-70">{lesson.duration}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Top Golden Header Bar */}
        <div className="bg-[#d8bf78] text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">BigDentist</span>
          </div>
          <Button 
            className="bg-white text-[#d8bf78] hover:bg-gray-100 text-sm" 
            onClick={markLessonComplete}
          >
            <span>Complete & Continue</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Video Player - Full Width */}
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="aspect-video relative">
            {currentLesson?.vimeoUrl || currentLesson?.videoUrl ? (
              <iframe
                src={currentLesson.vimeoUrl || currentLesson.videoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No video available for this lesson</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Golden Bar */}
        <div className="bg-[#d8bf78] text-white px-6 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">BigDentist</span>
            <Button 
              className="bg-white text-[#d8bf78] hover:bg-gray-100 text-sm" 
              onClick={markLessonComplete}
            >
              <span>Complete & Continue</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Lesson Content */}
        {currentLesson?.content && (
          <Card className="bg-gray-800 border-gray-700 mt-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Lesson Content</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{currentLesson.content}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
