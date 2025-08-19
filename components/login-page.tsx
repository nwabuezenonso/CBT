"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginPageProps {
  onLogin: (examId: string, password: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [examId, setExamId] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!examId.trim() || !password.trim()) return

    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onLogin(examId, password)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-serif font-black text-xl">CBT</span>
          </div>
          <h1 className="font-serif font-black text-2xl text-slate-700 mb-2">Exam Portal</h1>
          <p className="text-slate-600 font-sans">Welcome to Your Exam Portal. Please log in to begin.</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-serif font-bold text-xl text-slate-700">Access Your Exam</CardTitle>
            <CardDescription className="font-sans text-slate-600">
              Enter your credentials to start the examination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="examId" className="font-sans font-medium text-slate-700">
                  Exam ID
                </Label>
                <Input
                  id="examId"
                  type="text"
                  placeholder="Enter your exam ID"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  className="h-12 font-sans text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-sans font-medium text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 font-sans text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !examId.trim() || !password.trim()}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-sans font-semibold text-base transition-colors"
              >
                {isLoading ? "Authenticating..." : "Start Exam"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Support Link */}
        <div className="text-center mt-6">
          <button className="text-slate-500 hover:text-slate-700 font-sans text-sm transition-colors">
            Need Help? Contact Technical Support
          </button>
        </div>
      </div>
    </div>
  )
}
