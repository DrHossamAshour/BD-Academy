"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Star,
  Award,
  BarChart3,
  Goal
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock goals data
const goals = [
  {
    id: 1,
    title: "Complete Advanced Implantology Course",
    description: "Finish the 12-hour course with at least 90% score",
    targetDate: "2024-12-31",
    progress: 85,
    category: "Learning",
    priority: "High",
    status: "in-progress",
    milestones: [
      { id: 1, title: "Complete Module 1", completed: true },
      { id: 2, title: "Complete Module 2", completed: true },
      { id: 3, title: "Complete Module 3", completed: false },
      { id: 4, title: "Pass Final Exam", completed: false }
    ]
  },
  {
    id: 2,
    title: "Earn 5 Certificates",
    description: "Complete 5 dental courses and earn certificates",
    targetDate: "2024-06-30",
    progress: 60,
    category: "Achievement",
    priority: "Medium",
    status: "in-progress",
    milestones: [
      { id: 1, title: "Advanced Implantology ✓", completed: true },
      { id: 2, title: "Orthodontic Techniques ✓", completed: true },
      { id: 3, title: "Cosmetic Dentistry ✓", completed: true },
      { id: 4, title: "Endodontic Excellence", completed: false },
      { id: 5, title: "Periodontal Surgery", completed: false }
    ]
  },
  {
    id: 3,
    title: "Study 2 Hours Daily",
    description: "Maintain consistent daily study routine",
    targetDate: "2024-12-31",
    progress: 75,
    category: "Habit",
    priority: "High",
    status: "in-progress",
    milestones: [
      { id: 1, title: "Week 1: 14/14 hours ✓", completed: true },
      { id: 2, title: "Week 2: 12/14 hours ✓", completed: true },
      { id: 3, title: "Week 3: 10/14 hours", completed: false },
      { id: 4, title: "Week 4: 0/14 hours", completed: false }
    ]
  }
];

// Completed goals
const completedGoals = [
  {
    id: 4,
    title: "Complete Basic Dental Course",
    description: "Finish the foundational dental course",
    completionDate: "2024-11-15",
    category: "Learning",
    finalScore: 95,
    timeSpent: 8
  },
  {
    id: 5,
    title: "Join Study Group",
    description: "Participate in online study community",
    completionDate: "2024-10-20",
    category: "Community",
    finalScore: 100,
    timeSpent: 2
  }
];

export default function GoalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "Learning",
    priority: "Medium"
  });

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

  const totalGoals = goals.length + completedGoals.length;
  const completedCount = completedGoals.length;
  const inProgressCount = goals.length;
  const averageProgress = Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);

  const handleAddGoal = () => {
    // In a real app, this would save to database
    console.log("Adding new goal:", newGoal);
    setShowAddGoal(false);
    setNewGoal({ title: "", description: "", targetDate: "", category: "Learning", priority: "Medium" });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Learning": return <BookOpen className="w-4 h-4" />;
      case "Achievement": return <Trophy className="w-4 h-4" />;
      case "Habit": return <Target className="w-4 h-4" />;
      case "Community": return <Star className="w-4 h-4" />;
      default: return <Goal className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Goals & Progress</h1>
              <p className="text-gray-600">Set goals, track progress, and celebrate achievements</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowAddGoal(true)}
                className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
              <Link href="/dashboard/student">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#d8bf78] rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Goals</p>
                  <p className="text-2xl font-bold text-gray-800">{totalGoals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-800">{inProgressCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-800">{averageProgress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Enter your goal title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Describe your goal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleAddGoal} className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white">
                  Add Goal
                </Button>
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Goals */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getCategoryIcon(goal.category)}
                        <Badge variant="outline">{goal.category}</Badge>
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <p className="text-gray-600 text-sm mt-2">{goal.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-blue-600">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Target Date:</span>
                      <span className="font-semibold">
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Milestones:</p>
                      {goal.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center space-x-2 text-sm">
                          {milestone.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                          )}
                          <span className={milestone.completed ? "line-through text-gray-500" : ""}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Goals */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Completed Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    {getCategoryIcon(goal.category)}
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <p className="text-gray-600 text-sm">{goal.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold">
                        {new Date(goal.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-semibold text-green-600">{goal.finalScore}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Time Spent:</span>
                      <span className="font-semibold">{goal.timeSpent}h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-[#d8bf78]" />
                      <span className="text-sm text-[#d8bf78] font-semibold">Achievement Unlocked!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 