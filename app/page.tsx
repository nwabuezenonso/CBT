"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  BookOpen,
  Shield,
  Award,
  BarChart3,
  Users,
  Zap,
  Bell,
  Gift,
  Calendar,
  Layers,
  Smartphone,
  PieChart
} from "lucide-react";
import Link from "next/link";
import FlowDemo from "@/components/landing/FlowDemo";

const CBTWaitlistPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Email capture logic removed as per new flow focus, but can be re-added if needed for newsletters
  
  const features = [
    {
      icon: Shield,
      title: "Secure Exams",
      description: "Advanced proctoring and browser lockdown for credible assessments.",
      color: "blue"
    },
    {
      icon: Layers,
      title: "Question Bank",
      description: "Create, organize and reuse questions across multiple exams easily.",
      color: "purple"
    },
    {
      icon: PieChart,
      title: "Instant Analytics",
      description: "Get detailed performance reports immediately after exam completion.",
      color: "green"
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Students can take exams on any verify, anywhere, anytime.",
      color: "orange"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">
                CBT Pro
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                 <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                 <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
                 <Link href="/auth/login" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">Login</Link>
              </nav>
              <div className="h-6 w-px bg-gray-200"></div>
              <Link href="/auth/signup">
                <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg font-medium text-sm flex items-center group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-blue-600">How it Works</a>
              <Link href="/auth" className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50">Login</Link>
              <Link href="/auth?mode=signup" className="block w-full">
                 <button className="w-full mt-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-medium shadow-md hover:bg-blue-700">
                    Get Started Free
                 </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6 animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                The Modern Way to Test
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                Create Exams in <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Minutes</span>, Not Hours
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A seamless platform for examiners to craft engaging assessments and for students to take them without distractions.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/auth?mode=signup" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 flex items-center justify-center">
                    Start as Examiner
                    </button>
                </Link>
                <Link href="/auth" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center">
                    Join an Exam
                    </button>
                </Link>
              </div>

               <div className="mt-10 flex items-center justify-center lg:justify-start space-x-8 text-gray-400 text-sm font-medium">
                  <div className="flex items-center gap-2">
                     <CheckCircle size={16} className="text-green-500" /> Free Plan Available
                  </div>
                  <div className="flex items-center gap-2">
                     <CheckCircle size={16} className="text-green-500" /> No Credit Card
                  </div>
               </div>
            </div>

            {/* Hero Visual - Flow Demo */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
               <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-purple-600 rounded-4xl transform rotate-3 scale-105 opacity-10 blur-xl"></div>
              <FlowDemo />
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
              <p className="text-lg text-gray-600">Three simple steps to running your first exam</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10"></div>

                {[
                   { step: "01", title: "Create", desc: "Set up questions, time limits, and assign students in minutes.", color: "bg-blue-100 text-blue-600" },
                   { step: "02", title: "Monitor", desc: "Watch student progress in real-time as they take the exam securely.", color: "bg-purple-100 text-purple-600" },
                   { step: "03", title: "Analyze", desc: "Get instant grades and deep performance insights automatically.", color: "bg-green-100 text-green-600" }
                ].map((item, i) => (
                    <div key={i} className="relative bg-white p-6 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-all duration-300 group">
                        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center font-bold text-xl mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                            {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything needed to run perfect exams</h2>
            <p className="text-lg text-gray-600">Designed to make the entire assessment lifecycle smoother than ever before.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 group cursor-default">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                    feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    feature.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    feature.color === 'green' ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                }`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                 <BookOpen className="text-white" size={16} />
               </div>
               <span className="font-bold text-gray-900">CBT Pro</span>
           </div>
           
           <p className="text-gray-500 text-sm">
             &copy; 2025 CBT Pro. All rights reserved.
           </p>

           <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">Support</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default CBTWaitlistPage;
