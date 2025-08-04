"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featuredCourses = [
  {
    id: 1,
    title: "Advanced Dental Implantology",
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
    students: 1247,
    price: "$299",
    originalPrice: "$599",
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    category: "Implantology"
  },
  {
    id: 2,
    title: "Modern Orthodontic Techniques",
    instructor: "Dr. Michael Chen",
    rating: 4.9,
    students: 2156,
    price: "$199",
    originalPrice: "$399",
    image: "https://ext.same-assets.com/1352620099/3921090386.webp",
    category: "Orthodontics"
  },
  {
    id: 3,
    title: "Cosmetic Dentistry Masterclass",
    instructor: "Dr. Emily Rodriguez",
    rating: 4.7,
    students: 1893,
    price: "$249",
    originalPrice: "$499",
    image: "https://ext.same-assets.com/1352620099/839575724.webp",
    category: "Cosmetic"
  },
  {
    id: 4,
    title: "Endodontic Excellence",
    instructor: "Dr. James Wilson",
    rating: 4.8,
    students: 1567,
    price: "$179",
    originalPrice: "$359",
    image: "https://ext.same-assets.com/1352620099/1412148953.webp",
    category: "Endodontics"
  }
];

export default function FeaturedCourses() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Featured Courses
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular dental education courses designed by industry experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 right-4 bg-[#d8bf78] text-white">
                  {course.category}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#d8bf78] transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  by {course.instructor}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({course.students} students)
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-[#d8bf78]">
                      {course.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {course.originalPrice}
                    </span>
                  </div>
                </div>
                
                <Button className="flex-1 bg-[#d8bf78] hover:bg-[#c4a86a] text-white" asChild>
                  <Link href={`/courses/${course.id}`}>
                    Enroll Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white px-8 py-3 rounded-lg font-medium transition-colors">
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
}
