"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { examService, type Exam, type Student, type ExamResult } from "@/services/examService";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Settings,
  LogOut,
  Award,
  TrendingUp,
  BarChart3,
  FileText,
} from "lucide-react";
import { ExamManagement } from "@/components/examiner/ExamManagement";
import { ExamineeManagement } from "@/components/examiner/ExamineeManagement";
import { ResultsAnalytics } from "@/components/examiner/ResultsAnalytics";
import { NotificationCenter } from "@/components/notification-center";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarToggle,
  SidebarNav,
  SidebarNavItem,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "exams", label: "Exams", icon: FileText },
  { id: "students", label: "Students", icon: Users },
  { id: "results", label: "Results", icon: Award },
];

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [activeSection, setActiveSection] = useState("overview");

  const loadData = async () => {
    if (user) {
       try {
         const fetchedExams = await examService.getExams();
         setExams(fetchedExams);
         setStudents(examService.getStudents());
         const fetchedResults = await examService.getExamResults();
         setResults(fetchedResults);
       } catch (error) {
         console.error("Failed to load data", error);
       }
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const refreshData = () => {
    loadData();
  };

  const totalStudents = students.length;
  const activeExams = exams.filter((e) => e.isActive).length;
  const completedExams = results.length;
  const averageScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
      : 0;

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{exams.length}</div>
                  <p className="text-xs text-muted-foreground">{activeExams} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedExams}</div>
                  <p className="text-xs text-muted-foreground">Total submissions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore}%</div>
                  <p className="text-xs text-muted-foreground">Across all exams</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Exams</CardTitle>
                  <CardDescription>Your latest created exams</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exams.slice(0, 5).map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{exam.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {exam.questions.length} questions • {exam.duration} min
                        </p>
                      </div>
                      <Badge variant={exam.isActive ? "default" : "secondary"}>
                        {exam.isActive ? "Active" : "Draft"}
                      </Badge>
                    </div>
                  ))}
                  {exams.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No exams created yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Results</CardTitle>
                  <CardDescription>Latest exam submissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.slice(0, 5).map((result) => (
                    <div key={result._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {typeof result.examineeId === 'object' ? (result.examineeId as any).name : 'Unknown Student'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exams.find((e) => e.id === (typeof result.examId === 'object' ? (result.examId as any)._id : result.examId))?.title || "Unknown Exam"}
                        </p>
                      </div>
                      <Badge variant={(result.percentage || 0) >= 70 ? "default" : "destructive"}>
                        {result.percentage || 0}%
                      </Badge>
                    </div>
                  ))}
                  {results.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No results yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "exams":
        return <ExamManagement exams={exams} onRefresh={refreshData} />;
      case "students":
        return <ExamineeManagement students={students} exams={exams} onRefresh={refreshData} />;
      case "results":
        return <ResultsAnalytics results={results} exams={exams} />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider defaultCollapsed={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CBT Pro Admin</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationCenter />
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          <Sidebar className="min-h-[calc(100vh-73px)]">
            <SidebarToggle />
            <SidebarContent>
              <SidebarNav>
                {sidebarItems.map((item) => (
                  <SidebarNavItem
                    key={item.id}
                    icon={item.icon}
                    active={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                  >
                    {item.label}
                  </SidebarNavItem>
                ))}
              </SidebarNav>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 p-6">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
