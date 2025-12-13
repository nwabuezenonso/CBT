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

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to your Exam Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              There is no dashboard view for students.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg text-sm text-left space-y-2">
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" />
                <span>To access an exam, please use the unique link provided in your email invitation.</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" />
                <span>After completing an exam, you will see your result immediately.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
