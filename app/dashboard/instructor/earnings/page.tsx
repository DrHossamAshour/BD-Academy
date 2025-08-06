"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  CreditCard,
  Banknote,
  Wallet,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock earnings data
const earningsData = {
  overview: {
    totalEarnings: 45680,
    thisMonth: 8920,
    lastMonth: 7840,
    pendingPayout: 3240,
    totalPayouts: 42440,
    growth: 13.8
  },
  monthlyEarnings: [
    { month: "Jan", earnings: 4200, payouts: 3800, pending: 400 },
    { month: "Feb", earnings: 5800, payouts: 5200, pending: 600 },
    { month: "Mar", earnings: 7200, payouts: 6800, pending: 400 },
    { month: "Apr", earnings: 8900, payouts: 8200, pending: 700 },
    { month: "May", earnings: 10200, payouts: 9600, pending: 600 },
    { month: "Jun", earnings: 11800, payouts: 11200, pending: 600 },
    { month: "Jul", earnings: 13200, payouts: 12600, pending: 600 },
    { month: "Aug", earnings: 14800, payouts: 14000, pending: 800 },
    { month: "Sep", earnings: 16200, payouts: 15400, pending: 800 },
    { month: "Oct", earnings: 17800, payouts: 16800, pending: 1000 },
    { month: "Nov", earnings: 19500, payouts: 18500, pending: 1000 },
    { month: "Dec", earnings: 21400, payouts: 20200, pending: 1200 }
  ],
  courseEarnings: [
    {
      id: 1,
      title: "Advanced Dental Implantology",
      earnings: 13680,
      sales: 456,
      commission: 70,
      thisMonth: 2840
    },
    {
      id: 2,
      title: "Modern Orthodontic Techniques",
      earnings: 7780,
      sales: 389,
      commission: 70,
      thisMonth: 1620
    },
    {
      id: 3,
      title: "Cosmetic Dentistry Masterclass",
      earnings: 8100,
      sales: 324,
      commission: 70,
      thisMonth: 1680
    },
    {
      id: 4,
      title: "Endodontic Excellence",
      earnings: 5364,
      sales: 298,
      commission: 70,
      thisMonth: 1120
    },
    {
      id: 5,
      title: "Periodontal Surgery",
      earnings: 5340,
      sales: 267,
      commission: 70,
      thisMonth: 1080
    }
  ],
  recentTransactions: [
    {
      id: 1,
      type: "sale",
      course: "Advanced Dental Implantology",
      amount: 299,
      commission: 209.30,
      date: "2024-01-15",
      status: "completed",
      student: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      type: "sale",
      course: "Modern Orthodontic Techniques",
      amount: 199,
      commission: 139.30,
      date: "2024-01-14",
      status: "completed",
      student: "Dr. Michael Chen"
    },
    {
      id: 3,
      type: "refund",
      course: "Cosmetic Dentistry Masterclass",
      amount: -299,
      commission: -209.30,
      date: "2024-01-13",
      status: "completed",
      student: "Dr. Emily Rodriguez"
    },
    {
      id: 4,
      type: "sale",
      course: "Endodontic Excellence",
      amount: 179,
      commission: 125.30,
      date: "2024-01-12",
      status: "pending",
      student: "Dr. James Wilson"
    },
    {
      id: 5,
      type: "sale",
      course: "Periodontal Surgery",
      amount: 199,
      commission: 139.30,
      date: "2024-01-11",
      status: "completed",
      student: "Dr. Lisa Thompson"
    }
  ],
  payoutHistory: [
    {
      id: 1,
      amount: 8200,
      date: "2024-01-01",
      method: "Bank Transfer",
      status: "completed",
      reference: "PAY-2024-001"
    },
    {
      id: 2,
      amount: 7600,
      date: "2023-12-01",
      method: "Bank Transfer",
      status: "completed",
      reference: "PAY-2023-012"
    },
    {
      id: 3,
      amount: 7200,
      date: "2023-11-01",
      method: "PayPal",
      status: "completed",
      reference: "PAY-2023-011"
    }
  ]
};

export default function EarningsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("30d");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "instructor") {
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

  if (!session?.user || session.user.role !== "instructor") {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === "sale" ? (
      <ArrowUp className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDown className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Earnings Dashboard</h1>
              <p className="text-gray-600">Track your revenue, commissions, and payment history</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Link href="/dashboard/instructor">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earningsData.overview.totalEarnings.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600 ml-1">
                      {earningsData.overview.growth}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earningsData.overview.thisMonth.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    vs ${earningsData.overview.lastMonth.toLocaleString()} last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payout</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earningsData.overview.pendingPayout.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Next payout: Jan 31, 2024
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earningsData.overview.totalPayouts.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    All time payouts
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Earnings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Course Earnings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.courseEarnings.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{course.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{course.sales} sales</span>
                          <span>{course.commission}% commission</span>
                          <span>This month: ${course.thisMonth.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${course.earnings.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">total earnings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payout History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Recent Payouts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.payoutHistory.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-semibold text-gray-800">${payout.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{payout.date}</p>
                        <p className="text-xs text-gray-400">{payout.reference}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(payout.status)}
                        <p className="text-sm text-gray-500 mt-1">{payout.method}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Commission Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Commission Structure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Course Sales</span>
                    <span className="font-semibold text-green-600">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Platform Fee</span>
                    <span className="font-semibold text-gray-600">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Payouts are processed monthly on the 1st of each month.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Recent Transactions</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Commission</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningsData.recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getTransactionIcon(transaction.type)}
                            <span className="capitalize">{transaction.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{transaction.course}</td>
                        <td className="py-3 px-4 text-gray-600">{transaction.student}</td>
                        <td className="py-3 px-4">
                          <span className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                            ${Math.abs(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={transaction.commission >= 0 ? "text-green-600" : "text-red-600"}>
                            ${Math.abs(transaction.commission)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(transaction.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Chart Placeholder */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Monthly Earnings Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Monthly earnings and payout trends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 