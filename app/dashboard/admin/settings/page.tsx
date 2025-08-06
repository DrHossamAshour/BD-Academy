"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  ArrowLeft,
  Save,
  Shield,
  Users,
  BookOpen,
  DollarSign,
  Bell,
  Globe,
  Database,
  Key,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Lock,
  Palette,
  Monitor,
  Smartphone,
  Globe2,
  CreditCard,
  FileText,
  BarChart3,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock settings data
const settingsData = {
  general: {
    platformName: "BigDentist Learning Platform",
    platformDescription: "Advanced dental education platform for professionals",
    contactEmail: "admin@bigdentist.com",
    supportPhone: "+1 (555) 123-4567",
    timezone: "UTC-5 (Eastern Time)",
    language: "English",
    currency: "USD"
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireEmailVerification: true,
    allowSocialLogin: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  },
  courseSettings: {
    autoApproveCourses: false,
    requireInstructorVerification: true,
    maxCoursePrice: 500,
    minCourseDuration: 1,
    allowCoursePreviews: true,
    enableCourseReviews: true,
    requireCourseCompletion: true
  },
  userSettings: {
    allowUserRegistration: true,
    requireEmailConfirmation: true,
    allowProfileEditing: true,
    enableUserMessaging: true,
    allowUserReviews: true,
    maxUserCourses: 50,
    enableUserCertificates: true
  },
  paymentSettings: {
    stripeEnabled: true,
    paypalEnabled: true,
    platformFee: 15,
    instructorPayoutSchedule: "monthly",
    minimumPayout: 50,
    enableRefunds: true,
    refundWindow: 30
  },
  notificationSettings: {
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    newEnrollments: true,
    paymentConfirmations: true,
    systemMaintenance: true
  },
  systemSettings: {
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    cdnEnabled: true,
    backupFrequency: "daily",
    logRetention: 90
  }
};

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState(settingsData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "admin") {
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

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setHasChanges(false);
    alert("Settings saved successfully!");
  };

  const renderSettingItem = (section: string, key: string, label: string, type: string, options?: any) => {
    const value = (settings as any)[section][key];
    
    switch (type) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(e) => handleSettingChange(section, key, e.target.value)}
            placeholder={label}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(section, key, parseInt(e.target.value))}
            placeholder={label}
          />
        );
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(section, key, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
          >
            {options?.map((option: any, index: number) => (
              <option key={index} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      case "switch":
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked: boolean) => handleSettingChange(section, key, checked)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/dashboard/admin">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Platform Settings</h1>
              <p className="text-gray-600">Configure platform behavior and system preferences</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Config
              </Button>
              <Button 
                className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                onClick={handleSaveSettings}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Platform Name</label>
                {renderSettingItem("general", "platformName", "Platform Name", "text")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                {renderSettingItem("general", "contactEmail", "Contact Email", "text")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Support Phone</label>
                {renderSettingItem("general", "supportPhone", "Support Phone", "text")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Timezone</label>
                {renderSettingItem("general", "timezone", "Timezone", "select", [
                  { value: "UTC-5 (Eastern Time)", label: "UTC-5 (Eastern Time)" },
                  { value: "UTC-8 (Pacific Time)", label: "UTC-8 (Pacific Time)" },
                  { value: "UTC+0 (GMT)", label: "UTC+0 (GMT)" }
                ])}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Currency</label>
                {renderSettingItem("general", "currency", "Currency", "select", [
                  { value: "USD", label: "USD ($)" },
                  { value: "EUR", label: "EUR (€)" },
                  { value: "GBP", label: "GBP (£)" }
                ])}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                  <p className="text-xs text-gray-500">Require 2FA for all users</p>
                </div>
                {renderSettingItem("security", "twoFactorAuth", "Two-Factor Authentication", "switch")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                {renderSettingItem("security", "sessionTimeout", "Session Timeout", "number")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password Minimum Length</label>
                {renderSettingItem("security", "passwordMinLength", "Password Minimum Length", "number")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Verification Required</label>
                  <p className="text-xs text-gray-500">Require email verification for new accounts</p>
                </div>
                {renderSettingItem("security", "requireEmailVerification", "Email Verification Required", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow Social Login</label>
                  <p className="text-xs text-gray-500">Enable Google, Facebook login</p>
                </div>
                {renderSettingItem("security", "allowSocialLogin", "Allow Social Login", "switch")}
              </div>
            </CardContent>
          </Card>

          {/* Course Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Course Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto-Approve Courses</label>
                  <p className="text-xs text-gray-500">Automatically approve new courses</p>
                </div>
                {renderSettingItem("courseSettings", "autoApproveCourses", "Auto-Approve Courses", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Instructor Verification Required</label>
                  <p className="text-xs text-gray-500">Verify instructor credentials</p>
                </div>
                {renderSettingItem("courseSettings", "requireInstructorVerification", "Instructor Verification Required", "switch")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Maximum Course Price ($)</label>
                {renderSettingItem("courseSettings", "maxCoursePrice", "Maximum Course Price", "number")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow Course Previews</label>
                  <p className="text-xs text-gray-500">Show course previews to visitors</p>
                </div>
                {renderSettingItem("courseSettings", "allowCoursePreviews", "Allow Course Previews", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable Course Reviews</label>
                  <p className="text-xs text-gray-500">Allow students to review courses</p>
                </div>
                {renderSettingItem("courseSettings", "enableCourseReviews", "Enable Course Reviews", "switch")}
              </div>
            </CardContent>
          </Card>

          {/* User Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow User Registration</label>
                  <p className="text-xs text-gray-500">Allow new users to register</p>
                </div>
                {renderSettingItem("userSettings", "allowUserRegistration", "Allow User Registration", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Confirmation Required</label>
                  <p className="text-xs text-gray-500">Require email confirmation</p>
                </div>
                {renderSettingItem("userSettings", "requireEmailConfirmation", "Email Confirmation Required", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow Profile Editing</label>
                  <p className="text-xs text-gray-500">Users can edit their profiles</p>
                </div>
                {renderSettingItem("userSettings", "allowProfileEditing", "Allow Profile Editing", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable User Messaging</label>
                  <p className="text-xs text-gray-500">Allow users to message each other</p>
                </div>
                {renderSettingItem("userSettings", "enableUserMessaging", "Enable User Messaging", "switch")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Maximum User Courses</label>
                {renderSettingItem("userSettings", "maxUserCourses", "Maximum User Courses", "number")}
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Stripe Enabled</label>
                  <p className="text-xs text-gray-500">Enable Stripe payments</p>
                </div>
                {renderSettingItem("paymentSettings", "stripeEnabled", "Stripe Enabled", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">PayPal Enabled</label>
                  <p className="text-xs text-gray-500">Enable PayPal payments</p>
                </div>
                {renderSettingItem("paymentSettings", "paypalEnabled", "PayPal Enabled", "switch")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Platform Fee (%)</label>
                {renderSettingItem("paymentSettings", "platformFee", "Platform Fee", "number")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Payout Schedule</label>
                {renderSettingItem("paymentSettings", "instructorPayoutSchedule", "Payout Schedule", "select", [
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" }
                ])}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Minimum Payout ($)</label>
                {renderSettingItem("paymentSettings", "minimumPayout", "Minimum Payout", "number")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable Refunds</label>
                  <p className="text-xs text-gray-500">Allow course refunds</p>
                </div>
                {renderSettingItem("paymentSettings", "enableRefunds", "Enable Refunds", "switch")}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                  <p className="text-xs text-gray-500">Send email notifications</p>
                </div>
                {renderSettingItem("notificationSettings", "emailNotifications", "Email Notifications", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                  <p className="text-xs text-gray-500">Send push notifications</p>
                </div>
                {renderSettingItem("notificationSettings", "pushNotifications", "Push Notifications", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Course Updates</label>
                  <p className="text-xs text-gray-500">Notify about course updates</p>
                </div>
                {renderSettingItem("notificationSettings", "courseUpdates", "Course Updates", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">New Enrollments</label>
                  <p className="text-xs text-gray-500">Notify about new enrollments</p>
                </div>
                {renderSettingItem("notificationSettings", "newEnrollments", "New Enrollments", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Confirmations</label>
                  <p className="text-xs text-gray-500">Send payment confirmations</p>
                </div>
                {renderSettingItem("notificationSettings", "paymentConfirmations", "Payment Confirmations", "switch")}
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>System Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                  <p className="text-xs text-gray-500">Put platform in maintenance mode</p>
                </div>
                {renderSettingItem("systemSettings", "maintenanceMode", "Maintenance Mode", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Debug Mode</label>
                  <p className="text-xs text-gray-500">Enable debug logging</p>
                </div>
                {renderSettingItem("systemSettings", "debugMode", "Debug Mode", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Cache Enabled</label>
                  <p className="text-xs text-gray-500">Enable system caching</p>
                </div>
                {renderSettingItem("systemSettings", "cacheEnabled", "Cache Enabled", "switch")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">CDN Enabled</label>
                  <p className="text-xs text-gray-500">Use CDN for assets</p>
                </div>
                {renderSettingItem("systemSettings", "cdnEnabled", "CDN Enabled", "switch")}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Backup Frequency</label>
                {renderSettingItem("systemSettings", "backupFrequency", "Backup Frequency", "select", [
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" }
                ])}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Log Retention (days)</label>
                {renderSettingItem("systemSettings", "logRetention", "Log Retention", "number")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">System Online</div>
                  <div className="text-sm text-green-600">All services operational</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Database</div>
                  <div className="text-sm text-blue-600">Connected & healthy</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Globe2 className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900">CDN</div>
                  <div className="text-sm text-purple-600">Active & optimized</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 