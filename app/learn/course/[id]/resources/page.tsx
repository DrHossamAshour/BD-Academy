"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  Archive,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

const courseResources: { [key: string]: any } = {
  "1": {
    title: "Performance Marketing Mastery",
    resources: [
      {
        id: 1,
        title: "Performance Marketing Checklist",
        type: "pdf",
        size: "1.2 MB",
        description: "Complete checklist for setting up performance marketing campaigns",
        downloadUrl: "#"
      },
      {
        id: 2,
        title: "Google Ads Templates",
        type: "archive",
        size: "5.8 MB",
        description: "Ready-to-use Google Ads templates and examples",
        downloadUrl: "#"
      },
      {
        id: 3,
        title: "Analytics Dashboard Templates",
        type: "pdf",
        size: "3.1 MB",
        description: "Custom dashboard templates for tracking performance",
        downloadUrl: "#"
      },
      {
        id: 4,
        title: "Facebook Ads Creative Examples",
        type: "archive",
        size: "12.4 MB",
        description: "High-converting Facebook ad creatives and examples",
        downloadUrl: "#"
      },
      {
        id: 5,
        title: "ROI Calculator Spreadsheet",
        type: "excel",
        size: "0.8 MB",
        description: "Excel template for calculating marketing ROI",
        downloadUrl: "#"
      }
    ]
  },
  "2": {
    title: "Visual Content Creation",
    resources: [
      {
        id: 1,
        title: "Design Templates Pack",
        type: "archive",
        size: "25.6 MB",
        description: "50+ social media design templates",
        downloadUrl: "#"
      },
      {
        id: 2,
        title: "Color Palette Guide",
        type: "pdf",
        size: "2.1 MB",
        description: "Comprehensive guide to color theory and palettes",
        downloadUrl: "#"
      }
    ]
  }
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-8 h-8 text-[#d8bf78]" />;
    case 'archive':
      return <Archive className="w-8 h-8 text-purple-500" />;
    case 'excel':
      return <FileText className="w-8 h-8 text-green-500" />;
    case 'image':
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    case 'video':
      return <Video className="w-8 h-8 text-orange-500" />;
    default:
      return <FileText className="w-8 h-8 text-gray-500" />;
  }
};

const getFileTypeBadge = (type: string) => {
  switch (type) {
    case 'pdf':
      return <Badge className="bg-[#d8bf78]/20 text-[#d8bf78] hover:bg-[#d8bf78]/30">PDF</Badge>;
    case 'archive':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">ZIP</Badge>;
    case 'excel':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">XLSX</Badge>;
    case 'image':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">IMAGE</Badge>;
    case 'video':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">VIDEO</Badge>;
    default:
      return <Badge variant="secondary">FILE</Badge>;
  }
};

export default function CourseResourcesPage({ params }: { params: { id: string } }) {
  const course = courseResources[params.id];

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course resources you're looking for don't exist.</p>
          <Link href="/learn">
            <Button className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
              Back to Learning Dashboard
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <section className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/learn" className="hover:text-[#d8bf78]">Learning Dashboard</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/learn/course/${params.id}`} className="hover:text-[#d8bf78]">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-gray-800">Resources</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Course Resources
            </h1>
            <p className="text-xl text-gray-600">
              Download materials, templates, and resources for <span className="font-semibold">{course.title}</span>
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.resources.map((resource: any) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(resource.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 line-clamp-2">
                          {resource.title}
                        </h3>
                        {getFileTypeBadge(resource.type)}
                      </div>

                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Size: {resource.size}
                        </span>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button size="sm" className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Download All */}
          <div className="text-center mt-12">
            <Card className="bg-gray-100">
              <CardContent className="p-8">
                <Archive className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Download All Resources
                </h3>
                <p className="text-gray-600 mb-6">
                  Get all course materials in one convenient package
                </p>
                <Button size="lg" className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
                  <Download className="w-5 h-5 mr-2" />
                  Download All ({course.resources.length} files)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <Button variant="outline" asChild>
              <Link href={`/learn/course/${params.id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/learn">
                Learning Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
