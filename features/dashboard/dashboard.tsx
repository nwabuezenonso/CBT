import { FileText, BarChart3, CheckCircle, Users } from "lucide-react";

import { useState } from "react";

interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "essay" | "fill-blank";
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
  tags: string[];
  createdAt: string;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  status: "draft" | "active" | "completed";
  createdAt: string;
  examinees: number;
}

export const RenderDashboard = () => {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: "1",
      title: "General Knowledge Test",
      subject: "General",
      duration: 60,
      totalQuestions: 20,
      status: "active",
      createdAt: "2024-01-10",
      examinees: 45,
    },
    {
      id: "2",
      title: "Computer Science Fundamentals",
      subject: "Computer Science",
      duration: 90,
      totalQuestions: 30,
      status: "draft",
      createdAt: "2024-01-12",
      examinees: 0,
    },
  ]);

  // Sample data
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "multiple-choice",
      question: "What is the capital of Nigeria?",
      options: ["Lagos", "Abuja", "Port Harcourt", "Kano"],
      correctAnswer: "Abuja",
      points: 10,
      difficulty: "easy",
      subject: "Geography",
      tags: ["nigeria", "capital", "africa"],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      type: "true-false",
      question: "JavaScript is a compiled language.",
      correctAnswer: "false",
      points: 5,
      difficulty: "medium",
      subject: "Computer Science",
      tags: ["javascript", "programming"],
      createdAt: "2024-01-14",
    },
  ]);

  const stats = {
    totalQuestions: questions.length,
    totalExams: exams.length,
    activeExams: exams.filter((e: any) => e.status === "active").length,
    totalExaminees: exams.reduce((sum: any, exam: any) => sum + exam.examinees, 0),
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Questions</p>
              <p className="text-3xl font-bold">{stats.totalQuestions}</p>
            </div>
            <FileText size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Exams</p>
              <p className="text-3xl font-bold">{stats.totalExams}</p>
            </div>
            <BarChart3 size={40} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Active Exams</p>
              <p className="text-3xl font-bold">{stats.activeExams}</p>
            </div>
            <CheckCircle size={40} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Examinees</p>
              <p className="text-3xl font-bold">{stats.totalExaminees}</p>
            </div>
            <Users size={40} className="text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Questions</h3>
          <div className="space-y-3">
            {questions.slice(0, 5).map((question: any) => (
              <div
                key={question.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{question.question.substring(0, 50)}...</p>
                  <p className="text-xs text-gray-500">
                    {question.subject} • {question.difficulty}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    question.type === "multiple-choice"
                      ? "bg-blue-100 text-blue-800"
                      : question.type === "true-false"
                      ? "bg-green-100 text-green-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {question.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Exams</h3>
          <div className="space-y-3">
            {exams.slice(0, 5).map((exam: any) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{exam.title}</p>
                  <p className="text-xs text-gray-500">
                    {exam.subject} • {exam.totalQuestions} questions
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    exam.status === "active"
                      ? "bg-green-100 text-green-800"
                      : exam.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {exam.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
