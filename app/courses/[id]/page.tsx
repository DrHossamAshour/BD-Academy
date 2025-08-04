"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  ThumbsUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Mock course data - in real app this would come from API
interface CourseData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
    students: number;
    courses: number;
    rating: number;
  };
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice?: string;
  students: number;
  duration: string;
  lessons: number;
  level: string;
  language: string;
  certificate: boolean;
  lastUpdated: string;
  whatYouLearn: string[];
  curriculum: {
    section: string;
    lessons: number;
    duration: string;
    items: {
      title: string;
      duration: string;
      type: string;
    }[];
  }[];
  reviews: {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

const courseData: { [key: string]: CourseData } = {
  "1": {
    id: 1,
    title: "Performance Marketing Mastery",
    subtitle: "Complete Guide to Digital Marketing ROI",
    description: "Master performance marketing strategies and increase your digital marketing ROI with advanced techniques used by top marketers worldwide.",
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    instructor: {
      name: "Ahmed Hassan",
      title: "Digital Marketing Expert",
      avatar: "https://ext.same-assets.com/1352620099/2098704192.webp",
      bio: "Ahmed is a digital marketing expert with over 10 years of experience helping businesses scale their online presence. He has worked with Fortune 500 companies and startups alike.",
      students: 25430,
      courses: 12,
      rating: 4.9
    },
    rating: 4.8,
    reviewCount: 954,
    price: "$29",
    originalPrice: "$99",
    students: 15420,
    duration: "5 hours",
    lessons: 45,
    level: "Intermediate",
    language: "English",
    certificate: true,
    lastUpdated: "January 2025",
    whatYouLearn: [
      "Master Google Ads and Facebook Ads optimization",
      "Understand advanced analytics and attribution models",
      "Create high-converting landing pages",
      "Implement automated bidding strategies",
      "Build comprehensive marketing funnels",
      "Track and optimize ROI across all channels"
    ],
    curriculum: [
      {
        section: "Introduction to Performance Marketing",
        lessons: 8,
        duration: "45 min",
        items: [
          { title: "What is Performance Marketing?", duration: "5:30", type: "video" },
          { title: "Setting Up Your Marketing Stack", duration: "8:15", type: "video" },
          { title: "Key Metrics and KPIs", duration: "6:45", type: "video" },
          { title: "Attribution Models Explained", duration: "12:30", type: "video" },
          { title: "Performance Marketing Checklist", duration: "2:00", type: "resource" }
        ]
      },
      {
        section: "Google Ads Mastery",
        lessons: 12,
        duration: "95 min",
        items: [
          { title: "Account Structure Best Practices", duration: "8:20", type: "video" },
          { title: "Keyword Research and Strategy", duration: "15:45", type: "video" },
          { title: "Writing High-Converting Ad Copy", duration: "12:10", type: "video" },
          { title: "Landing Page Optimization", duration: "18:30", type: "video" },
          { title: "Automated Bidding Strategies", duration: "14:25", type: "video" }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "https://ext.same-assets.com/1352620099/2467202758.webp",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolutely fantastic course! Ahmed explains complex concepts in a very easy-to-understand way. I was able to increase my client's ROAS by 300% using these strategies."
      },
      {
        id: 2,
        name: "Mike Chen",
        avatar: "https://ext.same-assets.com/1352620099/173810076.webp",
        rating: 5,
        date: "1 month ago",
        comment: "This course is worth every penny. The practical examples and real case studies make it so much easier to implement these strategies in real campaigns."
      }
    ]
  },
  "2": {
    id: 2,
    title: "Visual Content Creation",
    subtitle: "Master Design for Social Media",
    description: "Create stunning visual content for social media and marketing campaigns using professional tools and techniques.",
    image: "https://ext.same-assets.com/1352620099/3921090386.webp",
    instructor: {
      name: "Sarah Johnson",
      title: "Creative Director",
      avatar: "https://ext.same-assets.com/1352620099/2467202758.webp",
      bio: "Sarah is a creative director with 8+ years of experience in visual content creation for major brands.",
      students: 18750,
      courses: 6,
      rating: 4.9
    },
    rating: 4.9,
    reviewCount: 5210,
    price: "$29",
    originalPrice: "$79",
    students: 18750,
    duration: "3 hours",
    lessons: 25,
    level: "Beginner",
    language: "English",
    certificate: true,
    lastUpdated: "December 2024",
    whatYouLearn: [
      "Master Canva and Adobe Creative Suite",
      "Create engaging social media graphics",
      "Design professional marketing materials",
      "Understand color theory and typography",
      "Build consistent brand aesthetics",
      "Optimize visuals for different platforms"
    ],
    curriculum: [
      {
        section: "Design Fundamentals",
        lessons: 8,
        duration: "45 min",
        items: [
          { title: "Color Theory Basics", duration: "6:30", type: "video" },
          { title: "Typography Principles", duration: "8:15", type: "video" },
          { title: "Layout and Composition", duration: "9:45", type: "video" }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Emily Davis",
        avatar: "https://ext.same-assets.com/1352620099/235950245.webp",
        rating: 5,
        date: "1 week ago",
        comment: "Great course for beginners! Sarah's teaching style is very clear and the examples are practical."
      }
    ]
  }
};

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [activeSection, setActiveSection] = useState(0);
  const course = courseData[params.id];

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist.</p>
          <Link href="/courses">
            <Button className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
              Browse All Courses
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <nav className="mb-4 text-sm">
                <Link href="/courses" className="text-gray-300 hover:text-white">Courses</Link>
                <ChevronRight className="inline w-4 h-4 mx-2" />
                <span className="text-gray-300">Marketing</span>
                <ChevronRight className="inline w-4 h-4 mx-2" />
                <span>{course.title}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.subtitle}</p>
              <p className="text-gray-300 mb-6 leading-relaxed">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(course.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-semibold">{course.rating}</span>
                  <span className="text-gray-300">({course.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Users className="w-5 h-5" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">Created by {course.instructor.name}</p>
                  <p className="text-gray-300 text-sm">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 overflow-hidden">
                <div className="relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button size="lg" className="bg-[#d8bf78] text-white hover:bg-[#c4a86a]">
                      <Play className="w-6 h-6 mr-2" />
                      Preview Course
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-[#d8bf78]">{course.price}</span>
                      {course.originalPrice && (
                        <span className="text-lg text-gray-400 line-through ml-2">
                          {course.originalPrice}
                        </span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <Badge className="bg-[#d8bf78] text-white">70% OFF</Badge>
                    )}
                  </div>

                  <Link href={`/checkout?course=${course.id}&title=${encodeURIComponent(course.title)}&price=${course.price}`}>
                    <Button className="w-full bg-[#d8bf78] hover:bg-[#c4a86a] text-white font-semibold h-12 mb-4">
                      Enroll Now
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full mb-6">
                    Add to Wishlist
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Lessons:</span>
                      <span className="font-semibold">{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-semibold">{course.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-semibold">{course.language}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Certificate:</span>
                      <span className="font-semibold text-green-600">Yes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-8">
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-6">What you'll learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.whatYouLearn.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-8">
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-6">Course Curriculum</h3>
                      <div className="space-y-4">
                        {course.curriculum.map((section, index) => (
                          <div key={index} className="border rounded-lg">
                            <button
                              onClick={() => setActiveSection(activeSection === index ? -1 : index)}
                              className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                            >
                              <div>
                                <h4 className="font-semibold text-lg">{section.section}</h4>
                                <p className="text-gray-600 text-sm">
                                  {section.lessons} lessons • {section.duration}
                                </p>
                              </div>
                              <ChevronRight
                                className={`w-5 h-5 transition-transform ${
                                  activeSection === index ? 'rotate-90' : ''
                                }`}
                              />
                            </button>
                            {activeSection === index && (
                              <div className="p-4 border-t">
                                <div className="space-y-3">
                                  {section.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center justify-between py-2">
                                      <div className="flex items-center space-x-3">
                                        {item.type === 'video' ? (
                                          <Play className="w-4 h-4 text-[#d8bf78]" />
                                        ) : (
                                          <Download className="w-4 h-4 text-[#d8bf78]" />
                                        )}
                                        <span className="text-gray-700">{item.title}</span>
                                      </div>
                                      <span className="text-gray-500 text-sm">{item.duration}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="instructor" className="mt-8">
                  <Card>
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-6">
                        <Image
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          width={120}
                          height={120}
                          className="w-30 h-30 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{course.instructor.name}</h3>
                          <p className="text-[#d8bf78] font-semibold mb-4">{course.instructor.title}</p>

                          <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-800">{course.instructor.rating}</div>
                              <div className="text-sm text-gray-600">Instructor Rating</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-800">{course.instructor.students.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Students</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-800">{course.instructor.courses}</div>
                              <div className="text-sm text-gray-600">Courses</div>
                            </div>
                          </div>

                          <p className="text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-8">
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>
                      <div className="space-y-6">
                        {course.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6 last:border-b-0">
                            <div className="flex items-start space-x-4">
                              <Image
                                src={review.avatar}
                                alt={review.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{review.name}</h4>
                                  <span className="text-gray-500 text-sm">{review.date}</span>
                                </div>
                                <div className="flex items-center space-x-1 mb-3">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                <div className="flex items-center space-x-4 mt-3">
                                  <button className="flex items-center space-x-1 text-gray-500 hover:text-[#d8bf78]">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-sm">Helpful</span>
                                  </button>
                                  <button className="flex items-center space-x-1 text-gray-500 hover:text-[#d8bf78]">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-sm">Reply</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Course Features</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-[#d8bf78]" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-[#d8bf78]" />
                      <span>Access on mobile and desktop</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-4 h-4 text-[#d8bf78]" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Download className="w-4 h-4 text-[#d8bf78]" />
                      <span>Downloadable resources</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
