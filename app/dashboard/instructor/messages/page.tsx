"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Search,
  Send,
  Reply,
  Archive,
  Trash2,
  Star,
  Clock,
  User,
  Mail,
  Filter,
  MoreHorizontal,
  ArrowLeft,
  Paperclip,
  Smile
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock messages data
const messagesData = {
  inbox: [
    {
      id: 1,
      from: "Dr. Sarah Johnson",
      subject: "Question about Advanced Dental Implantology course",
      preview: "Hi, I'm having trouble understanding the surgical techniques in module 3...",
      timestamp: "2 minutes ago",
      isRead: false,
      isStarred: true,
      course: "Advanced Dental Implantology",
      avatar: "SJ"
    },
    {
      id: 2,
      from: "Dr. Michael Chen",
      subject: "Course completion certificate",
      preview: "I've completed the Modern Orthodontic Techniques course and would like...",
      timestamp: "1 hour ago",
      isRead: true,
      isStarred: false,
      course: "Modern Orthodontic Techniques",
      avatar: "MC"
    },
    {
      id: 3,
      from: "Dr. Emily Rodriguez",
      subject: "Technical issue with video playback",
      preview: "The videos in the Cosmetic Dentistry Masterclass are not loading properly...",
      timestamp: "3 hours ago",
      isRead: true,
      isStarred: false,
      course: "Cosmetic Dentistry Masterclass",
      avatar: "ER"
    },
    {
      id: 4,
      from: "Dr. James Wilson",
      subject: "Request for additional resources",
      preview: "Could you provide more case studies for the Endodontic Excellence course?",
      timestamp: "1 day ago",
      isRead: false,
      isStarred: false,
      course: "Endodontic Excellence",
      avatar: "JW"
    },
    {
      id: 5,
      from: "Dr. Lisa Thompson",
      subject: "Feedback on course content",
      preview: "I really enjoyed the Periodontal Surgery course. The practical examples were...",
      timestamp: "2 days ago",
      isRead: true,
      isStarred: true,
      course: "Periodontal Surgery",
      avatar: "LT"
    }
  ],
  selectedMessage: {
    id: 1,
    from: "Dr. Sarah Johnson",
    email: "sarah.johnson@email.com",
    subject: "Question about Advanced Dental Implantology course",
    content: `Hi there,

I'm currently enrolled in your Advanced Dental Implantology course and I'm having some difficulty understanding the surgical techniques covered in module 3. Specifically, the section on bone grafting procedures seems quite complex.

Could you please provide some additional clarification on:
1. The different types of bone grafts and when to use each
2. The step-by-step surgical protocol
3. Any common complications to watch out for

I've watched the videos multiple times but would appreciate some extra guidance.

Thank you for your time!

Best regards,
Dr. Sarah Johnson`,
    timestamp: "2 minutes ago",
    course: "Advanced Dental Implantology",
    avatar: "SJ"
  }
};

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedMessage, setSelectedMessage] = useState(messagesData.selectedMessage);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [replyText, setReplyText] = useState("");

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

  const filteredMessages = messagesData.inbox.filter(message => {
    const matchesSearch = message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "unread") return !message.isRead && matchesSearch;
    if (filter === "starred") return message.isStarred && matchesSearch;
    return matchesSearch;
  });

  const handleReply = () => {
    // Simulate sending reply
    alert("Reply sent successfully!");
    setReplyText("");
  };

  const handleMessageSelect = (message: any) => {
    // Convert inbox message to selected message format
    const selectedMsg = {
      id: message.id,
      from: message.from,
      email: `${message.from.toLowerCase().replace(' ', '.')}@email.com`,
      subject: message.subject,
      content: message.preview + "\n\nThis is a detailed message content that would be loaded from the database.",
      timestamp: message.timestamp,
      course: message.course,
      avatar: message.avatar
    };
    setSelectedMessage(selectedMsg);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/dashboard/instructor">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
              <p className="text-gray-600">Manage student communications and inquiries</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Archive className="w-4 h-4 mr-2" />
                Archive All
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Message List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === "unread" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("unread")}
                    >
                      Unread
                    </Button>
                    <Button
                      variant={filter === "starred" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("starred")}
                    >
                      Starred
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                      } ${!message.isRead ? 'bg-blue-50' : ''}`}
                      onClick={() => handleMessageSelect(message)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-[#d8bf78] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {message.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-semibold text-sm ${!message.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                              {message.from}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {message.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>
                          </div>
                          <p className={`text-sm font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {message.subject}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{message.preview}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {message.course}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#d8bf78] rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedMessage?.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedMessage?.from}</h3>
                      <p className="text-sm text-gray-500">{selectedMessage?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedMessage?.subject}</h2>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedMessage?.timestamp}
                    </span>
                    <Badge variant="outline">{selectedMessage?.course}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Message Content */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="whitespace-pre-wrap text-gray-800">
                      {selectedMessage?.content}
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Reply</h4>
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#d8bf78] focus:border-transparent"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Paperclip className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Smile className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={() => setReplyText("")}>
                            Cancel
                          </Button>
                          <Button 
                            className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                            onClick={handleReply}
                            disabled={!replyText.trim()}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 