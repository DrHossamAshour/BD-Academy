"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  GraduationCap,
  BookOpen,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock user data
const usersData = {
  totalUsers: 2847,
  activeUsers: 1847,
  newThisMonth: 234,
  premiumUsers: 892,
  users: [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "student",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-03-20",
      coursesEnrolled: 5,
      coursesCompleted: 3,
      totalSpent: 1247,
      avatar: "SJ",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      verified: true
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "michael.chen@email.com",
      role: "instructor",
      status: "active",
      joinDate: "2023-08-22",
      lastActive: "2024-03-20",
      coursesCreated: 8,
      studentsEnrolled: 342,
      totalEarnings: 28470,
      avatar: "MC",
      phone: "+1 (555) 234-5678",
      location: "Los Angeles, CA",
      verified: true
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      role: "student",
      status: "active",
      joinDate: "2024-02-10",
      lastActive: "2024-03-19",
      coursesEnrolled: 3,
      coursesCompleted: 1,
      totalSpent: 897,
      avatar: "ER",
      phone: "+1 (555) 345-6789",
      location: "Chicago, IL",
      verified: false
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      email: "james.wilson@email.com",
      role: "instructor",
      status: "pending",
      joinDate: "2024-03-01",
      lastActive: "2024-03-18",
      coursesCreated: 2,
      studentsEnrolled: 45,
      totalEarnings: 3240,
      avatar: "JW",
      phone: "+1 (555) 456-7890",
      location: "Houston, TX",
      verified: false
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      email: "lisa.thompson@email.com",
      role: "student",
      status: "inactive",
      joinDate: "2023-11-05",
      lastActive: "2024-02-15",
      coursesEnrolled: 2,
      coursesCompleted: 0,
      totalSpent: 598,
      avatar: "LT",
      phone: "+1 (555) 567-8901",
      location: "Phoenix, AZ",
      verified: true
    },
    {
      id: 6,
      name: "Dr. Robert Davis",
      email: "robert.davis@email.com",
      role: "admin",
      status: "active",
      joinDate: "2023-01-10",
      lastActive: "2024-03-20",
      coursesCreated: 0,
      studentsEnrolled: 0,
      totalEarnings: 0,
      avatar: "RD",
      phone: "+1 (555) 678-9012",
      location: "Miami, FL",
      verified: true
    }
  ]
};

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);

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

  const filteredUsers = usersData.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case "instructor":
        return <Badge className="bg-blue-100 text-blue-800">Instructor</Badge>;
      case "student":
        return <Badge className="bg-green-100 text-green-800">Student</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getRoleStats = () => {
    const stats = { students: 0, instructors: 0, admins: 0 };
    usersData.users.forEach(user => {
      if (user.role === "student") stats.students++;
      else if (user.role === "instructor") stats.instructors++;
      else if (user.role === "admin") stats.admins++;
    });
    return stats;
  };

  const roleStats = getRoleStats();

  const stats = [
    {
      title: "Total Users",
      value: usersData.totalUsers.toLocaleString(),
      change: `+${usersData.newThisMonth}`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: usersData.activeUsers.toLocaleString(),
      change: "+12%",
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      title: "Premium Users",
      value: usersData.premiumUsers.toLocaleString(),
      change: "+8%",
      icon: Shield,
      color: "text-purple-600"
    },
    {
      title: "Pending Approvals",
      value: "23",
      change: "5 require attention",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c4a86a] to-[#b39a5c] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/dashboard/admin">
                  <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">User Management</h1>
              <p className="text-xl opacity-90">Manage all platform users, roles, and permissions</p>
            </div>
            <Button className="bg-white text-[#c4a86a] hover:bg-gray-100">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change} from last month</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Distribution */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{roleStats.students}</div>
                <p className="text-sm text-gray-600">Total registered students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Instructors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{roleStats.instructors}</div>
                <p className="text-sm text-gray-600">Active course creators</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Administrators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{roleStats.admins}</div>
                <p className="text-sm text-gray-600">Platform administrators</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="instructor">Instructors</option>
                    <option value="admin">Admins</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d8bf78]"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Users Table */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#d8bf78] rounded-full flex items-center justify-center text-white font-semibold">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.role === "student" ? (
                            <div>
                              <div>{user.coursesEnrolled} enrolled</div>
                              <div className="text-gray-500">{user.coursesCompleted} completed</div>
                            </div>
                          ) : user.role === "instructor" ? (
                            <div>
                              <div>{user.coursesCreated} courses</div>
                              <div className="text-gray-500">{user.studentsEnrolled} students</div>
                            </div>
                          ) : (
                            <div className="text-gray-500">Admin</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
} 