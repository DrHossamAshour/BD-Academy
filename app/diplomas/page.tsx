"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Clock, Users, CheckCircle, Star } from "lucide-react";
import Image from "next/image";

const diplomas = [
  {
    id: 1,
    title: "Digital Marketing Professional",
    description: "Comprehensive certification covering all aspects of digital marketing including SEO, PPC, social media, and analytics",
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    duration: "3 months",
    courses: 8,
    students: 15420,
    rating: 4.9,
    price: "$199",
    originalPrice: "$399",
    features: [
      "8 comprehensive courses",
      "Real-world projects",
      "1-on-1 mentorship",
      "Industry certification",
      "Job placement assistance",
      "Lifetime access"
    ],
    skills: ["SEO", "PPC", "Social Media", "Analytics", "Content Marketing", "Email Marketing"]
  },
  {
    id: 2,
    title: "Full-Stack Web Developer",
    description: "Complete web development program covering frontend, backend, databases, and modern frameworks",
    image: "https://ext.same-assets.com/1352620099/310938119.webp",
    duration: "6 months",
    courses: 12,
    students: 8965,
    rating: 4.8,
    price: "$299",
    originalPrice: "$599",
    features: [
      "12 hands-on courses",
      "Portfolio projects",
      "Code reviews",
      "Industry certification",
      "Career counseling",
      "Lifetime updates"
    ],
    skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git"]
  },
  {
    id: 3,
    title: "AI & Machine Learning Expert",
    description: "Advanced certification in artificial intelligence and machine learning with practical implementations",
    image: "https://ext.same-assets.com/1352620099/2386637243.webp",
    duration: "4 months",
    courses: 10,
    students: 6234,
    rating: 4.9,
    price: "$349",
    originalPrice: "$699",
    features: [
      "10 advanced courses",
      "ML model building",
      "Research projects",
      "Industry certification",
      "Expert mentorship",
      "Job referrals"
    ],
    skills: ["Python", "TensorFlow", "Deep Learning", "Data Science", "Neural Networks", "Computer Vision"]
  },
  {
    id: 4,
    title: "Business Analytics Professional",
    description: "Data-driven business analysis certification with focus on insights, reporting, and strategic decision making",
    image: "https://ext.same-assets.com/1352620099/1412148953.webp",
    duration: "3 months",
    courses: 7,
    students: 4567,
    rating: 4.7,
    price: "$179",
    originalPrice: "$359",
    features: [
      "7 analytical courses",
      "Case study projects",
      "Dashboard creation",
      "Industry certification",
      "Networking events",
      "Career support"
    ],
    skills: ["Excel", "SQL", "Tableau", "Power BI", "Python", "Statistics"]
  },
  {
    id: 5,
    title: "E-commerce Specialist",
    description: "Complete e-commerce certification covering online store setup, marketing, and optimization strategies",
    image: "https://ext.same-assets.com/1352620099/1937323281.webp",
    duration: "2 months",
    courses: 6,
    students: 7892,
    rating: 4.6,
    price: "$149",
    originalPrice: "$299",
    features: [
      "6 practical courses",
      "Store setup projects",
      "Marketing campaigns",
      "Industry certification",
      "Business mentorship",
      "Growth strategies"
    ],
    skills: ["Shopify", "Amazon FBA", "Facebook Ads", "Google Ads", "Conversion Optimization", "Analytics"]
  },
  {
    id: 6,
    title: "UX/UI Design Master",
    description: "Professional design certification focusing on user experience, interface design, and design systems",
    image: "https://ext.same-assets.com/1352620099/997379786.png",
    duration: "4 months",
    courses: 9,
    students: 5643,
    rating: 4.8,
    price: "$249",
    originalPrice: "$499",
    features: [
      "9 design courses",
      "Portfolio development",
      "Client projects",
      "Industry certification",
      "Design critiques",
      "Freelance guidance"
    ],
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Design Systems"]
  }
];

export default function DiplomasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Award className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Professional Diplomas
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Advance your career with our comprehensive diploma programs. Get certified by industry experts and gain the skills employers demand.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Industry Recognized</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Expert Mentorship</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Job Placement Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Diplomas Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Choose Your Career Path
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our diploma programs are designed by industry professionals to give you the exact skills needed to excel in today&apos;s competitive job market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diplomas.map((diploma) => (
              <Card key={diploma.id} className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 overflow-hidden h-full">
                <div className="relative">
                  <Image
                    src={diploma.image}
                    alt={diploma.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4 bg-[#d8bf78] text-white">
                    DIPLOMA
                  </Badge>
                  {diploma.originalPrice && (
                    <Badge className="absolute top-4 left-4 bg-[#d8bf78] text-white">
                      50% OFF
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#d8bf78] transition-colors">
                      {diploma.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {diploma.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-[#d8bf78] mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Duration</div>
                        <div className="font-semibold text-sm">{diploma.duration}</div>
                      </div>
                      <div className="text-center">
                        <Award className="w-5 h-5 text-[#d8bf78] mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Courses</div>
                        <div className="font-semibold text-sm">{diploma.courses} courses</div>
                      </div>
                      <div className="text-center">
                        <Users className="w-5 h-5 text-[#d8bf78] mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Students</div>
                        <div className="font-semibold text-sm">{diploma.students.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-2 mb-6">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(diploma.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {diploma.rating} rating
                      </span>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">What&apos;s Included:</h4>
                      <ul className="space-y-2">
                        {diploma.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Skills You&apos;ll Learn:</h4>
                      <div className="flex flex-wrap gap-2">
                        {diploma.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <span className="text-2xl font-bold text-[#d8bf78]">
                        {diploma.price}
                      </span>
                      {diploma.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {diploma.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-[#d8bf78] hover:bg-[#c4a86a] text-white font-medium h-12">
                        Enroll in Diploma Program
                      </Button>
                      <Button variant="outline" className="w-full border-[#d8bf78] text-[#d8bf78] hover:bg-[#d8bf78] hover:text-white font-medium h-10">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their careers with our diploma programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-[#c4a86a] font-semibold">
              Browse All Diplomas
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#c4a86a]">
              Talk to an Advisor
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
