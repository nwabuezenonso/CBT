"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function AdminDashboard({ children }: { children: React.ReactNode }) {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);

  const pathname = usePathname();

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { id: "exams", label: "Exams", icon: CheckCircle, href: "/exams" },
    { id: "users", label: "Users", icon: Users, href: "/users" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
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
                <Link
                  href={tab.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    pathname === tab.href
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </Link>
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
                {tabs.find((tab) => tab.href === pathname)?.label || "Dashboard"}
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

        {/* Render active page */}
        <main className="p-6">{children}</main>
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Add New Question</h3>
            {/* Your Question form goes here */}
            <button
              onClick={() => setShowQuestionModal(false)}
              className="mt-4 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Exam Modal Placeholder */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Create New Exam</h3>
            {/* Your Exam form goes here */}
            <button
              onClick={() => setShowExamModal(false)}
              className="mt-4 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
