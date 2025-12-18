'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Play, Clock, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function StudentDashboard() {
  const router = useRouter();
  const [assignments, setAssignments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch('/api/student/assignments');
        if (res.ok) {
           const data = await res.json();
           setAssignments(data);
        }
      } catch (e) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleStartExam = async (assignmentId: string, status: string, attemptId?: string) => {
    if (status === 'STARTED' && attemptId) {
        // Resume
        router.push(`/dashboard/student/exam/${attemptId}`);
        return;
    }
    
    setProcessing(true);
    try {
        // Create new attempt
        const res = await fetch('/api/student/attempt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignmentId })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to start exam');
        
        router.push(`/dashboard/student/exam/${data.attemptId}`);
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading your dashboard...</div>;

  const upcoming = assignments.filter(a => a.status === 'SCHEDULED' || a.status === 'ACTIVE');
  // Sort: Active first, then by date
  upcoming.sort((a, b) => {
      if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
      if (b.status === 'ACTIVE' && a.status !== 'ACTIVE') return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
            <p className="text-muted-foreground mt-1">
                View your scheduled exams and results.
            </p>
         </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcoming.length === 0 ? (
            <Card className="col-span-full py-12 text-center border-dashed">
                <CardContent>
                    <div className="flex justify-center mb-4">
                        <Calendar className="h-10 w-10 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium">No Exams Scheduled</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        You're all caught up! Check back later for new assignments.
                    </p>
                </CardContent>
            </Card>
        ) : (
            upcoming.map(assignment => {
               const isActive = assignment.status === 'ACTIVE'; // Or check dates manually
               const isStarted = assignment.attemptStatus === 'STARTED';
               const isSubmitted = assignment.attemptStatus === 'SUBMITTED';
               
               return (
                <Card key={assignment._id} className={`flex flex-col ${isActive ? 'border-primary/50 shadow-md' : 'opacity-80'}`}>
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                            <Badge variant={isActive ? 'default' : 'secondary'}>
                                {isActive ? 'Active Now' : 'Scheduled'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {assignment.examId.subject}
                            </Badge>
                        </div>
                        <CardTitle className="text-xl mt-2">{assignment.examId.title}</CardTitle>
                        <CardDescription>
                            <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3" /> {assignment.examId.duration} mins
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 text-sm space-y-2">
                        <div className="flex justify-between py-1 border-b">
                            <span className="text-muted-foreground">Start Time:</span>
                            <span>{format(new Date(assignment.startTime), 'MMM d, h:mm a')}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                            <span className="text-muted-foreground">End Time:</span>
                            <span>{format(new Date(assignment.endTime), 'MMM d, h:mm a')}</span>
                        </div>
                        {isSubmitted && (
                             <div className="bg-green-50 text-green-700 p-2 rounded text-center mt-2 font-medium flex items-center justify-center gap-2">
                                <CheckCircle className="h-4 w-4" /> Completed
                             </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-2">
                        {!isSubmitted && (
                            <Button 
                                className="w-full" 
                                disabled={!isActive || processing}
                                onClick={() => handleStartExam(assignment._id, assignment.attemptStatus, assignment.attemptId)}
                            >
                                {processing && <Clock className="mr-2 h-4 w-4 animate-spin" />}
                                {!processing && isStarted ? (
                                    <>Resume Exam <ArrowRight className="ml-2 h-4 w-4" /></>
                                ) : (
                                    <>Start Exam <Play className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        )}
                        {isSubmitted && (
                             <Button variant="outline" className="w-full" disabled>View Results</Button>
                        )}
                    </CardFooter>
                </Card>
               );
            })
        )}
      </div>
    </div>
  );
}
