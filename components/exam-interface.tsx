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
import { Clock, CheckCircle, Circle, AlertTriangle, Send, Maximize, ShieldAlert } from "lucide-react";
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  
  // Security State
  const [violationCount, setViolationCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(true); // Default true to avoid flash, checked in effect
  const [securityModalOpen, setSecurityModalOpen] = useState(true);
  const MAX_VIOLATIONS = 3;

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentQuestionId = currentQuestion?._id || "";
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
    const autoSave = setInterval(async () => {
      if (Object.keys(answers).length > 0) {
         try {
             await fetch('/api/exams/progress', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                     examId: exam.id,
                     answers,
                     currentQuestionIndex,
                     timeRemaining,
                     startTime
                 })
             });
         } catch (e) {
             console.error("Failed to save progress", e);
         }
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(autoSave);
  }, [answers, currentQuestionIndex, timeRemaining, exam.id, startTime]);

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
        if (!exam.id) return;
        try {
            const res = await fetch(`/api/exams/progress?examId=${exam.id}`);
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setAnswers(data.answers || {});
                    setCurrentQuestionIndex(data.currentQuestionIndex || 0);
                    if (data.timeRemaining) setTimeRemaining(data.timeRemaining);
                    // Start time might be tricky if resuming, ideally we keep original start time
                    // or calculate elapsed. For now simple restore.
                }
            }
        } catch (e) {
            console.error("Failed to load progress", e);
        }
    };
    loadProgress();
  }, [exam.id]);

  // Security: Fullscreen & Tab Switching Monitor
  useEffect(() => {
    // 1. Fullscreen Enforcer
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull && !isSubmitted) {
        setSecurityModalOpen(true);
      }
    };

    // 2. Tab Switching / Visibility Monitor
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted && !showSubmitDialog) {
        recordViolation("Tab switching detected");
      }
    };

    const handleWindowBlur = () => {
      if (!isSubmitted && !showSubmitDialog && !document.fullscreenElement) {
         // Only count blur if not in fullscreen (fullscreen change handles its own)
         // or if user alt-tabs out of fullscreen
         // recordViolation("Window lost focus"); 
         // Blur can be flaky, relying on visibilitychange is often safer for "cheating", 
         // but strict mode might want blur. Let's stick to visibility for now to avoid false positives.
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isSubmitted, showSubmitDialog]);

  const recordViolation = (reason: string) => {
    setViolationCount((prev) => {
      const newCount = prev + 1;
      
      if (newCount >= MAX_VIOLATIONS) {
        toast.error("Exam Terminated", {
           description: "Maximum security violations reached. Your exam is being submitted.",
           duration: 5000
        });
        handleAutoSubmit();
      } else {
        toast.warning(`Security Warning (${newCount}/${MAX_VIOLATIONS})`, {
          description: `${reason}. Please stay on this tab and keep fullscreen. Next violation may terminate your exam.`,
          duration: 5000,
        });
      }
      return newCount;
    });
  };

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setSecurityModalOpen(false);
    } catch (err) {
      toast.error("Fullscreen Failed", {
        description: "Please manually enable fullscreen to continue."
      });
    }
  };

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


  
  // calculateScore removed - done on server

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60); // Convert to minutes

      // Submit to backend (calculated on server)
      const submission = await examService.submitExamResult({
        examId: exam.id!,
        answers,
        timeSpent,
      });
      
      const { percentage } = submission; // final value from server

      if (user) {
        // Notify student about result
        notificationService.notifyResultAvailable(user.id, exam.title, percentage);

        // Notify admin about completion
        notificationService.notifyExamCompleted(exam.examinerId, user.name, exam.title, percentage); 

        // Simulate email notifications
        notificationService.sendEmailNotification(
            user.email,
            "Exam Result Available",
            `Your result for "${exam.title}" is now available. You scored ${percentage}%.`
        );
      }

      // Clear save
      await fetch(`/api/exams/progress?examId=${exam.id}`, { method: 'DELETE' });

      toast.success("Exam Submitted", {
        description: `Your exam has been submitted successfully. Score: ${percentage}%`,
      });

      setFinalScore(percentage);
      setIsSubmitted(true);
      // router.push("/dashboard"); // Removed redirect
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Exam Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your exam has been submitted successfully.
            </p>
            {finalScore !== null && (
               <div className="py-4">
                 <div className="text-4xl font-bold text-primary">{finalScore}%</div>
                 <div className="text-sm text-muted-foreground">Your Score</div>
               </div>
            )}
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your registered address.
            </p>
            <Button onClick={() => router.push("/")} className="w-full mt-4">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                    const isAnswered = answers[question._id || ""] !== undefined;
                    const isCurrent = index === currentQuestionIndex;

                    return (
                      <Button
                        key={question._id || index}
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
// 
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
                    <p className="text-base leading-relaxed">{currentQuestion.questionText}</p>
                  </div>
                  <Badge variant="secondary">
                    {currentQuestion.points} {currentQuestion.points === 1 ? "point" : "points"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentQuestion.type === "multiple-choice" ? (
                  <RadioGroup
                    value={answers[currentQuestionId] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQuestionId, value)}
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
                      value={answers[currentQuestionId] || ""}
                      onChange={(e) => handleAnswerChange(currentQuestionId, e.target.value)}
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
                    {answers[currentQuestionId] ? (
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

      
      {/* Security Check Modal */}
      <Dialog open={securityModalOpen && !isSubmitted} onOpenChange={(open) => {
        // Prevent closing if not fullscreen
        if (!open && !document.fullscreenElement) return;
        setSecurityModalOpen(open);
      }}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
               <ShieldAlert className="w-5 h-5" />
               Exam Security Check
            </DialogTitle>
            <DialogDescription className="pt-2">
               This is a secure exam environment. 
               <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground">
                 <li>Full screen mode is required.</li>
                 <li>Tab switching is monitored.</li>
                 <li>Leaving the exam window {MAX_VIOLATIONS} times will result in <strong>automatic submission</strong>.</li>
               </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={enterFullscreen} className="w-full" size="lg">
              <Maximize className="w-4 h-4 mr-2" />
              Enter Fullscreen to Start/Resume
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
