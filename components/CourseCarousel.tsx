"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "ADVANCED DENTAL IMPLANTOLOGY",
    subtitle: "Professional Implant Course",
    description: "Master advanced dental implant techniques and surgical procedures",
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    badge: "BESTSELLER",
    price: "$299"
  },
  {
    id: 2,
    title: "MODERN ORTHODONTIC TECHNIQUES",
    subtitle: "Complete Orthodontic Training",
    description: "Learn modern orthodontic methods and treatment planning",
    image: "https://ext.same-assets.com/1352620099/3921090386.webp",
    badge: "POPULAR",
    price: "$199"
  },
  {
    id: 3,
    title: "COSMETIC DENTISTRY MASTERCLASS",
    subtitle: "Aesthetic Dentistry Excellence",
    description: "Master cosmetic dental procedures and smile design",
    image: "https://ext.same-assets.com/1352620099/839575724.webp",
    badge: "NEW",
    price: "$249"
  },
  {
    id: 4,
    title: "ENDODONTIC EXCELLENCE",
    subtitle: "Root Canal Mastery",
    description: "Advanced endodontic techniques and treatment protocols",
    image: "https://ext.same-assets.com/1352620099/1412148953.webp",
    badge: "TRENDING",
    price: "$179"
  },
  {
    id: 5,
    title: "PERIODONTAL SURGERY",
    subtitle: "Gum Disease Treatment",
    description: "Comprehensive periodontal surgery and treatment methods",
    image: "https://ext.same-assets.com/1352620099/1937323281.webp",
    badge: "HOT",
    price: "$199"
  }
];

export default function CourseCarousel() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Course Cards */}
          <div className="overflow-hidden mx-12">
            <div className="flex space-x-4 animate-scroll">
              {courses.map((course) => (
                <Card key={course.id} className="flex-shrink-0 w-80 bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white relative overflow-hidden">
                  <div className="p-6">
                    {/* Badge */}
                    <Badge className="absolute top-4 right-4 bg-yellow-400 text-black font-bold">
                      {course.badge}
                    </Badge>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">{course.title}</h3>
                      <h4 className="text-lg opacity-90">{course.subtitle}</h4>
                      <p className="text-sm opacity-80 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between pt-4">
                        <span className="text-2xl font-bold">{course.price}</span>
                        <Button variant="secondary" className="bg-white text-[#c4a86a] hover:bg-gray-100" asChild>
                          <Link href={`/checkout?course=${course.id}&title=${encodeURIComponent(course.title)}&price=${course.price}`}>
                            Enroll Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Background Pattern */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"></div>
                  <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-white/5 rounded-full"></div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
