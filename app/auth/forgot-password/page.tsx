"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-[#d8bf78]">Big</span>
                <span className="text-gray-800">Dentist</span>
              </div>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-[#d8bf78]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[#d8bf78]" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Forgot Password?
              </CardTitle>
              <p className="text-gray-600 mt-2">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10 h-12 border-gray-300 focus:border-[#d8bf78] focus:ring-[#d8bf78]"
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <Button className="w-full h-12 bg-[#d8bf78] hover:bg-[#c4a86a] text-white font-medium">
                  Send Reset Link
                </Button>
              </form>

              {/* Back to Login */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-[#d8bf78] hover:text-[#c4a86a] font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Help Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  If you don't receive the reset email within a few minutes, please check your spam folder or contact our support team.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
