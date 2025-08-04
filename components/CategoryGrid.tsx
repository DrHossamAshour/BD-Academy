"use client";

import {
  Code,
  Palette,
  Smartphone,
  Brain,
  TrendingUp,
  Camera,
  Headphones,
  Globe,
  PenTool,
  BarChart3,
  Database,
  Zap
} from "lucide-react";

const categories = [
  { icon: Code, label: "Programming & Development", color: "bg-gray-600" },
  { icon: Palette, label: "Design & Graphics", color: "bg-gray-600" },
  { icon: Smartphone, label: "Mobile Development", color: "bg-gray-600" },
  { icon: Brain, label: "AI & Machine Learning", color: "bg-gray-600" },
  { icon: TrendingUp, label: "Business & Marketing", color: "bg-gray-600" },
  { icon: Camera, label: "Photography & Video", color: "bg-gray-600" },
  { icon: Headphones, label: "Audio Production", color: "bg-gray-600" },
  { icon: Globe, label: "Web Development", color: "bg-gray-600" },
  { icon: PenTool, label: "Creative Writing", color: "bg-gray-600" },
  { icon: BarChart3, label: "Data Analysis", color: "bg-gray-600" },
  { icon: Database, label: "Database Management", color: "bg-gray-600" },
  { icon: Zap, label: "Automation Tools", color: "bg-gray-600" }
];

export default function CategoryGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-3 group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center group-hover:bg-[#d8bf78] transition-colors duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm text-center text-gray-700 group-hover:text-[#d8bf78] transition-colors duration-300 font-medium">
                  {category.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
