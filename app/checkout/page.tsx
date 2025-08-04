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
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

// Mock course data for checkout
interface CheckoutCourse {
  id: number;
  title: string;
  image: string;
  instructor: string;
  duration: string;
  lessons: number;
  rating: number;
  students: number;
  price: string;
  originalPrice?: string;
  features: string[];
}

const checkoutCourseData: { [key: string]: CheckoutCourse } = {
  "1": {
    id: 1,
    title: "Performance Marketing Mastery",
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    instructor: "Ahmed Hassan",
    duration: "5 hours",
    lessons: 45,
    rating: 4.8,
    students: 15420,
    price: "$29",
    originalPrice: "$99",
    features: [
      "Lifetime access to course content",
      "45 video lessons and resources",
      "Certificate of completion",
      "Mobile and desktop access",
      "Download resources for offline viewing",
      "Direct access to instructor"
    ]
  },
  "2": {
    id: 2,
    title: "Visual Content Creation",
    image: "https://ext.same-assets.com/1352620099/3921090386.webp",
    instructor: "Sarah Johnson",
    duration: "3 hours",
    lessons: 25,
    rating: 4.9,
    students: 18750,
    price: "$29",
    originalPrice: "$79",
    features: [
      "Lifetime access to course content",
      "25 video lessons and resources",
      "Certificate of completion",
      "Mobile and desktop access",
      "Design templates and resources",
      "Direct access to instructor"
    ]
  }
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course');
  const courseTitle = searchParams.get('title');
  const coursePrice = searchParams.get('price');

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const course = courseId ? checkoutCourseData[courseId] : null;

  if (!course && !courseTitle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Course Selected</h1>
          <p className="text-gray-600 mb-8">Please select a course to continue with checkout.</p>
          <Link href="/courses">
            <Button className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
              Browse Courses
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page
      window.location.href = `/checkout/success?course=${courseId}&title=${encodeURIComponent(courseTitle || course?.title || '')}`;
    }, 2000);
  };

  const displayCourse = course || {
    title: courseTitle,
    price: coursePrice,
    image: "https://ext.same-assets.com/1352620099/2409258185.webp",
    instructor: "Expert Instructor",
    features: [
      "Lifetime access to course content",
      "Video lessons and resources",
      "Certificate of completion",
      "Mobile and desktop access"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <section className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/courses" className="hover:text-[#d8bf78]">Courses</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/courses/${courseId}`} className="hover:text-[#d8bf78]">
              {displayCourse.title}
            </Link>
            <span>/</span>
            <span className="text-gray-800">Checkout</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Link href="/courses" className="inline-flex items-center text-gray-600 hover:text-[#d8bf78]">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Link>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-green-600" />
                    <span>Secure Checkout</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">Payment Method</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                          paymentMethod === 'card'
                            ? 'border-[#d8bf78] bg-[#d8bf78]/10 text-[#d8bf78]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Credit Card</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                          paymentMethod === 'paypal'
                            ? 'border-[#d8bf78] bg-[#d8bf78]/10 text-[#d8bf78]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                        <span>PayPal</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('apple')}
                        className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                          paymentMethod === 'apple'
                            ? 'border-[#d8bf78] bg-[#d8bf78]/10 text-[#d8bf78]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-5 h-5 bg-black rounded text-white text-xs flex items-center justify-center font-bold">A</div>
                        <span>Apple Pay</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {paymentMethod === 'card' && (
                      <>
                        {/* Billing Information */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name</Label>
                              <Input id="firstName" placeholder="John" required />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input id="lastName" placeholder="Doe" required />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input id="email" type="email" placeholder="john@example.com" required />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="address">Address</Label>
                              <Input id="address" placeholder="123 Main Street" required />
                            </div>
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input id="city" placeholder="New York" required />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Input id="country" placeholder="United States" required />
                            </div>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                  id="expiry"
                                  placeholder="MM/YY"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="mt-1 rounded border-gray-300 text-[#d8bf78] focus:ring-[#d8bf78]"
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-[#d8bf78] hover:text-[#c4a86a]">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#d8bf78] hover:text-[#c4a86a]">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-[#d8bf78] hover:bg-[#c4a86a] text-white font-semibold h-12"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Purchase {displayCourse.price}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Your payment is secure</span>
                </div>
                <p className="text-green-700 text-sm mt-2">
                  We use industry-standard encryption to protect your payment information. Your data is safe with us.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Course Info */}
                  <div className="flex space-x-4">
                    <Image
                      src={displayCourse.image || "/placeholder-course.jpg"}
                      alt={displayCourse.title || "Course"}
                      width={80}
                      height={60}
                      className="w-20 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">
                        {displayCourse.title || "Course"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {displayCourse.instructor || "Instructor"}
                      </p>
                    </div>
                  </div>

                  {/* Course Stats */}
                  {course && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{course.rating} rating</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {displayCourse.features?.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price Summary */}
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Course Price:</span>
                        {course?.originalPrice && (
                          <span className="text-gray-400 line-through">{course.originalPrice}</span>
                        )}
                      </div>
                      {course?.originalPrice && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-{parseInt(course.originalPrice.slice(1)) - parseInt(course.price.slice(1))}$</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span className="text-[#d8bf78]">{displayCourse.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Money Back Guarantee */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-800">30-Day Money-Back Guarantee</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Not satisfied? Get a full refund within 30 days, no questions asked.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
