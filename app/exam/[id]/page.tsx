"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { examService, type Exam } from "@/services/examService";
import { ExamInterface } from "@/components/exam-interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadExam();
    }
  }, [user, params.id]);

  const loadExam = async () => {
    if (!params.id) return;

    try {
      const examData = await examService.getExam(params.id as string);

      if (!examData) {
        setLoading(false);
        return;
      }

      if (user) {
        // Check if already completed (using API results)
        try {
          const results = await examService.getExamResults();
          // @ts-ignore
          const hasCompleted = results.some((r) => (r.examId._id || r.examId) === examData.id && (r.examineeId._id || r.examineeId) === user.id);

          if (user.role === "examinee" && hasCompleted) {
            setIsAuthorized(false);
            setLoading(false);
            return;
          }
        } catch (err) {
          // If fetching results fails (e.g., 401), just ignore it for now or assume not completed
          console.error("Failed to fetch results", err);
        }
      }

      setExam(examData);
      setIsAuthorized(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    setHasStarted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Exam Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The exam you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to take this exam or you've already completed it.
            </p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
              <p className="text-muted-foreground">{exam.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-semibold">{exam.questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-semibold">{exam.duration}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-semibold">{exam.totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">Important Instructions</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Once you start, the timer will begin and cannot be paused</li>
                    <li>• Your answers are automatically saved as you progress</li>
                    <li>• You can navigate between questions using the sidebar</li>
                    <li>• The exam will auto-submit when time expires</li>
                    <li>• Make sure you have a stable internet connection</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleStartExam} size="lg">
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ExamInterface exam={exam} />;
}
