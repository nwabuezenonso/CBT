'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Timer, CheckCircle, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ExamInterfaceProps {
  attemptId: string;
}

export function ExamInterface({ attemptId }: ExamInterfaceProps) {
  const router = useRouter();
  const [examData, setExamData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});  // qId -> optionId
  const [timeLeft, setTimeLeft] = React.useState<number>(0); // in seconds
  const [submitting, setSubmitting] = React.useState(false);

  // Fetch Exam Data
  React.useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`/api/student/attempt/${attemptId}`);
        if (!res.ok) {
            const err = await res.json();
            if (err.completed) {
                toast.success("Exam already completed");
                router.push('/dashboard/student');
                return;
            }
            throw new Error(err.message || "Failed to load exam");
        }
        const data = await res.json();
        setExamData(data);
        
        // Calculate time left
        const startTime = new Date(data.startTime).getTime();
        const durationMs = data.duration * 60 * 1000;
        const endTimeIndex = startTime + durationMs;
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTimeIndex - now) / 1000));
        setTimeLeft(remaining);

      } catch (error: any) {
        toast.error(error.message);
        router.push('/dashboard/student');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [attemptId, router]);

  // Timer Tick
  React.useEffect(() => {
    if (timeLeft <= 0 || !examData) return;
    
    const timer = setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                clearInterval(timer);
                handleSubmit(true); // Auto-submit
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, examData]);

  const handleOptionSelect = (optionId: string) => {
    if (!examData) return;
    const qId = examData.questions[currentQuestionIndex]._id;
    setAnswers(prev => ({
        ...prev,
        [qId]: optionId
    }));
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return; // Prevent double submit
    setSubmitting(true);
    
    try {
        const res = await fetch('/api/student/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                attemptId,
                answers
            })
        });
        
        if (!res.ok) throw new Error("Submission failed");
        
        if (auto) toast.warning("Time's up! Exam submitted automatically.");
        else toast.success("Exam submitted successfully!");
        
        router.push('/dashboard/student');
    } catch (error) {
        toast.error("Failed to submit. Please try again.");
        setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  if (!examData) return null;

  const currentQ = examData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;
  
  // Format Time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeColor = minutes < 5 ? 'text-red-500' : 'text-primary';

  return (
    <div className="min-h-screen bg-muted/10 p-4 md:p-8 flex flex-col items-center">
        {/* Header Bar */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-card p-4 rounded-lg shadow-sm border">
            <div>
                <h2 className="font-bold text-lg">{examData.examTitle}</h2>
                <div className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {examData.questions.length}</div>
            </div>
            <div className={`text-xl font-mono font-bold flex items-center gap-2 ${timeColor}`}>
                <Timer className="h-5 w-5" />
                {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl mb-6">
            <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="w-full max-w-4xl flex-1 flex flex-col min-h-[400px]">
            <CardHeader>
                <CardTitle className="leading-normal">{currentQ.questionText}</CardTitle>
                <div className="text-sm text-muted-foreground">Points: {currentQ.marks}</div>
            </CardHeader>
            <CardContent className="flex-1 py-6">
                <RadioGroup 
                    value={answers[currentQ._id] || ""} 
                    onValueChange={handleOptionSelect}
                    className="space-y-4"
                >
                    {currentQ.options.map((opt: any) => (
                        <div key={opt._id} className={`flex items-center space-x-3 border p-4 rounded-md transition-colors ${answers[currentQ._id] === opt._id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                            <RadioGroupItem value={opt._id} id={opt._id} />
                            <Label htmlFor={opt._id} className="flex-1 cursor-pointer font-normal text-base">
                                {opt.optionText}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
                <Button 
                    variant="outline" 
                    onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                    disabled={currentQuestionIndex === 0}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {currentQuestionIndex < examData.questions.length - 1 ? (
                    <Button 
                        onClick={() => setCurrentQuestionIndex(p => Math.min(examData.questions.length - 1, p + 1))}
                    >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700">
                                Submit Exam <CheckCircle className="ml-2 h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Ready to Submit?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You have answered {Object.keys(answers).length} of {examData.questions.length} questions.
                                    Once submitted, you cannot change your answers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSubmit(false)} disabled={submitting}>
                                    {submitting ? "Submitting..." : "Yes, Submit"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardFooter>
        </Card>
        
        {/* Navigation Grid (Optional/Collapsible) */}
        <div className="w-full max-w-4xl mt-6">
            <div className="flex flex-wrap gap-2 justify-center">
                {examData.questions.map((q: any, i: number) => (
                    <button
                        key={q._id}
                        onClick={() => setCurrentQuestionIndex(i)}
                        className={`w-8 h-8 rounded text-xs font-medium border flex items-center justify-center transition-colors
                            ${i === currentQuestionIndex ? 'border-primary ring-2 ring-primary ring-offset-2' : ''}
                            ${answers[q._id] ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}
                        `}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}
