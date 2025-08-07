"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/ImageUpload";
import {
  BookOpen,
  Upload,
  Plus,
  Trash2,
  Save,
  Eye,
  Clock,
  DollarSign,
  Users,
  Target,
  FileText,
  Video,
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lock,
  Shield,
  Play,
  Link as LinkIcon,
  ExternalLink,
  Info,
  Settings,
  Globe
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  vimeoId?: string;
  isProtected?: boolean;
  isPublic?: boolean; // Added for lesson privacy
}

export default function EditCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "Dental",
    level: "Beginner",
    language: "English",
    price: "",
    originalPrice: "",
    duration: "",
    lessons: 0,
    image: "",
    video: "",
    requirements: [""],
    whatYouLearn: [""],
    sections: [] as CourseSection[],
    isPublished: false,
    isAvailable: false,
    isFeatured: false,
    enableCertificate: true,
    enableDiscussion: true,
    tags: [""],
    maxStudents: "",
    accessDuration: "lifetime"
  });

  // Vimeo configuration
  const VIMEO_TOKEN = "be9a99823ebe2f7b7212d33ce3594e74";
  const [vimeoValidation, setVimeoValidation] = useState<{[key: string]: boolean}>({});

  const loadCourseData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${courseId}`);
      
      if (!response.ok) {
        throw new Error('Course not found');
      }

      const data = await response.json();
      const course = data.data;

      // Transform course data to match form structure
      setCourseData({
        title: course.title || "",
        subtitle: course.subtitle || "",
        description: course.description || "",
        category: course.category || "Dental",
        level: course.level || "Beginner",
        language: course.language || "English",
        price: course.price?.toString() || "",
        originalPrice: course.originalPrice?.toString() || "",
        duration: course.duration || "",
        lessons: course.lessons || 0,
        image: course.image || "",
        video: course.video || "",
        requirements: course.requirements || [""],
        whatYouLearn: course.whatYouLearn || [""],
        sections: course.sections || [],
        isPublished: course.isPublished || false,
        isAvailable: course.isAvailable || false,
        isFeatured: course.isFeatured || false,
        enableCertificate: course.enableCertificate !== false,
        enableDiscussion: course.enableDiscussion !== false,
        tags: course.tags || [""],
        maxStudents: course.maxStudents?.toString() || "",
        accessDuration: course.accessDuration || "lifetime"
      });
    } catch (error) {
      console.error('Error loading course:', error);
      alert('Error loading course data. Please try again.');
      router.push('/dashboard/instructor/courses');
    } finally {
      setIsLoading(false);
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

    // Load course data
    loadCourseData();
  }, [session, status, router, courseId, loadCourseData]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "instructor") {
    return null;
  }

  // Validate Vimeo URL and extract video ID
  const validateVimeoUrl = (url: string): { isValid: boolean; videoId?: string; error?: string } => {
    if (!url) return { isValid: false, error: "URL is required" };
    
    const vimeoRegex = /https:\/\/player\.vimeo\.com\/video\/(\d+)\?.*/;
    const match = url.match(vimeoRegex);
    
    if (match) {
      return { isValid: true, videoId: match[1] };
    }
    
    return { isValid: false, error: "Invalid Vimeo player URL format" };
  };

  // Test Vimeo video access and protection
  const testVimeoVideo = async (videoUrl: string, lessonId: string) => {
    try {
      const response = await fetch('/api/vimeo/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoUrl })
      });

      if (response.ok) {
        const data = await response.json();
        const isProtected = data.data.isProtected;
        setVimeoValidation(prev => ({ ...prev, [lessonId]: isProtected }));
        return isProtected;
      } else {
        const errorData = await response.json();
        console.error('Vimeo validation error:', errorData.error);
        setVimeoValidation(prev => ({ ...prev, [lessonId]: false }));
        return false;
      }
    } catch (error) {
      console.error('Error testing Vimeo video:', error);
      setVimeoValidation(prev => ({ ...prev, [lessonId]: false }));
      return false;
    }
  };

  const addRequirement = () => {
    setCourseData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }));
  };

  const removeRequirement = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addLearningOutcome = () => {
    setCourseData(prev => ({
      ...prev,
      whatYouLearn: [...prev.whatYouLearn, ""]
    }));
  };

  const removeLearningOutcome = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      whatYouLearn: prev.whatYouLearn.filter((_, i) => i !== index)
    }));
  };

  const updateLearningOutcome = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      whatYouLearn: prev.whatYouLearn.map((outcome, i) => i === index ? value : outcome)
    }));
  };

  const addSection = () => {
    const newSection: CourseSection = {
      id: Date.now().toString(),
      title: "",
      description: "",
      lessons: []
    };
    setCourseData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (sectionId: string) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const updateSection = (sectionId: string, field: keyof CourseSection, value: string) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const addLesson = (sectionId: string) => {
    const newLesson: CourseLesson = {
      id: Date.now().toString(),
      title: "",
      type: 'video',
      duration: "",
      content: "",
      vimeoUrl: "",
      isProtected: true,
      isPublic: false // Default to private
    };
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, lessons: [...section.lessons, newLesson] }
          : section
      )
    }));
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, lessons: section.lessons.filter(lesson => lesson.id !== lessonId) }
          : section
      )
    }));
  };

  const updateLesson = (sectionId: string, lessonId: string, field: keyof CourseLesson, value: string | boolean) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map(lesson =>
                lesson.id === lessonId
                  ? { ...lesson, [field]: value }
                  : lesson
              )
            }
          : section
      )
    }));

    // If updating Vimeo URL, validate it
    if (field === 'vimeoUrl' && typeof value === 'string') {
      const validation = validateVimeoUrl(value);
      if (validation.isValid && validation.videoId) {
        testVimeoVideo(value, lessonId);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all Vimeo URLs
      const allLessons = courseData.sections.flatMap(section => section.lessons);
      const videoLessons = allLessons.filter(lesson => lesson.type === 'video' && lesson.vimeoUrl);
      
      for (const lesson of videoLessons) {
        if (lesson.vimeoUrl) {
          const validation = validateVimeoUrl(lesson.vimeoUrl);
          if (!validation.isValid) {
            alert(`Invalid Vimeo URL in lesson: ${lesson.title}`);
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Calculate total duration and lessons
      const totalLessons = allLessons.length;
      const totalDuration = allLessons.reduce((acc, lesson) => {
        const duration = parseInt(lesson.duration) || 0;
        return acc + duration;
      }, 0);

      const finalCourseData = {
        ...courseData,
        lessons: totalLessons,
        duration: `${totalDuration} minutes`,
        lastUpdated: new Date().toISOString(),
        status: courseData.isPublished ? 'published' : 'draft'
      };

      // Update course via API
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalCourseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update course');
      }

      const result = await response.json();
      
      alert('Course updated successfully!');
      router.push('/dashboard/instructor/courses?refresh=true');
    } catch (error) {
      console.error('Error updating course:', error);
      alert(`Error updating course: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "upcoming";
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
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Edit Course</h1>
              <p className="text-xl opacity-90">Update your course content and settings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    getStepStatus(step) === "completed" 
                      ? "bg-[#d8bf78] border-[#d8bf78] text-white"
                      : getStepStatus(step) === "current"
                      ? "border-[#d8bf78] text-[#d8bf78]"
                      : "border-gray-300 text-gray-400"
                  }`}>
                    {getStepStatus(step) === "completed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{step}</span>
                    )}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      getStepStatus(step) === "completed" ? "bg-[#d8bf78]" : "bg-gray-300"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Course Content"}
              {currentStep === 3 && "Curriculum"}
              {currentStep === 4 && "Pricing & Settings"}
            </h2>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Course Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="title">Course Title *</Label>
                        <Input
                          id="title"
                          value={courseData.title}
                          onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter course title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                          id="subtitle"
                          value={courseData.subtitle}
                          onChange={(e) => setCourseData(prev => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="Brief course description"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Course Description *</Label>
                      <Textarea
                        id="description"
                        value={courseData.description}
                        onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed description of your course"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          value={courseData.category}
                          onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                        >
                          <option value="Dental">Dental</option>
                          <option value="Implantology">Implantology</option>
                          <option value="Orthodontics">Orthodontics</option>
                          <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                          <option value="Endodontics">Endodontics</option>
                          <option value="Periodontics">Periodontics</option>
                          <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <select
                          id="level"
                          value={courseData.level}
                          onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <select
                          id="language"
                          value={courseData.language}
                          onChange={(e) => setCourseData(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                        >
                          <option value="English">English</option>
                          <option value="Arabic">Arabic</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="image">Course Image</Label>
                        <ImageUpload
                          onImageUpload={(url) => setCourseData(prev => ({ ...prev, image: url }))}
                          currentImage={courseData.image}
                          aspectRatio="16/9"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="video">Preview Video URL</Label>
                        <Input
                          id="video"
                          value={courseData.video}
                          onChange={(e) => setCourseData(prev => ({ ...prev, video: e.target.value }))}
                          placeholder="https://player.vimeo.com/video/..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      What Students Will Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courseData.whatYouLearn.map((outcome, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={outcome}
                          onChange={(e) => updateLearningOutcome(index, e.target.value)}
                          placeholder="What will students learn from this course?"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeLearningOutcome(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addLearningOutcome}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Learning Outcome
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courseData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={requirement}
                          onChange={(e) => updateRequirement(index, e.target.value)}
                          placeholder="What are the requirements for this course?"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeRequirement(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addRequirement}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Requirement
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Video Content Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">Vimeo Video Integration</h4>
                          <p className="text-blue-700 text-sm mb-3">
                            Use Vimeo player URLs to ensure your videos are protected and only accessible to enrolled students.
                          </p>
                          <div className="text-sm text-blue-600 space-y-1">
                            <p>• Format: https://player.vimeo.com/video/VIDEO_ID?h=HASH&badge=0&autopause=0&player_id=0&app_id=58479</p>
                            <p>• Videos are automatically protected and non-downloadable</p>
                            <p>• Only enrolled students can access the content</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="vimeoToken">Vimeo Access Token</Label>
                        <Input
                          id="vimeoToken"
                          value={VIMEO_TOKEN}
                          readOnly
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Your Vimeo token is configured for secure video access</p>
                      </div>
                      <div>
                        <Label>Video Protection Status</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Active Protection</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">All videos are protected and non-shareable</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 3 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Course Curriculum
                      </CardTitle>
                      <Button type="button" onClick={addSection}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Section
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {courseData.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Section Title</Label>
                              <Input
                                value={section.title}
                                onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                placeholder="Section title"
                              />
                            </div>
                            <div>
                              <Label>Section Description</Label>
                              <Input
                                value={section.description}
                                onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                                placeholder="Brief description"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeSection(section.id)}
                            className="ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                                <div>
                                  <Label>Lesson Title</Label>
                                  <Input
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(section.id, lesson.id, 'title', e.target.value)}
                                    placeholder="Lesson title"
                                  />
                                </div>
                                <div>
                                  <Label>Type</Label>
                                  <select
                                    value={lesson.type}
                                    onChange={(e) => updateLesson(section.id, lesson.id, 'type', e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                                  >
                                    <option value="video">Video</option>
                                    <option value="text">Text</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="assignment">Assignment</option>
                                  </select>
                                </div>
                                <div>
                                  <Label>Duration (minutes)</Label>
                                  <Input
                                    value={lesson.duration}
                                    onChange={(e) => updateLesson(section.id, lesson.id, 'duration', e.target.value)}
                                    placeholder="30"
                                    type="number"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeLesson(section.id, lesson.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Lesson Privacy Setting */}
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                                <div className="flex items-center space-x-2">
                                  {lesson.isPublic ? (
                                    <Globe className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-gray-600" />
                                  )}
                                  <div>
                                    <Label className="text-sm font-medium">
                                      {lesson.isPublic ? 'Public Lesson' : 'Private Lesson'}
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                      {lesson.isPublic 
                                        ? 'Anyone can view this lesson' 
                                        : 'Only enrolled students can view this lesson'
                                      }
                                    </p>
                                  </div>
                                </div>
                                <Switch
                                  checked={lesson.isPublic || false}
                                  onCheckedChange={(checked) => updateLesson(section.id, lesson.id, 'isPublic', checked)}
                                />
                              </div>

                              {lesson.type === 'video' && (
                                <div className="space-y-3">
                                  <div>
                                    <Label>Vimeo Video URL</Label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        value={lesson.vimeoUrl || ''}
                                        onChange={(e) => updateLesson(section.id, lesson.id, 'vimeoUrl', e.target.value)}
                                        placeholder="https://player.vimeo.com/video/1070508363?h=b969c1efa6&badge=0&autopause=0&player_id=0&app_id=58479"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          if (lesson.vimeoUrl) {
                                            const validation = validateVimeoUrl(lesson.vimeoUrl);
                                            if (validation.isValid && validation.videoId) {
                                              testVimeoVideo(lesson.vimeoUrl, lesson.id);
                                            }
                                          }
                                        }}
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    {lesson.vimeoUrl && (
                                      <div className="flex items-center gap-2 mt-2">
                                        {vimeoValidation[lesson.id] ? (
                                          <>
                                            <Lock className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-green-600">Protected Video</span>
                                          </>
                                        ) : (
                                          <>
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                            <span className="text-sm text-red-600">Video not protected</span>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {lesson.type === 'text' && (
                                <div>
                                  <Label>Content</Label>
                                  <Textarea
                                    value={lesson.content || ''}
                                    onChange={(e) => updateLesson(section.id, lesson.id, 'content', e.target.value)}
                                    placeholder="Lesson content..."
                                    rows={3}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addLesson(section.id)}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lesson
                          </Button>
                        </div>
                      </div>
                    ))}

                    {courseData.sections.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No sections yet</h3>
                        <p className="text-gray-600 mb-4">Start building your course curriculum by adding sections and lessons.</p>
                        <Button type="button" onClick={addSection}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Section
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 4 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Pricing & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="price">Price ($) *</Label>
                        <Input
                          id="price"
                          value={courseData.price}
                          onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="99.99"
                          type="number"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Original Price ($)</Label>
                        <Input
                          id="originalPrice"
                          value={courseData.originalPrice}
                          onChange={(e) => setCourseData(prev => ({ ...prev, originalPrice: e.target.value }))}
                          placeholder="199.99"
                          type="number"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="maxStudents">Maximum Students</Label>
                        <Input
                          id="maxStudents"
                          value={courseData.maxStudents}
                          onChange={(e) => setCourseData(prev => ({ ...prev, maxStudents: e.target.value }))}
                          placeholder="Unlimited"
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accessDuration">Access Duration</Label>
                        <select
                          id="accessDuration"
                          value={courseData.accessDuration}
                          onChange={(e) => setCourseData(prev => ({ ...prev, accessDuration: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                        >
                          <option value="lifetime">Lifetime Access</option>
                          <option value="30days">30 Days</option>
                          <option value="90days">90 Days</option>
                          <option value="1year">1 Year</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Course Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isPublished">Publish Course</Label>
                        <p className="text-sm text-gray-500">Make course available to students</p>
                      </div>
                      <Switch
                        id="isPublished"
                        checked={courseData.isPublished}
                        onCheckedChange={(checked) => setCourseData(prev => ({ ...prev, isPublished: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isFeatured">Featured Course</Label>
                        <p className="text-sm text-gray-500">Highlight on platform homepage</p>
                      </div>
                      <Switch
                        id="isFeatured"
                        checked={courseData.isFeatured}
                        onCheckedChange={(checked) => setCourseData(prev => ({ ...prev, isFeatured: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableCertificate">Enable Certificates</Label>
                        <p className="text-sm text-gray-500">Issue certificates upon completion</p>
                      </div>
                      <Switch
                        id="enableCertificate"
                        checked={courseData.enableCertificate}
                        onCheckedChange={(checked) => setCourseData(prev => ({ ...prev, enableCertificate: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableDiscussion">Enable Discussions</Label>
                        <p className="text-sm text-gray-500">Allow students to discuss course content</p>
                      </div>
                      <Switch
                        id="enableDiscussion"
                        checked={courseData.enableDiscussion}
                        onCheckedChange={(checked) => setCourseData(prev => ({ ...prev, enableDiscussion: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="max-w-4xl mx-auto flex justify-between pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/instructor/courses')}
                >
                  Cancel
                </Button>
                
                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Course...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Course
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
} 