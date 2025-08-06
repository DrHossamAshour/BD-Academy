"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (courseId && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (courseId && countdown === 0) {
      router.push(`/courses/${courseId}/learn`);
    }
  }, [courseId, countdown, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Enrollment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Congratulations! You have successfully enrolled in the course. 
            You will be redirected to start learning in {countdown} seconds.
          </p>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
              onClick={() => router.push(`/courses/${courseId}/learn`)}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Learning Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
