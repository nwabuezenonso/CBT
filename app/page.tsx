"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  BookOpen,
  Clock,
  Shield,
  Award,
  BarChart3,
  Users,
  Zap,
  Play,
  Globe,
  Twitter,
  Linkedin,
  Mail,
  Eye,
  FileText,
  TrendingUp,
  Lock,
  Bell,
  Gift,
  Calendar,
} from "lucide-react";

const CBTWaitlistPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(1247);

  useEffect(() => {
    setIsVisible(true);
    // Simulate waitlist count updates
    const interval = setInterval(() => {
      setWaitlistCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setWaitlistCount((prev) => prev + 1);
    }
  };

  const earlyBenefits = [
    {
      icon: Gift,
      title: "50% Early Bird Discount",
      description: "Get half-price access for the first year when we launch",
      badge: "Limited Time",
    },
    {
      icon: Users,
      title: "Priority Access",
      description: "Be among the first 100 institutions to get exclusive beta access",
      badge: "VIP",
    },
    {
      icon: Award,
      title: "Free Setup & Training",
      description: "Personal onboarding session worth $2,500 - completely free",
      badge: "Premium",
    },
    {
      icon: Zap,
      title: "Lifetime Updates",
      description: "Get all future features and updates at no additional cost",
      badge: "Forever",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "Advanced anti-cheating with AI monitoring and browser lockdown",
      status: "In Development",
    },
    {
      icon: Zap,
      title: "5-Minute Setup",
      description: "Create professional exams faster than making coffee",
      status: "Beta Ready",
    },
    {
      icon: Award,
      title: "Instant Grading",
      description: "Automated scoring with detailed analytics and feedback",
      status: "In Development",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into student performance and learning gaps",
      status: "Coming Soon",
    },
  ];

  const timeline = [
    {
      phase: "Beta Testing",
      date: "Q2 2025",
      status: "current",
      description: "Private beta with select institutions",
    },
    {
      phase: "Public Launch",
      date: "Q3 2025",
      status: "upcoming",
      description: "Full platform release with all features",
    },
    {
      phase: "Mobile App",
      date: "Q4 2025",
      status: "planned",
      description: "Native iOS and Android applications",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group cursor-pointer">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                <BookOpen className="text-white" size={22} />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">CBT Pro</span>
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>

            {/* Desktop Navigation */}
            {/* <nav className="hidden md:flex space-x-8">
              {["Features", "Timeline", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full rounded-full"></span>
                </a>
              ))}
            </nav> */}

            <div className="hidden md:flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md font-medium flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Join Waitlist
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                {["Features", "Timeline", "Pricing"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <hr className="border-gray-200" />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md font-medium w-fit flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Join Waitlist
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div
          className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight max-w-5xl mx-auto">
            The future of <span className="text-blue-600">secure online exams</span> is almost here
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            CBT Pro is the next-generation computer-based testing platform that will revolutionize
            how educational institutions create, deliver, and analyze online assessments. Join the
            waitlist for exclusive early access.
          </p>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto mb-16">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center sm:text-left"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center whitespace-nowrap"
                >
                  Join Waitlist
                  <ArrowRight className="ml-2" size={18} />
                </button>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">You're on the list! 🎉</h3>
                <p className="text-gray-600">
                  We'll notify you as soon as CBT Pro launches. Check your email for confirmation
                  and exclusive updates.
                </p>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 mb-12">
            ✓ No spam, ever • ✓ Exclusive early access • ✓ Special launch pricing
          </div>
        </div>
      </section>

      {/* Early Bird Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Exclusive waitlist benefits</h2>
          <p className="text-xl text-blue-100 mb-16 max-w-3xl mx-auto">
            Be among the first to experience CBT Pro and get incredible perks unavailable to anyone
            else
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {earlyBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                    <benefit.icon className="text-white" size={32} />
                  </div>
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                    {benefit.badge}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-blue-100 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What's coming in CBT Pro</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A sneak peek at the revolutionary features we're building for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const statusColors = {
                "Beta Ready": "bg-green-100 text-green-700 border-green-200",
                "In Development": "bg-blue-100 text-blue-700 border-blue-200",
                "Coming Soon": "bg-orange-100 text-orange-700 border-orange-200",
              };

              return (
                <div
                  key={index}
                  className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-200">
                      <feature.icon className="text-blue-600" size={28} />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        statusColors[feature.status as keyof typeof statusColors]
                      }`}
                    >
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section id="timeline" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Development roadmap</h2>
            <p className="text-xl text-gray-600">Here's what to expect and when</p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.status === "current"
                      ? "bg-blue-600 text-white"
                      : item.status === "upcoming"
                      ? "bg-orange-100 text-orange-600 border-2 border-orange-200"
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {item.status === "current" ? (
                    <Calendar size={20} />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{item.phase}</h3>
                    <span className="text-lg font-bold text-blue-600">{item.date}</span>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                  {item.status === "current" && (
                    <div className="mt-4 flex items-center text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm font-medium">Currently in progress</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Don't miss out on the future of testing</h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            CBT Pro will transform how institutions deliver assessments. Join{" "}
            {waitlistCount.toLocaleString()}+ educators who are already waiting for early access.
          </p>

          {!isSubmitted && (
            <div className="max-w-md mx-auto mb-8">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-4 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-center sm:text-left"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center whitespace-nowrap"
                >
                  Join Waitlist
                  <ArrowRight className="ml-2" size={18} />
                </button>
              </form>
            </div>
          )}

          <div className="text-gray-400 text-sm">
            ⚡ Get notified first • 🎁 Exclusive discounts • 🔒 No spam ever
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="text-white" size={20} />
            </div>
            <span className="ml-3 text-xl font-bold">CBT Pro</span>
            <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              Coming Soon
            </span>
          </div>

          <p className="text-gray-400 mb-6">
            The most advanced computer-based testing platform for educational institutions.
          </p>

          <div className="flex justify-center space-x-6 mb-8">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
              <Twitter size={18} />
            </div>
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
              <Linkedin size={18} />
            </div>
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
              <Mail size={18} />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-gray-400 text-sm">
            &copy; 2025 CBT Pro. All rights reserved. • Made with ❤️ for educators worldwide
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CBTWaitlistPage;
