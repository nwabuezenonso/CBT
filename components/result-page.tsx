"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Award } from "lucide-react"
import type { ExamData } from "@/app/page"

interface ResultPageProps {
  score: number
  totalQuestions: number
  examData: ExamData
  userAnswers: number[]
  onRestart: () => void
}

export function ResultPage({ score, totalQuestions, examData, userAnswers, onRestart }: ResultPageProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const passed = percentage >= 60 // Assuming 60% is passing grade

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getGradeBg = (percentage: number) => {
    if (percentage >= 90) return "bg-green-50 border-green-200"
    if (percentage >= 80) return "bg-blue-50 border-blue-200"
    if (percentage >= 70) return "bg-yellow-50 border-yellow-200"
    if (percentage >= 60) return "bg-orange-50 border-orange-200"
    return "bg-red-50 border-red-200"
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {passed ? <Award className="w-10 h-10 text-green-600" /> : <XCircle className="w-10 h-10 text-red-600" />}
          </div>
          <h1 className="font-serif font-black text-3xl text-slate-700 mb-2">Exam Complete</h1>
          <p className="font-sans text-slate-600">{examData.title}</p>
        </div>

        {/* Score Summary */}
        <Card className={`shadow-lg border-2 mb-8 ${getGradeBg(percentage)}`}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-serif font-bold text-2xl text-slate-700">Your Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className={`text-4xl font-serif font-black mb-2 ${getGradeColor(percentage)}`}>{score}</div>
                <div className="font-sans text-slate-600">Correct Answers</div>
              </div>
              <div>
                <div className={`text-4xl font-serif font-black mb-2 ${getGradeColor(percentage)}`}>{percentage}%</div>
                <div className="font-sans text-slate-600">Overall Score</div>
              </div>
              <div>
                <div className={`text-4xl font-serif font-black mb-2 ${getGradeColor(percentage)}`}>
                  {totalQuestions}
                </div>
                <div className="font-sans text-slate-600">Total Questions</div>
              </div>
            </div>

            <Badge variant={passed ? "default" : "destructive"} className="text-lg px-4 py-2 font-sans font-semibold">
              {passed ? "PASSED" : "FAILED"}
            </Badge>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <Card className="shadow-sm border-slate-200 mb-8">
          <CardHeader>
            <CardTitle className="font-serif font-bold text-xl text-slate-700">Answer Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {examData.questions.map((question, index) => {
                const userAnswer = userAnswers[index]
                const isCorrect = userAnswer === question.correctAnswer
                const wasAnswered = userAnswer !== -1

                return (
                  <div key={question.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-sans font-medium text-slate-800 mb-2">
                          Question {index + 1}: {question.question}
                        </h3>

                        <div className="space-y-2 text-sm">
                          {/* User's Answer */}
                          {wasAnswered ? (
                            <div
                              className={`p-2 rounded ${
                                isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                              }`}
                            >
                              <span className="font-medium">Your answer: </span>
                              {String.fromCharCode(65 + userAnswer)}. {question.options[userAnswer]}
                            </div>
                          ) : (
                            <div className="p-2 rounded bg-gray-50 text-gray-600">
                              <span className="font-medium">Your answer: </span>
                              Not answered
                            </div>
                          )}

                          {/* Correct Answer */}
                          {!isCorrect && (
                            <div className="p-2 rounded bg-green-50 text-green-800">
                              <span className="font-medium">Correct answer: </span>
                              {String.fromCharCode(65 + question.correctAnswer)}.{" "}
                              {question.options[question.correctAnswer]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center">
          <Button onClick={onRestart} className="bg-blue-600 hover:bg-blue-700 font-sans font-semibold px-8">
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Another Exam
          </Button>
        </div>
      </div>
    </div>
  )
}
