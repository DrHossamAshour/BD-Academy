"use client";

import Image from "next/image";

const instructors = [
  {
    id: 1,
    name: "Dr. Michael Rodriguez",
    title: "AI & Machine Learning Expert",
    description: "Professor at Stanford University with 15+ years experience",
    image: "https://ext.same-assets.com/1352620099/1828205.webp",
    specialties: ["Machine Learning", "Deep Learning", "Data Science"]
  },
  {
    id: 2,
    name: "Dr. Sarah Williams",
    title: "Digital Marketing Strategist",
    description: "Former Marketing Director at Google with proven track record",
    image: "https://ext.same-assets.com/1352620099/1086067220.webp",
    specialties: ["Digital Marketing", "Growth Hacking", "Analytics"]
  },
  {
    id: 3,
    name: "Dr. Ahmed Hassan",
    title: "Full-Stack Developer",
    description: "Senior Software Engineer at Meta and startup founder",
    image: "https://ext.same-assets.com/1352620099/2583760427.webp",
    specialties: ["Web Development", "Mobile Apps", "Cloud Computing"]
  },
  {
    id: 4,
    name: "Prof. Emily Chen",
    title: "Business & Finance Expert",
    description: "Harvard Business School professor and investment advisor",
    image: "https://ext.same-assets.com/1352620099/235950245.webp",
    specialties: ["Investment", "Business Strategy", "Financial Planning"]
  },
  {
    id: 5,
    name: "Dr. James Thompson",
    title: "Design & UX Specialist",
    description: "Creative Director with 20+ years in design industry",
    image: "https://ext.same-assets.com/1352620099/1828205.webp",
    specialties: ["UI/UX Design", "Graphic Design", "Brand Strategy"]
  }
];

export default function InstructorsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Meet Our Expert Instructors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn from industry-leading professionals and world-class educators who bring real-world experience to every lesson
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="text-center group cursor-pointer"
            >
              <div className="relative mb-6">
                <div className="w-full aspect-square bg-gray-900 rounded-lg overflow-hidden group-hover:shadow-xl transition-all duration-300">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    width={250}
                    height={250}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 text-white p-3 rounded">
                    <h3 className="font-bold text-sm">{instructor.name}</h3>
                    <p className="text-xs opacity-90">{instructor.title}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {instructor.description}
                </p>
                <div className="flex flex-wrap justify-center gap-1">
                  {instructor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="text-xs bg-[#d8bf78] text-white px-2 py-1 rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border border-[#d8bf78] text-[#d8bf78] hover:bg-[#d8bf78] hover:text-white px-8 py-3 rounded-lg font-medium transition-colors">
            View All Instructors
          </button>
        </div>
      </div>
    </section>
  );
}
