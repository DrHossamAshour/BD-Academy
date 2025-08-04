"use client";

import { Users, BookOpen, Award, Clock, Handshake, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "50,000+",
    label: "Students Enrolled",
    color: "bg-[#d8bf78]"
  },
  {
    icon: BookOpen,
    number: "200+",
    label: "Courses Available",
    color: "bg-[#d8bf78]"
  },
  {
    icon: Award,
    number: "95%",
    label: "Success Rate",
    color: "bg-[#d8bf78]"
  },
  {
    icon: Clock,
    number: "24/7",
    label: "Support Available",
    color: "bg-[#d8bf78]"
  },
  {
    icon: Handshake,
    number: "500+",
    label: "Expert Instructors",
    color: "bg-[#d8bf78]"
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "Student Rating",
    color: "bg-[#d8bf78]"
  }
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose BigDentist?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of dental professionals who trust us for their continuing education and professional development.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
