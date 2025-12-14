"use client";

import { useState } from "react";
import type { ExamResult, Exam } from "@/services/examService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Award, TrendingUp, Users, Clock } from "lucide-react";

interface ResultsAnalyticsProps {
  results: ExamResult[];
  exams: Exam[];
}

export function ResultsAnalytics({ results, exams }: ResultsAnalyticsProps) {
  const [selectedExam, setSelectedExam] = useState<string>("all");

  const filteredResults =
    selectedExam === "all" ? results : results.filter((r) => {
       const rExamId = typeof r.examId === 'object' ? (r.examId as any)._id || (r.examId as any).id : r.examId;
       return rExamId === selectedExam;
    });

  const getExamTitle = (examId: string) => {
    return exams.find((e) => e.id === examId)?.title || "Unknown Exam";
  };

  // Calculate statistics
  const averageScore =
    filteredResults.length > 0
      ? Math.round(
          filteredResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / filteredResults.length
        )
      : 0;

  const passRate =
    filteredResults.length > 0
      ? Math.round(
          (filteredResults.filter((r) => (r.percentage || 0) >= 70).length / filteredResults.length) * 100
        )
      : 0;
      
  const averageTime =
    filteredResults.length > 0
      ? Math.round(
          filteredResults.reduce((sum, r) => sum + ((r as any).timeSpent || 0), 0) / filteredResults.length
        )
      : 0;
  
  // Prepare chart data
  const scoreDistribution = [
    {
      range: "90-100%",
      count: filteredResults.filter((r) => (r.percentage || 0) >= 90).length,
      color: "#22c55e",
    },
    {
      range: "80-89%",
      count: filteredResults.filter((r) => (r.percentage || 0) >= 80 && (r.percentage || 0) < 90).length,
      color: "#84cc16",
    },
    {
      range: "70-79%",
      count: filteredResults.filter((r) => (r.percentage || 0) >= 70 && (r.percentage || 0) < 80).length,
      color: "#eab308",
    },
    {
      range: "60-69%",
      count: filteredResults.filter((r) => (r.percentage || 0) >= 60 && (r.percentage || 0) < 70).length,
      color: "#f97316",
    },
    {
      range: "Below 60%",
      count: filteredResults.filter((r) => (r.percentage || 0) < 60).length,
      color: "#ef4444",
    },
  ];

  const examPerformance = exams
    .map((exam) => {
      const examResults = results.filter((r) => {
          const rExamId = typeof r.examId === 'object' ? (r.examId as any)._id || (r.examId as any).id : r.examId;
          return rExamId === exam.id || rExamId === exam._id;
      });
      const avgScore =
        examResults.length > 0
          ? Math.round(examResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / examResults.length)
          : 0;

      return {
        name: exam.title.length > 20 ? exam.title.substring(0, 20) + "..." : exam.title,
        score: avgScore,
        submissions: examResults.length,
      };
    })
    .filter((item) => item.submissions > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Results & Analytics</h2>
          <p className="text-muted-foreground">Analyze exam performance and student results</p>
        </div>
        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select exam" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exams</SelectItem>
            {exams.map((exam) => (
              <SelectItem key={exam.id || exam._id} value={exam.id || exam._id}>
                {exam.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredResults.length}</div>
            <p className="text-xs text-muted-foreground">Exam attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <Progress value={averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate}%</div>
            <p className="text-xs text-muted-foreground">70% or above</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTime}m</div>
            <p className="text-xs text-muted-foreground">Per exam</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {filteredResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Distribution of student scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {examPerformance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Exam Performance</CardTitle>
                <CardDescription>Average scores by exam</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={examPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
          <CardDescription>Latest exam submissions and scores</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResults.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults
                  .sort(
                    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
                  )
                  .slice(0, 10)
                  .map((result) => {
                     const rExamId = typeof result.examId === 'object' ? (result.examId as any)._id || (result.examId as any).id : result.examId;
                     const studentName = typeof result.examineeId === 'object' ? (result.examineeId as any).name : 'Unknown Student';
                     const key = result._id; 
                     return (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{studentName}</TableCell>
                      <TableCell>{getExamTitle(rExamId)}</TableCell>
                      <TableCell>
                        {result.score}/{result.totalQuestions}
                      </TableCell>
                      <TableCell>
                        <Badge variant={(result.percentage || 0) >= 70 ? "default" : "destructive"}>
                          {result.percentage || 0}%
                        </Badge>
                      </TableCell>
                      <TableCell>{(result as any).timeSpent || 0} min</TableCell>
                      <TableCell>{new Date(result.submittedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  )})}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results yet</h3>
              <p className="text-muted-foreground">
                Results will appear here once students complete exams
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
