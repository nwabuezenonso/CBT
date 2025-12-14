"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

import { examService, type Exam, type Student, type ExamResult } from "@/services/examService";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, TrendingUp, BarChart3, FileText } from "lucide-react";

export function Overview() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [results, setResults] = useState<ExamResult[]>([]);

  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const [fetchedExams, fetchedResults] = await Promise.all([
            examService.getExams(),
            examService.getExamResults()
          ]);
          setExams(fetchedExams);
          setStudents(examService.getStudents());
          setResults(fetchedResults);
        } catch (error) {
          console.error("Failed to fetch overview data", error);
        }
      }
    }
    fetchData();
  }, [user]);

  const totalStudents = students.length;
  const activeExams = exams.filter((e) => e.isActive).length;
  const completedExams = results.length;
  const averageScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
      : 0;

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
            {results.slice(0, 5).map((result) => {
               const studentName = typeof result.examineeId === 'object' && result.examineeId 
                  ? (result.examineeId as any).name 
                  : 'Unknown Student';
               
               const examTitle = typeof result.examId === 'object' && result.examId
                  ? (result.examId as any).title
                  : (exams.find((e) => e.id === result.examId) || exams.find((e) => e._id === result.examId))?.title || "Unknown Exam";
                
               const percentage = result.percentage ?? (result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0);

               return (
              <div key={result._id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    {examTitle}
                  </p>
                </div>
                <Badge variant={percentage >= 70 ? "default" : "destructive"}>
                  {percentage}%
                </Badge>
              </div>
            )})}
            {results.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No results yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
