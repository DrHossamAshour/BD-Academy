"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Download,
  Play,
  Award,
  Mail,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const courseTitle = searchParams.get('title') || 'Your Course';
  const courseId = searchParams.get('course');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Congratulations! You've successfully enrolled in{" "}
              <span className="font-semibold text-[#d8bf78]">{courseTitle}</span>.
              Your learning journey starts now!
            </p>
          </div>

          {/* Order Confirmation */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Order Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-sm">ET-{Date.now().toString().slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course:</span>
                      <span className="font-semibold">{courseTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="text-green-600 font-semibold">Completed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Access:</span>
                      <span className="text-green-600 font-semibold">Lifetime</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">What's Next?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-[#d8bf78] mt-0.5" />
                      <div>
                        <p className="font-semibold">Check Your Email</p>
                        <p className="text-sm text-gray-600">We've sent you access details and receipt</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Play className="w-5 h-5 text-[#d8bf78] mt-0.5" />
                      <div>
                        <p className="font-semibold">Start Learning</p>
                        <p className="text-sm text-gray-600">Access your course immediately</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-[#d8bf78] mt-0.5" />
                      <div>
                        <p className="font-semibold">Earn Certificate</p>
                        <p className="text-sm text-gray-600">Complete to get your certificate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Play className="w-12 h-12 text-[#d8bf78] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Start Learning Now</h3>
                <p className="text-gray-600 mb-4">
                  Access your course content and begin your learning journey immediately.
                </p>
                <Button className="w-full bg-[#d8bf78] hover:bg-[#c4a86a] text-white" asChild>
                  <Link href={courseId ? `/learn/course/${courseId}` : "/learn"}>
                    Go to Course
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Download Resources</h3>
                <p className="text-gray-600 mb-4">
                  Access downloadable materials, worksheets, and bonus content.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={courseId ? `/learn/course/${courseId}/resources` : "/learn"}>
                    View Resources
                    <Download className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Mobile App</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Learn on the go with our mobile app
                </p>
                <Button variant="outline" size="sm">
                  Download App
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Community</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Join our student community
                </p>
                <Button variant="outline" size="sm">
                  Join Community
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Support</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Need help? Contact our support
                </p>
                <Button variant="outline" size="sm">
                  Get Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Thank You Message */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Thank You for Choosing EasyT!</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              We're excited to be part of your learning journey. If you have any questions or need assistance,
              our support team is here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
