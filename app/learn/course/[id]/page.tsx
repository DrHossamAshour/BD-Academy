"use client";

import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Download,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  FullscreenIcon,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";

interface LearningCourse {
  id: number;
  title: string;
  instructor: string;
  totalLessons: number;
  currentLesson: number;
  progress: number;
  lessons: {
    id: number;
    title: string;
    duration: string;
    type: string;
    completed: boolean;
    current?: boolean;
  }[];
}

const courseData: { [key: string]: LearningCourse } = {
  "1": {
    id: 1,
    title: "Performance Marketing Mastery",
    instructor: "Ahmed Hassan",
    totalLessons: 45,
    currentLesson: 12,
    progress: 65,
    lessons: [
      {
        id: 1,
        title: "Introduction to Performance Marketing",
        duration: "5:30",
        type: "video",
        completed: true
      },
      {
        id: 2,
        title: "Setting Up Your Marketing Stack",
        duration: "8:15",
        type: "video",
        completed: true
      },
      {
        id: 3,
        title: "Key Metrics and KPIs",
        duration: "6:45",
        type: "video",
        completed: false,
        current: true
      },
      {
        id: 4,
        title: "Attribution Models Explained",
        duration: "12:30",
        type: "video",
        completed: false
      },
      {
        id: 5,
        title: "Performance Marketing Checklist",
        duration: "2:00",
        type: "resource",
        completed: false
      }
    ]
  },
  "2": {
    id: 2,
    title: "Visual Content Creation",
    instructor: "Sarah Johnson",
    totalLessons: 25,
    currentLesson: 8,
    progress: 30,
    lessons: [
      {
        id: 1,
        title: "Color Theory Basics",
        duration: "6:30",
        type: "video",
        completed: true
      },
      {
        id: 2,
        title: "Typography Principles",
        duration: "8:15",
        type: "video",
        completed: false,
        current: true
      }
    ]
  }
};

export default function CourseLearnPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(145); // 2:25
  const [duration] = useState(405); // 6:45

  const course = courseData[params.id];
  const currentLesson = course?.lessons.find((lesson: any) => lesson.current) || course?.lessons[0];

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-400 mb-8">The course you're looking for doesn't exist.</p>
          <Button className="bg-[#d8bf78] hover:bg-[#c4a86a]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <div className="flex">
        {/* Main Video Area */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            {/* Placeholder video area */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#d8bf78] rounded-full flex items-center justify-center mx-auto mb-4">
                  {isPlaying ? (
                    <Pause className="w-10 h-10" />
                  ) : (
                    <Play className="w-10 h-10 ml-1" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
                <p className="text-gray-400">Duration: {currentLesson.duration}</p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-600 rounded-full h-1 cursor-pointer">
                  <div
                    className="bg-[#d8bf78] h-1 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                  <span className="text-sm">1x</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <FullscreenIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="p-6 bg-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                <p className="text-gray-400">
                  Course: {course.title} • Instructor: {course.instructor}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Resources
                </Button>
                <Button variant="outline" size="sm">
                  Mark Complete
                </Button>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Course Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#d8bf78] h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline">
                ← Previous Lesson
              </Button>
              <Button className="bg-[#d8bf78] hover:bg-[#c4a86a]">
                <Play className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Lesson List */}
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold mb-2">Course Content</h2>
            <p className="text-sm text-gray-400">
              {course.lessons.filter((l: any) => l.completed).length} of {course.totalLessons} lessons completed
            </p>
          </div>

          <div className="overflow-y-auto h-screen">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                  lesson.current ? 'bg-gray-700 border-l-4 border-red-600' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : lesson.type === 'video' ? (
                      <Play className="w-5 h-5 text-gray-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">
                        Lesson {index + 1}
                      </span>
                      {lesson.type === 'video' && (
                        <Badge variant="secondary" className="text-xs">
                          Video
                        </Badge>
                      )}
                      {lesson.type === 'resource' && (
                        <Badge variant="secondary" className="text-xs bg-blue-600">
                          Resource
                        </Badge>
                      )}
                    </div>

                    <h4 className={`text-sm font-medium mb-1 ${
                      lesson.current ? 'text-white' : 'text-gray-300'
                    }`}>
                      {lesson.title}
                    </h4>

                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Show more lessons placeholder */}
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 mb-2">
                +{course.totalLessons - course.lessons.length} more lessons
              </p>
              <Button variant="outline" size="sm">
                Load More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
