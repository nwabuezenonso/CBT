"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { examService, type Exam, type ExamResult } from "@/services/examService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, LogOut, Play, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { NotificationCenter } from "@/components/notification-center";

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const [assignedExams, setAssignedExams] = useState<Exam[]>([]);
  const [completedResults, setCompletedResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = () => {
    if (!user) return;

    // Get assigned exam IDs
    const assignedExamIds = JSON.parse(localStorage.getItem(`student_exams_${user.id}`) || "[]");

    // Get exam details
    const allExams = examService.getExams();
    const studentExams = allExams.filter(
      (exam) => assignedExamIds.includes(exam.id) && exam.isActive
    );

    // Get completed results for this student
    const allResults = examService.getExamResults();
    const studentResults = allResults.filter((result) => result.studentId === user.id);

    setAssignedExams(studentExams);
    setCompletedResults(studentResults);
    setLoading(false);
  };

  const getExamStatus = (examId: string) => {
    const result = completedResults.find((r) => r.examId === examId);
    return result ? "completed" : "pending";
  };

  const getExamResult = (examId: string) => {
    return completedResults.find((r) => r.examId === examId);
  };

  const pendingExams = assignedExams.filter((exam) => getExamStatus(exam.id) === "pending");
  const completedExams = assignedExams.filter((exam) => getExamStatus(exam.id) === "completed");

  const averageScore =
    completedResults.length > 0
      ? Math.round(
          completedResults.reduce((sum, r) => sum + r.percentage, 0) / completedResults.length
        )
      : 0;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CBT Pro Student</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationCenter />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedExams.length}</div>
              <p className="text-xs text-muted-foreground">{pendingExams.length} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedExams.length}</div>
              <p className="text-xs text-muted-foreground">Exams finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignedExams.length > 0
                  ? Math.round((completedExams.length / assignedExams.length) * 100)
                  : 0}
                %
              </div>
              <Progress
                value={
                  assignedExams.length > 0
                    ? (completedExams.length / assignedExams.length) * 100
                    : 0
                }
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Pending Exams */}
        {pendingExams.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bold">Pending Exams</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingExams.map((exam) => (
                <Card key={exam.id} className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{exam.title}</CardTitle>
                        <CardDescription className="mt-1">{exam.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {exam.questions.length} questions
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {exam.duration} min
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Points: {exam.totalPoints}</span>
                    </div>

                    <Link href={`/exam/${exam.id}`}>
                      <Button className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Start Exam
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Exams */}
        {completedExams.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-2xl font-bold">Completed Exams</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedExams.map((exam) => {
                const result = getExamResult(exam.id)!;
                return (
                  <Card key={exam.id} className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{exam.title}</CardTitle>
                          <CardDescription className="mt-1">{exam.description}</CardDescription>
                        </div>
                        <Badge variant={result.percentage >= 70 ? "default" : "destructive"}>
                          {result.percentage}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          {result.score}/{result.totalPoints} points
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {result.timeSpent} min
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Score</span>
                          <span className="font-medium">{result.percentage}%</span>
                        </div>
                        <Progress value={result.percentage} />
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Completed on {new Date(result.completedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* No Exams State */}
        {assignedExams.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No exams assigned</h3>
              <p className="text-muted-foreground">
                Your instructor hasn't assigned any exams yet. Check back later!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
