"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Shield,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Monitor,
  BookOpen,
} from "lucide-react";

const CBTLandingPage = () => {
  const [hoveredCard, setHoveredCard] = useState<any>(null);

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Timed Examinations",
      description: "Automated time management with real-time countdown",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Instant Results",
      description: "Get immediate feedback and detailed performance analytics",
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Advanced security measures to ensure exam integrity",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Question Bank",
      description: "Comprehensive question database with multiple formats",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80  rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96  rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <GraduationCap className="w-8 h-8 text-black" />
            </div>
            <span className="text-2xl font-bold text-black">EduTest Pro</span>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-10">
            <h1 className="text-6xl md:text-7xl font-bold text-black leading-tight">
              TEST-Gen
              {/* <span className="block  bg-clip-text ">CBT Platform</span> */}
            </h1>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the future of computer-based testing with our advanced, secure, and
              user-friendly examination platform.
            </p>
          </div>

          {/* Login Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
            {/* Admin Login Card */}
            <div
              className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:rotate-1 cursor-pointer"
              onMouseEnter={() => setHoveredCard("admin")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Admin Portal</h3>
                <p className="text-black/70 mb-6 leading-relaxed">
                  Manage examinations, create questions, monitor sessions, and generate
                  comprehensive reports.
                </p>
                <div className="flex items-center text-cyan-300 font-semibold group-hover:text-cyan-200 transition-colors">
                  Access Admin Panel
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full transform translate-x-8 translate-y-8"></div>
            </div>

            {/* Examiner Login Card */}
            <div
              className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:-rotate-1 cursor-pointer"
              onMouseEnter={() => setHoveredCard("examiner")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Examiner Portal</h3>
                <p className="text-black/70 mb-6 leading-relaxed">
                  Take examinations, view results instantly, and track your performance across
                  multiple sessions.
                </p>
                <div className="flex items-center text-pink-300 font-semibold group-hover:text-pink-200 transition-colors">
                  Start Examination
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full transform translate-x-8 translate-y-8"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 mt-20">
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8">
          <div className="text-center text-black/60">
            <p>&copy; 2025 EduTest Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CBTLandingPage;
