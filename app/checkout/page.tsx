"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Lock,
  Check,
  Star,
  Clock,
  Award,
  Users,
  Shield,
  ArrowLeft,
  UserPlus,
  LogIn
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Fetch course data from database
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data.data);
        } else {
          console.error('Failed to fetch course');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Check authentication
  useEffect(() => {
    if (!session?.user) {
      // Store the intended course in sessionStorage and redirect to login
      if (courseId) {
        sessionStorage.setItem('redirectAfterLogin', `/checkout?courseId=${courseId}`);
      }
      router.push('/auth/login');
    }
  }, [session, courseId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!course) {
      alert('No course selected');
      return;
    }

    try {
      // Create payment intent
      const response = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course._id,
          courseTitle: course.title,
          amount: course.price,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`
        }),
      });

      if (response.ok) {
        const { clientSecret } = await response.json();
        // Redirect to success page
        router.push(`/checkout/success?courseId=${course._id}`);
      } else {
        alert('Payment setup failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  if (!courseId || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Course Selected</h1>
            <p className="text-gray-600 mb-8">Please select a course to continue with checkout.</p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/courses" className="text-[#d8bf78] hover:text-[#c4a86a] text-sm flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Summary */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-[#d8bf78]" />
                  Course Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://ext.same-assets.com/1352620099/2409258185.webp";
                      }}
                      unoptimized={course.image?.startsWith('/uploads/')}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{course.students || 0} students</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                        <span>{course.rating || 4.5}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle>What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Lifetime access to course content",
                    `${course.curriculum?.reduce((total: number, section: any) => total + (section.lessons?.length || 0), 0) || 0} video lessons and resources`,
                    "Certificate of completion",
                    "Mobile and desktop access",
                    "Download resources for offline viewing",
                    "Direct access to instructor",
                    "Advanced dental techniques",
                    "Professional development credits"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
                <p className="text-sm text-gray-600">Fill in your details to complete the enrollment</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State/Province *</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-[#d8bf78]">${course.price}</span>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#d8bf78] hover:bg-[#c4a86a] text-white py-3"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Purchase
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      By completing this purchase, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
