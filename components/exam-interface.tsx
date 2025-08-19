"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Clock, Flag, ChevronLeft, ChevronRight } from "lucide-react"
import type { ExamData } from "@/app/page"

interface ExamInterfaceProps {
  examData: ExamData
  onSubmit: (answers: number[]) => void
}

export function ExamInterface({ examData, onSubmit }: ExamInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(examData.questions.length).fill(-1))
  const [timeRemaining, setTimeRemaining] = useState(examData.duration * 60) // Convert to seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          
          onSubmit(answers)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [answers, onSubmit])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = Number.parseInt(value)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleFlag = () => {
    const newFlagged = new Set(flaggedQuestions)
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion)
    } else {
      newFlagged.add(currentQuestion)
    }
    setFlaggedQuestions(newFlagged)
  }

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit your exam? This action cannot be undone.")) {
      onSubmit(answers)
    }
  }

  const isLowTime = timeRemaining <= 300 // 5 minutes
  const currentQ = examData.questions[currentQuestion]
  const isLastQuestion = currentQuestion === examData.questions.length - 1

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif font-bold text-xl text-slate-700">{examData.title}</h1>
            <Badge variant="outline" className="font-sans">
              Question {currentQuestion + 1} of {examData.questions.length}
            </Badge>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-sans font-semibold ${
              isLowTime ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-cyan-100 text-cyan-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeRemaining)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-8">
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-sans text-lg font-medium text-slate-800 leading-relaxed">{currentQ.question}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFlag}
                  className={`ml-4 ${flaggedQuestions.has(currentQuestion) ? "text-amber-600" : "text-slate-400"}`}
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Answer Options */}
            <RadioGroup
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => handleAnswerChange(index.toString())}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-0.5" />
                  <Label
                    htmlFor={`option-${index}`}
                    className="font-sans text-base text-slate-700 leading-relaxed cursor-pointer flex-1"
                  >
                    <span className="font-medium text-slate-500 mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="font-sans bg-transparent"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            {!isLastQuestion ? (
              <Button
                onClick={handleNext}
                disabled={currentQuestion === examData.questions.length - 1}
                className="bg-blue-600 hover:bg-blue-700 font-sans"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 font-sans font-semibold">
                Submit Exam
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation Grid */}
        <Card className="mt-6 shadow-sm border-slate-200">
          <CardContent className="p-4">
            <h3 className="font-sans font-medium text-slate-700 mb-3">Question Navigation</h3>
            <div className="grid grid-cols-10 gap-2">
              {examData.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-sm font-sans font-medium transition-colors ${
                    index === currentQuestion
                      ? "bg-blue-600 text-white"
                      : answers[index] !== -1
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : flaggedQuestions.has(index)
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm font-sans text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-100 rounded"></div>
                Flagged
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-100 rounded"></div>
                Not Answered
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
