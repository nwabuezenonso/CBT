"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  FileText,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";
import { RenderDashboard } from "@/features/dashboard/dashboard";
import {RenderSettings} from "@/features/setting/setting";
import {RenderExams} from "@/features/examManager/exams";
import {User} from "@/features/userManager/user"

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



const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

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
      
  const stats = {
    totalQuestions: questions.length,
    totalExams: exams.length,
    activeExams: exams.filter((e) => e.status === "active").length,
    totalExaminees: exams.reduce((sum, exam) => sum + exam.examinees, 0),
  };

  const QuestionForm: React.FC = () => {
    const [formData, setFormData] = useState({
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 10,
      difficulty: "easy",
      subject: "",
      tags: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newQuestion: Question = {
        id: Date.now().toString(),
        type: formData.type as Question["type"],
        question: formData.question,
        options:
          formData.type === "multiple-choice"
            ? formData.options.filter((opt) => opt.trim())
            : undefined,
        correctAnswer: formData.correctAnswer,
        points: formData.points,
        difficulty: formData.difficulty as Question["difficulty"],
        subject: formData.subject,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        createdAt: new Date().toISOString().split("T")[0],
      };

      setQuestions([...questions, newQuestion]);
      setShowQuestionModal(false);
      setFormData({
        type: "multiple-choice",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 10,
        difficulty: "easy",
        subject: "",
        tags: "",
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Add New Question</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Question Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="essay">Essay</option>
                <option value="fill-blank">Fill in the Blank</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Question</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
            </div>

            {formData.type === "multiple-choice" && (
              <div>
                <label className="block text-sm font-medium mb-2">Options</label>
                {formData.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index] = e.target.value;
                      setFormData({ ...formData, options: newOptions });
                    }}
                  />
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Correct Answer</label>
              {formData.type === "true-false" ? (
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  required
                >
                  <option value="">Select...</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  required
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Points</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
              >
                Add Question
              </button>
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };




 

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    
    { id: "exams", label: "Exams", icon: CheckCircle },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">CBT Admin</h1>
          <p className="text-sm text-gray-600">Test Management System</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {tabs.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-600">Manage your CBT system</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <span className="text-sm font-medium">Admin User</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === "dashboard" && <RenderDashboard />}
        
          {activeTab === "exams" && <RenderExams/>}
          {activeTab === "users" && <User/>}
          {activeTab === "settings" && <RenderSettings/>}
        </main>
      </div>

      {/* Question Modal */}
      {showQuestionModal && <QuestionForm />}

      {/* Exam Modal Placeholder */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Create New Exam</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Exam Title</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    defaultValue="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Questions</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    defaultValue="20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"></textarea>
              </div>
            </div>
            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setShowExamModal(false)}
                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
              >
                Create Exam
              </button>
              <button
                onClick={() => setShowExamModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
