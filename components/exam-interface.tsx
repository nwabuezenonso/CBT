"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { examService, type Exam } from "@/services/examService";
import { notificationService } from "@/lib/notification-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, CheckCircle, Circle, AlertTriangle, Send } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

import { toast } from "sonner";

interface ExamInterfaceProps {
  exam: Exam;
}

export function ExamInterface({ exam }: ExamInterfaceProps) {
  const { user } = useAuth();
  const router = useRouter();
  // const { toast } = useToast();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60); // Convert to seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-save effect
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        localStorage.setItem(
          `exam_progress_${exam.id}_${user?.id}`,
          JSON.stringify({
            answers,
            currentQuestionIndex,
            timeRemaining,
            startTime,
          })
        );
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(autoSave);
  }, [answers, currentQuestionIndex, timeRemaining, exam.id, user?.id, startTime]);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`exam_progress_${exam.id}_${user?.id}`);
    if (savedProgress) {
      const { answers: savedAnswers, currentQuestionIndex: savedIndex } = JSON.parse(savedProgress);
      setAnswers(savedAnswers);
      setCurrentQuestionIndex(savedIndex);
    }
  }, [exam.id, user?.id]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const calculateScore = useCallback(() => {
    let score = 0;
    exam.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (question.type === "multiple-choice" && userAnswer !== undefined) {
        if (Number.parseInt(userAnswer) === question.correctAnswer) {
          score += question.points;
        }
      }
      // For essay questions, we'll give full points for now (in a real system, this would need manual grading)
      else if (question.type === "essay" && userAnswer && userAnswer.trim()) {
        score += question.points;
      }
    });
    return score;
  }, [exam.questions, answers]);

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const score = calculateScore();
      const percentage = Math.round((score / exam.totalPoints) * 100);
      const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60); // Convert to minutes

      const result = examService.submitExamResult({
        examId: exam.id,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        answers,
        score,
        totalPoints: exam.totalPoints,
        percentage,
        completedAt: new Date().toISOString(),
        timeSpent,
      });

      // Notify student about result
      notificationService.notifyResultAvailable(user.id, exam.title, percentage);

      // Notify admin about completion
      notificationService.notifyExamCompleted(exam.createdBy, user.name, exam.title, percentage);

      // Simulate email notifications
      notificationService.sendEmailNotification(
        user.email,
        "Exam Result Available",
        `Your result for "${exam.title}" is now available. You scored ${percentage}%.`
      );

      // Clear saved progress
      localStorage.removeItem(`exam_progress_${exam.id}_${user.id}`);

      toast.success("Exam Submitted", {
        description: `Your exam has been submitted successfully. Score: ${percentage}%`,
      });

      router.push("/dashboard");
    } catch (error) {
      toast.error("Submission Failed", {
        description: "There was an error submitting your exam. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    toast("Time's up", {
      description: "Your exam has been automatically submitted.",
    });
    handleSubmit();
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return "text-red-600"; // Last 5 minutes
    if (timeRemaining <= 600) return "text-yellow-600"; // Last 10 minutes
    return "text-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{exam.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                <Clock className="w-5 h-5" />
                <span className="text-lg font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
              <Button
                onClick={() => setShowSubmitDialog(true)}
                variant="outline"
                disabled={answeredQuestions === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Exam
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>
                {answeredQuestions}/{exam.questions.length} answered
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                  {exam.questions.map((question, index) => {
                    const isAnswered = answers[question.id] !== undefined;
                    const isCurrent = index === currentQuestionIndex;

                    return (
                      <Button
                        key={question.id}
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        className={`relative ${isAnswered && !isCurrent ? "border-green-500" : ""}`}
                        onClick={() => handleQuestionNavigation(index)}
                      >
                        {index + 1}
                        {isAnswered && (
                          <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-green-500 bg-background rounded-full" />
                        )}
                      </Button>
                    );
                  })}
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <Circle className="w-3 h-3" />
                    <span>Not answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      Question {currentQuestionIndex + 1}
                    </CardTitle>
                    <p className="text-base leading-relaxed">{currentQuestion.question}</p>
                  </div>
                  <Badge variant="secondary">
                    {currentQuestion.points} {currentQuestion.points === 1 ? "point" : "points"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentQuestion.type === "multiple-choice" ? (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="essay-answer">Your Answer</Label>
                    <Textarea
                      id="essay-answer"
                      placeholder="Type your answer here..."
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    {answers[currentQuestion.id] ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Answered
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Circle className="w-4 h-4 mr-1" />
                        Not answered
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === exam.questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have answered {answeredQuestions} out of {exam.questions.length} questions.
                {answeredQuestions < exam.questions.length && (
                  <span className="block mt-1 text-yellow-600">
                    {exam.questions.length - answeredQuestions} questions remain unanswered.
                  </span>
                )}
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                Continue Exam
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Exam"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
