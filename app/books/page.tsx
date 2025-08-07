"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Star, Clock, Users, Search, Filter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const books = [
  {
    id: 1,
    title: "Dental Anatomy & Physiology",
    author: "Dr. Sarah Johnson",
    description: "Comprehensive guide to dental anatomy, physiology, and clinical applications",
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    category: "Anatomy",
    rating: 4.8,
    downloads: 15420,
    pages: 450,
    price: "$49",
    originalPrice: "$79",
    format: "PDF",
    language: "English",
    features: [
      "High-quality illustrations",
      "Clinical case studies",
      "Interactive diagrams",
      "Practice questions",
      "Mobile-friendly format"
    ]
  },
  {
    id: 2,
    title: "Modern Dental Materials",
    author: "Dr. Michael Chen",
    description: "Complete reference on contemporary dental materials and their applications",
    image: "https://ext.same-assets.com/1352620099/310938119.webp",
    category: "Materials",
    rating: 4.7,
    downloads: 8965,
    pages: 380,
    price: "$39",
    originalPrice: "$65",
    format: "PDF",
    language: "English",
    features: [
      "Material properties",
      "Clinical guidelines",
      "Safety protocols",
      "Case examples",
      "Updated standards"
    ]
  },
  {
    id: 3,
    title: "Oral Surgery Techniques",
    author: "Dr. Emily Rodriguez",
    description: "Step-by-step guide to common oral surgery procedures and techniques",
    image: "https://ext.same-assets.com/1352620099/2386637243.webp",
    category: "Surgery",
    rating: 4.9,
    downloads: 6234,
    pages: 520,
    price: "$59",
    originalPrice: "$99",
    format: "PDF",
    language: "English",
    features: [
      "Surgical protocols",
      "Video demonstrations",
      "Complication management",
      "Post-operative care",
      "Evidence-based approach"
    ]
  },
  {
    id: 4,
    title: "Dental Practice Management",
    author: "Dr. Robert Wilson",
    description: "Essential guide to running a successful dental practice",
    image: "https://ext.same-assets.com/1352620099/1412148953.webp",
    category: "Management",
    rating: 4.6,
    downloads: 4567,
    pages: 320,
    price: "$29",
    originalPrice: "$49",
    format: "PDF",
    language: "English",
    features: [
      "Business strategies",
      "Staff management",
      "Financial planning",
      "Marketing tips",
      "Legal considerations"
    ]
  },
  {
    id: 5,
    title: "Pediatric Dentistry Handbook",
    author: "Dr. Lisa Thompson",
    description: "Comprehensive resource for treating children and adolescents",
    image: "https://ext.same-assets.com/1352620099/1937323281.webp",
    category: "Pediatrics",
    rating: 4.8,
    downloads: 7892,
    pages: 410,
    price: "$44",
    originalPrice: "$74",
    format: "PDF",
    language: "English",
    features: [
      "Age-specific protocols",
      "Behavior management",
      "Preventive strategies",
      "Parent education",
      "Emergency procedures"
    ]
  },
  {
    id: 6,
    title: "Digital Dentistry Guide",
    author: "Dr. James Anderson",
    description: "Modern approaches to digital dentistry and technology integration",
    image: "https://ext.same-assets.com/1352620099/997379786.png",
    category: "Technology",
    rating: 4.7,
    downloads: 5643,
    pages: 360,
    price: "$34",
    originalPrice: "$59",
    format: "PDF",
    language: "English",
    features: [
      "Digital workflows",
      "CAD/CAM systems",
      "3D imaging",
      "Software tutorials",
      "Future trends"
    ]
  }
];

const categories = ["All", "Anatomy", "Materials", "Surgery", "Management", "Pediatrics", "Technology"];

export default function BooksPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Books & Resources
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Access comprehensive dental education resources, textbooks, and reference materials to enhance your knowledge and skills.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center space-x-2">
              <Download className="w-6 h-6" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6" />
              <span>Expert Authored</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span>Trusted by Professionals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#d8bf78] focus:border-[#d8bf78]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#d8bf78] focus:border-[#d8bf78]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Professional Resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated collection of dental education resources written by industry experts and trusted by professionals worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 overflow-hidden h-full">
                <div className="relative">
                  <Image
                    src={book.image}
                    alt={book.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4 bg-[#d8bf78] text-white">
                    {book.format}
                  </Badge>
                  {book.originalPrice && (
                    <Badge className="absolute top-4 left-4 bg-[#d8bf78] text-white">
                      SALE
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {book.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#d8bf78] transition-colors">
                      {book.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3">
                      by <span className="font-medium">{book.author}</span>
                    </p>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {book.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-[#d8bf78] mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Pages</div>
                        <div className="font-semibold text-sm">{book.pages}</div>
                      </div>
                      <div className="text-center">
                        <Download className="w-5 h-5 text-[#d8bf78] mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Downloads</div>
                        <div className="font-semibold text-sm">{book.downloads.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <Users className="w-5 h-5 text-[#d8bf78] mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Language</div>
                        <div className="font-semibold text-sm">{book.language}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">What&apos;s Included:</h4>
                      <ul className="space-y-1">
                        {book.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-[#d8bf78] rounded-full flex-shrink-0"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <span className="text-2xl font-bold text-[#d8bf78]">
                        {book.price}
                      </span>
                      {book.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {book.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-[#d8bf78] hover:bg-[#c4a86a] text-white font-medium h-12">
                        <Download className="w-4 h-4 mr-2" />
                        Download Now
                      </Button>
                      <Button variant="outline" className="w-full border-[#d8bf78] text-[#d8bf78] hover:bg-[#d8bf78] hover:text-white font-medium h-10">
                        Preview Sample
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Expand Your Knowledge?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of dental professionals who trust our resources for their continuing education and professional development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-[#c4a86a] font-semibold">
              Browse All Resources
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#c4a86a]">
              Request Custom Content
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 