"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Globe, Play } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useSession } from "next-auth/react";
import { memo } from "react";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    image: string;
    instructor: string;
    price: number;
    rating: number;
    reviews: number;
    category: string;
    level: string;
    duration?: string;
    isFeatured?: boolean;
  };
  onViewCourse: (courseId: string) => void;
  onStartLearning: (courseId: string) => void;
  priority?: boolean;
}

const CourseCard = memo(function CourseCard({
  course,
  onViewCourse,
  onStartLearning,
  priority = false
}: CourseCardProps) {
  const { data: session } = useSession();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <OptimizedImage
            src={course.image}
            alt={course.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="hover:scale-105 transition-transform duration-300"
          />
          {course.duration && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-[#d8bf78] text-white">
                {course.duration}
              </Badge>
            </div>
          )}
          {course.isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-500 text-white">Featured</Badge>
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {course.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="font-medium">{course.instructor}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {course.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {course.level}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className="text-sm font-medium">{course.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({course.reviews} reviews)</span>
          </div>
          <div className="text-lg font-bold text-[#d8bf78]">
            ${course.price}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewCourse(course._id)}
          >
            <Globe className="w-4 h-4 mr-2" />
            View Course
          </Button>
          <Button 
            className="flex-1 bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
            onClick={() => onStartLearning(course._id)}
          >
            <Play className="w-4 h-4 mr-2" />
            {session?.user ? 'Start Learning' : 'Login to Learn'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default CourseCard;