"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  BookOpen,
  Target,
  AlertTriangle,
  CheckCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Bell,
  Star
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock calendar events
const events = [
  {
    id: 1,
    title: "Advanced Implantology - Module 3 Due",
    type: "assignment",
    date: "2024-12-20",
    time: "23:59",
    course: "Advanced Dental Implantology",
    priority: "high",
    completed: false
  },
  {
    id: 2,
    title: "Study Session - Endodontics",
    type: "study",
    date: "2024-12-18",
    time: "14:00",
    course: "Endodontic Excellence",
    priority: "medium",
    completed: false
  },
  {
    id: 3,
    title: "Orthodontic Techniques - Final Exam",
    type: "exam",
    date: "2024-12-22",
    time: "10:00",
    course: "Modern Orthodontic Techniques",
    priority: "high",
    completed: false
  },
  {
    id: 4,
    title: "Weekly Progress Review",
    type: "review",
    date: "2024-12-19",
    time: "16:00",
    course: "All Courses",
    priority: "low",
    completed: false
  },
  {
    id: 5,
    title: "Cosmetic Dentistry - Module 2 Completed",
    type: "milestone",
    date: "2024-12-15",
    time: "15:30",
    course: "Cosmetic Dentistry Masterclass",
    priority: "medium",
    completed: true
  }
];

// Study schedule
const studySchedule = [
  {
    day: "Monday",
    time: "09:00 - 11:00",
    course: "Advanced Implantology",
    topic: "Module 3: Surgical Techniques"
  },
  {
    day: "Tuesday",
    time: "14:00 - 16:00",
    course: "Endodontic Excellence",
    topic: "Root Canal Procedures"
  },
  {
    day: "Wednesday",
    time: "10:00 - 12:00",
    course: "Periodontal Surgery",
    topic: "Gum Grafting Techniques"
  },
  {
    day: "Thursday",
    time: "15:00 - 17:00",
    course: "Orthodontic Techniques",
    topic: "Clear Aligner Protocols"
  },
  {
    day: "Friday",
    time: "11:00 - 13:00",
    course: "Cosmetic Dentistry",
    topic: "Smile Design Principles"
  }
];

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78]"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "student") {
    return null;
  }

  // Get current month events
  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentDate.getMonth() && 
           eventDate.getFullYear() === currentDate.getFullYear();
  });

  // Get upcoming events (next 7 days)
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case "assignment": return <BookOpen className="w-4 h-4" />;
      case "exam": return <Target className="w-4 h-4" />;
      case "study": return <Clock className="w-4 h-4" />;
      case "review": return <Star className="w-4 h-4" />;
      case "milestone": return <CheckCircle className="w-4 h-4" />;
      default: return <CalendarDays className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "assignment": return "bg-blue-100 text-blue-800";
      case "exam": return "bg-red-100 text-red-800";
      case "study": return "bg-green-100 text-green-800";
      case "review": return "bg-purple-100 text-purple-800";
      case "milestone": return "bg-[#d8bf78] text-white";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Study Calendar</h1>
              <p className="text-gray-600">Manage your study schedule and track important deadlines</p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
              <Link href="/dashboard/student">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Simple Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
                      {day}
                    </div>
                  ))}
                  {/* Calendar days would go here - simplified for demo */}
                  {Array.from({ length: 35 }, (_, i) => (
                    <div key={i} className="p-2 text-center text-sm border border-gray-200 min-h-[60px] flex flex-col">
                      <span className="text-gray-800">{i + 1}</span>
                      {currentMonthEvents.filter(event => {
                        const eventDate = new Date(event.date);
                        return eventDate.getDate() === i + 1;
                      }).map(event => (
                        <div key={event.id} className="w-2 h-2 rounded-full bg-[#d8bf78] mx-auto mt-1"></div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-800">{event.title}</h4>
                        <p className="text-xs text-gray-600">{event.course}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </span>
                          <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                            {event.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No upcoming events
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Study Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Weekly Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studySchedule.map((session, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-[#d8bf78] rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-800">{session.day}</h4>
                        <p className="text-xs text-gray-600">{session.time}</p>
                        <p className="text-xs text-[#d8bf78] font-medium">{session.course}</p>
                        <p className="text-xs text-gray-500">{session.topic}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Events List */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className={`p-3 rounded-lg ${getEventTypeColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        {event.completed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{event.course}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </span>
                        <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      {!event.completed && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 