"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const allCourses = [
  {
    id: 1,
    title: "Performance Marketing Mastery",
    description: "Master performance marketing strategies and increase your digital marketing ROI with advanced techniques",
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    instructor: { name: "Ahmed Hassan", avatar: "https://ext.same-assets.com/1352620099/2098704192.webp" },
    rating: 4.8,
    reviews: 954,
    price: "$29",
    badge: "5+ Hours",
    category: "Marketing",
    level: "Intermediate"
  },
  {
    id: 2,
    title: "Visual Content Creation",
    description: "Create stunning visual content for social media and marketing campaigns using professional tools",
    image: "https://ext.same-assets.com/1352620099/3921090386.webp",
    instructor: { name: "Sarah Johnson", avatar: "https://ext.same-assets.com/1352620099/2467202758.webp" },
    rating: 4.9,
    reviews: 5210,
    price: "$29",
    badge: "3+ Hours",
    category: "Design",
    level: "Beginner"
  },
  {
    id: 3,
    title: "Amazon FBA Business",
    description: "Build a successful Amazon FBA business from scratch to six figures with proven strategies",
    image: "https://ext.same-assets.com/1352620099/839575724.webp",
    instructor: { name: "Mike Chen", avatar: "https://ext.same-assets.com/1352620099/173810076.webp" },
    rating: 4.7,
    reviews: 3188,
    price: "$29",
    badge: "8+ Hours",
    category: "Business",
    level: "Advanced"
  },
  {
    id: 4,
    title: "Google Analytics GA4",
    description: "Master Google Analytics 4 and make data-driven marketing decisions with confidence",
    image: "https://ext.same-assets.com/1352620099/1412148953.webp",
    instructor: { name: "David Wilson", avatar: "https://ext.same-assets.com/1352620099/3593533971.webp" },
    rating: 4.6,
    reviews: 1551,
    price: "$29",
    badge: "4+ Hours",
    category: "Analytics",
    level: "Intermediate"
  },
  {
    id: 5,
    title: "Shopify Store Design",
    description: "Design professional Shopify stores that convert visitors to customers",
    image: "https://ext.same-assets.com/1352620099/1937323281.webp",
    instructor: { name: "Lisa Anderson", avatar: "https://ext.same-assets.com/1352620099/2327627716.webp" },
    rating: 4.5,
    reviews: 727,
    price: "$29",
    badge: "6+ Hours",
    category: "E-commerce",
    level: "Intermediate"
  },
  {
    id: 6,
    title: "AI Marketing Tools",
    description: "Leverage artificial intelligence to automate and optimize your marketing campaigns",
    image: "https://ext.same-assets.com/1352620099/1590513021.webp",
    instructor: { name: "John Smith", avatar: "https://ext.same-assets.com/1352620099/2467202758.webp" },
    rating: 4.8,
    reviews: 3384,
    price: "$29",
    badge: "7+ Hours",
    category: "AI & Tech",
    level: "Advanced"
  },
  {
    id: 7,
    title: "Python Programming Complete",
    description: "Learn Python programming from basics to advanced with practical projects and real-world applications",
    image: "https://ext.same-assets.com/1352620099/573645849.webp",
    instructor: { name: "Dr. Rodriguez", avatar: "https://ext.same-assets.com/1352620099/1828205.webp" },
    rating: 4.9,
    reviews: 7432,
    price: "$29",
    badge: "15+ Hours",
    category: "Programming",
    level: "Beginner"
  },
  {
    id: 8,
    title: "Web Design Fundamentals",
    description: "Master modern web design principles and create stunning websites from scratch",
    image: "https://ext.same-assets.com/1352620099/310938119.webp",
    instructor: { name: "Emily Chen", avatar: "https://ext.same-assets.com/1352620099/235950245.webp" },
    rating: 4.7,
    reviews: 2156,
    price: "$29",
    badge: "12+ Hours",
    category: "Design",
    level: "Beginner"
  }
];

const categories = ["All", "Marketing", "Design", "Business", "Analytics", "E-commerce", "AI & Tech", "Programming"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Discover over 600+ courses taught by industry experts and advance your career with practical skills
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg bg-white text-gray-800 border-0 focus:ring-2 focus:ring-[#d8bf78]"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 self-center mr-2">Category:</span>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-[#d8bf78] hover:bg-[#c4a86a]" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Level Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 self-center mr-2">Level:</span>
              {levels.map(level => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className={selectedLevel === level ? "bg-[#d8bf78] hover:bg-[#c4a86a]" : ""}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
            </h2>
            <p className="text-gray-600">
              {selectedCategory !== "All" && `Category: ${selectedCategory} • `}
              {selectedLevel !== "All" && `Level: ${selectedLevel} • `}
              {searchTerm && `Search: "${searchTerm}"`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 bg-white border-0 overflow-hidden">
                <div className="relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4 bg-[#d8bf78] text-white">
                    {course.badge}
                  </Badge>
                  <Badge className="absolute top-4 left-4 bg-black/70 text-white">
                    {course.category}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#d8bf78] transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {course.instructor.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(course.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.rating} ({course.reviews})
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[#d8bf78]">
                      {course.price}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1" variant="outline" asChild>
                      <Link href={`/courses/${course.id}`}>
                        View Course
                      </Link>
                    </Button>
                    <Button className="flex-1 bg-[#d8bf78] hover:bg-[#c4a86a] text-white" asChild>
                      <Link href={`/checkout?course=${course.id}&title=${encodeURIComponent(course.title)}&price=${course.price}`}>
                        Enroll Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
