"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'image' | 'video' | 'link';
  size?: string;
  description: string;
  url: string;
}

export default function ResourcesPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Mock resources data
    setResources([
      {
        id: 1,
        title: "Course Workbook",
        type: 'pdf',
        size: '2.4 MB',
        description: "Complete workbook with exercises and assignments",
        url: "#"
      },
      {
        id: 2,
        title: "Marketing Templates",
        type: 'pdf',
        size: '1.8 MB',
        description: "Ready-to-use templates for campaigns",
        url: "#"
      },
      {
        id: 3,
        title: "Analytics Dashboard Templates",
        type: 'image',
        size: '3.2 MB',
        description: "Custom dashboard templates for tracking performance",
        url: "#"
      },
      {
        id: 4,
        title: "Case Study Examples",
        type: 'pdf',
        size: '4.1 MB',
        description: "Real-world case studies and success stories",
        url: "#"
      },
      {
        id: 5,
        title: "Video Tutorials",
        type: 'video',
        size: '156 MB',
        description: "Additional video content and demonstrations",
        url: "#"
      },
      {
        id: 6,
        title: "Google Analytics Setup Guide",
        type: 'link',
        description: "Step-by-step guide for setting up analytics",
        url: "https://analytics.google.com"
      }
    ]);
    setLoading(false);
  }, [session, status, router, params.id]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'link':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'text-red-600 bg-red-100';
      case 'image':
        return 'text-green-600 bg-green-100';
      case 'video':
        return 'text-blue-600 bg-blue-100';
      case 'link':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href={`/dashboard/student/course/${params.id}`}>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Course Resources
          </h1>
          <p className="text-xl opacity-90">
            Download additional materials, templates, and resources to enhance your learning experience.
          </p>
        </div>
      </section>

      {/* Resources Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                      {getIcon(resource.type)}
                    </div>
                    {resource.size && (
                      <span className="text-sm text-gray-500">{resource.size}</span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  {resource.type === 'link' ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Link
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Handle download - in real app, trigger file download
                        console.log(`Downloading ${resource.title}`);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>How to Use These Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📚 Course Materials</h4>
                    <p className="text-gray-600 text-sm">
                      Download workbooks, templates, and guides to follow along with the course content.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🎯 Practice Exercises</h4>
                    <p className="text-gray-600 text-sm">
                      Use the provided templates and case studies to practice what you&apos;ve learned.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📊 Additional Content</h4>
                    <p className="text-gray-600 text-sm">
                      Access bonus videos, examples, and external resources to deepen your understanding.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">💡 Tips</h4>
                    <p className="text-gray-600 text-sm">
                      Save these resources for future reference and use them in your real-world projects.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 