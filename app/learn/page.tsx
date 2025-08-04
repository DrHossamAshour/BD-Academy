"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const enrolledCourses = [
  {
    id: 1,
    title: "Performance Marketing Mastery",
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    instructor: "Ahmed Hassan",
    progress: 65,
    totalLessons: 45,
    completedLessons: 29,
    lastWatched: "Setting Up Google Analytics",
    duration: "5 hours"
  },
  {
    id: 2,
    title: "Visual Content Creation",
    image: "https://ext.same-assets.com/1352620099/3921090386.webp",
    instructor: "Sarah Johnson",
    progress: 30,
    totalLessons: 25,
    completedLessons: 8,
    lastWatched: "Color Theory Basics",
    duration: "3 hours"
  }
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome Back to Your Learning Journey!
          </h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Continue where you left off and keep building your skills with our expert-led courses.
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Continue Learning */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Continue Learning</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <Image
                            src={course.image}
                            alt={course.title}
                            width={80}
                            height={60}
                            className="w-20 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              by {course.instructor}
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                              Last watched: {course.lastWatched}
                            </p>

                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-semibold">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[#d8bf78] h-2 rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {course.completedLessons} of {course.totalLessons} lessons completed
                              </div>
                            </div>

                            <Button size="sm" className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recommended Courses */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Advanced SEO Strategies",
                      instructor: "David Wilson",
                      rating: 4.8,
                      price: "$29",
                      image: "https://ext.same-assets.com/1352620099/1412148953.webp"
                    },
                    {
                      title: "Social Media Marketing",
                      instructor: "Lisa Anderson",
                      rating: 4.7,
                      price: "$29",
                      image: "https://ext.same-assets.com/1352620099/1937323281.webp"
                    },
                    {
                      title: "Email Marketing Mastery",
                      instructor: "John Smith",
                      rating: 4.9,
                      price: "$29",
                      image: "https://ext.same-assets.com/1352620099/1590513021.webp"
                    }
                  ].map((course, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <Image
                          src={course.image}
                          alt={course.title}
                          width={300}
                          height={180}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm">{course.rating}</span>
                            </div>
                            <span className="font-bold text-[#d8bf78]">{course.price}</span>
                          </div>
                          <Button size="sm" variant="outline" className="w-full mt-3">
                            View Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Your Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-[#d8bf78]" />
                        <span className="text-sm">Courses Enrolled</span>
                      </div>
                      <span className="font-bold">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">Hours Learned</span>
                      </div>
                      <span className="font-bold">12.5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Lessons Completed</span>
                      </div>
                      <span className="font-bold">37</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm">Certificates</span>
                      </div>
                      <span className="font-bold">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/courses">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Browse More Courses
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="w-4 h-4 mr-2" />
                      View Certificates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="w-4 h-4 mr-2" />
                      Rate Courses
                    </Button>
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
