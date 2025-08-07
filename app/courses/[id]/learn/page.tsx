"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Lock,
  CheckCircle,
  Circle,
  ChevronRight,
  Home,
  Settings,
  ArrowRight,
  Clock,
  Users,
  Award,
  Star
} from "lucide-react";
import Image from "next/image";

export default function CourseLearnPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState<any>(null);
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
            setCurrentSection(firstSection);
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

  const handleLessonClick = (lesson: any, section: any) => {
    if (lesson.isPublic || session?.user) {
      setCurrentLesson(lesson);
      setCurrentSection(section);
    } else {
      alert('Please enroll in this course to access this lesson.');
    }
  };

  const canAccessLesson = (lesson: any) => {
    return lesson.isPublic || session?.user;
  };

  const getLessonIcon = (lesson: any, lessonIndex: number) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const isCurrent = currentLesson?.id === lesson.id;
    
    if (isCurrent) {
      return <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
        <Play className="w-2 h-2 text-white" />
      </div>;
    } else if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (canAccessLesson(lesson)) {
      return <div className="w-4 h-4 border-2 border-red-500 rounded-full"></div>;
    } else {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLessonStatus = (lesson: any) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const isCurrent = currentLesson?.id === lesson.id;
    
    if (isCurrent) {
      return "bg-red-500 text-white";
    } else if (isCompleted) {
      return "bg-green-100 text-green-800";
    } else if (canAccessLesson(lesson)) {
      return "bg-gray-800 text-white hover:bg-gray-700";
    } else {
      return "bg-gray-700 text-gray-400";
    }
  };

  const markLessonComplete = () => {
    if (currentLesson) {
      setCompletedLessons(prev => [...prev, currentLesson.id]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <p className="text-gray-400">The course you&apos;re looking for doesn&apos;t exist.</p>
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

        {/* Red Separator */}
        <div className="h-1 bg-red-500"></div>

        {/* Course Title */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-white font-semibold text-sm">
            {currentLesson?.title || course.title}
          </h1>
        </div>

        {/* Course Content Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {course.sections?.map((section: any, sectionIndex: number) => (
              <div key={section.id} className="mb-6">
                <h3 className="font-semibold text-white mb-3 text-sm">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.lessons?.map((lesson: any, lessonIndex: number) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${getLessonStatus(lesson)}`}
                      onClick={() => handleLessonClick(lesson, section)}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex-shrink-0">
                          {getLessonIcon(lesson, lessonIndex)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {lesson.title}
                          </h4>
                          {lesson.duration && (
                            <div className="flex items-center mt-1">
                              <Play className="w-3 h-3 mr-1 opacity-75" />
                              <span className="text-xs opacity-75">
                                {lesson.duration}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
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
        {/* Top Red Header Bar */}
        <div className="bg-red-500 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">BigDentist</span>
          </div>
          <Button 
            className="bg-white text-red-500 hover:bg-gray-100 text-sm"
            onClick={markLessonComplete}
          >
            <span>Complete & Continue</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Video Player and Lesson Content */}
        <div className="flex-1 p-6">
          {currentLesson ? (
            <div className="space-y-6">
              {/* Video Player - Full Width */}
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  {currentLesson.vimeoUrl || currentLesson.videoUrl ? (
                    <iframe
                      src={currentLesson.vimeoUrl || currentLesson.videoUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Video not available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Red Bar */}
              <div className="bg-red-500 text-white px-6 py-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">BigDentist</span>
                  <Button 
                    className="bg-white text-red-500 hover:bg-gray-100 text-sm"
                    onClick={markLessonComplete}
                  >
                    <span>Complete & Continue</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Lesson Content */}
              {currentLesson.content && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Lesson Content</h3>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed">
                        {currentLesson.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select a lesson to start learning</h3>
                <p className="text-gray-400">Choose a lesson from the sidebar to begin your course.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 