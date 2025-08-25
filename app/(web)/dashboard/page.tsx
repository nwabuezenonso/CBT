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

  const renderQuestions = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Question Bank</h2>
        <button
          onClick={() => setShowQuestionModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Question
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Question</th>
                <th className="text-left p-4 font-medium text-gray-700">Type</th>
                <th className="text-left p-4 font-medium text-gray-700">Subject</th>
                <th className="text-left p-4 font-medium text-gray-700">Difficulty</th>
                <th className="text-left p-4 font-medium text-gray-700">Points</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions
                .filter((q) => q.question.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((question) => (
                  <tr key={question.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="max-w-md">
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {question.tags.map((tag) => `#${tag}`).join(" ")}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4 text-gray-700">{question.subject}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          question.difficulty === "easy"
                            ? "bg-green-100 text-green-800"
                            : question.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{question.points}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-500 hover:text-blue-600">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-blue-600">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderExams = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Exam Management</h2>
        <button
          onClick={() => setShowExamModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Exam
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Exam Title</th>
                <th className="text-left p-4 font-medium text-gray-700">Subject</th>
                <th className="text-left p-4 font-medium text-gray-700">Duration</th>
                <th className="text-left p-4 font-medium text-gray-700">Questions</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Examinees</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-gray-500">Created: {exam.createdAt}</p>
                  </td>
                  <td className="p-4 text-gray-700">{exam.subject}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-gray-400" />
                      <span>{exam.duration} min</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{exam.totalQuestions}</td>
                  <td className="p-4">
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
                  </td>
                  <td className="p-4 font-medium">{exam.examinees}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-500 hover:text-blue-600">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-blue-600">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-green-600">
                        <Download size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Exam Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Default Exam Duration (minutes)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                defaultValue="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Questions per Page</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>1</option>
                <option>5</option>
                <option>10</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="shuffle" defaultChecked />
              <label htmlFor="shuffle" className="text-sm">
                Shuffle questions by default
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="timer" defaultChecked />
              <label htmlFor="timer" className="text-sm">
                Show timer during exam
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="proctoring" />
              <label htmlFor="proctoring" className="text-sm">
                Enable webcam proctoring
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="lockdown" />
              <label htmlFor="lockdown" className="text-sm">
                Browser lockdown mode
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="plagiarism" />
              <label htmlFor="plagiarism" className="text-sm">
                Plagiarism detection
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                defaultValue="3"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="email-results" defaultChecked />
              <label htmlFor="email-results" className="text-sm">
                Email results to examinees
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="admin-alerts" defaultChecked />
              <label htmlFor="admin-alerts" className="text-sm">
                Admin alerts for suspicious activity
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="completion-notify" />
              <label htmlFor="completion-notify" className="text-sm">
                Notify when exam is completed
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">System Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">System Language</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>WAT (West Africa Time)</option>
                <option>GMT (Greenwich Mean Time)</option>
                <option>UTC (Coordinated Universal Time)</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "questions", label: "Questions", icon: FileText },
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
          {activeTab === "questions" && renderQuestions()}
          {activeTab === "exams" && renderExams()}
          {activeTab === "users" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">User Management</h2>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">User Management</h3>
                  <p className="text-gray-500">Manage examinees, proctors, and admin users</p>
                  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add User
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === "settings" && renderSettings()}
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
