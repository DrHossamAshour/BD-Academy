"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Download,
  Eye,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  PlayCircle,
  BookOpen,
  Target
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Mock certificates data
const certificates = [
  {
    id: 1,
    title: "Advanced Dental Implantology",
    instructor: "Dr. Sarah Johnson",
    issueDate: "2024-12-15",
    completionDate: "2024-12-10",
    grade: "A+",
    score: 98,
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    certificateUrl: "/certificates/advanced-implantology.pdf",
    status: "completed",
    hours: 12,
    lessons: 48
  },
  {
    id: 2,
    title: "Modern Orthodontic Techniques",
    instructor: "Dr. Michael Chen",
    issueDate: "2024-11-20",
    completionDate: "2024-11-15",
    grade: "A",
    score: 92,
    image: "https://ext.same-assets.com/1352620099/3921090386.webp",
    certificateUrl: "/certificates/orthodontic-techniques.pdf",
    status: "completed",
    hours: 10,
    lessons: 42
  },
  {
    id: 3,
    title: "Cosmetic Dentistry Masterclass",
    instructor: "Dr. Emily Rodriguez",
    issueDate: "2024-10-05",
    completionDate: "2024-10-01",
    grade: "A+",
    score: 95,
    image: "https://ext.same-assets.com/1352620099/839575724.webp",
    certificateUrl: "/certificates/cosmetic-dentistry.pdf",
    status: "completed",
    hours: 8,
    lessons: 36
  }
];

// In-progress courses
const inProgressCourses = [
  {
    id: 4,
    title: "Endodontic Excellence",
    instructor: "Dr. James Wilson",
    progress: 65,
    image: "https://ext.same-assets.com/1352620099/1412148953.webp",
    lessonsCompleted: 25,
    totalLessons: 38,
    hoursCompleted: 6,
    totalHours: 9
  },
  {
    id: 5,
    title: "Periodontal Surgery",
    instructor: "Dr. Lisa Anderson",
    progress: 30,
    image: "https://ext.same-assets.com/1352620099/1937323281.webp",
    lessonsCompleted: 10,
    totalLessons: 32,
    hoursCompleted: 2,
    totalHours: 7
  }
];

export default function CertificatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "student") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "student") {
    return null;
  }

  const totalCertificates = certificates.length;
  const totalHours = certificates.reduce((sum, cert) => sum + cert.hours, 0);
  const averageScore = Math.round(certificates.reduce((sum, cert) => sum + cert.score, 0) / certificates.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Certificates</h1>
              <p className="text-gray-600">Track your achievements and download your certificates</p>
            </div>
            <Link href="/dashboard/student">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#d8bf78] rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Certificates Earned</p>
                  <p className="text-2xl font-bold text-gray-800">{totalCertificates}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-800">{totalHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-800">{averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-800">{inProgressCourses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earned Certificates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Earned Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={certificate.image}
                    alt={certificate.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                  <Badge className="absolute top-4 left-4 bg-[#d8bf78] text-white">
                    {certificate.grade}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#d8bf78] transition-colors">
                    {certificate.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    by {certificate.instructor}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-semibold text-green-600">{certificate.score}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{certificate.hours}h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold">
                        {new Date(certificate.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1" variant="outline" asChild>
                      <Link href={`/dashboard/student/course/${certificate.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Course
                      </Link>
                    </Button>
                    <Button className="flex-1 bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* In Progress Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Courses In Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 right-4 bg-blue-500 text-white">
                    <PlayCircle className="w-3 h-3 mr-1" />
                    In Progress
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#d8bf78] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    by {course.instructor}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-semibold text-blue-600">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="w-full" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Lessons:</span>
                      <span className="font-semibold">
                        {course.lessonsCompleted}/{course.totalLessons}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Hours:</span>
                      <span className="font-semibold">
                        {course.hoursCompleted}/{course.totalHours}h
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-[#d8bf78] hover:bg-[#c4a86a] text-white" asChild>
                    <Link href={`/dashboard/student/course/${course.id}`}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 