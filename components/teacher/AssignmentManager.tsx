'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Calendar, Clock, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AssignmentManagerProps {
  currentUserId: string;
}

export function AssignmentManager({ currentUserId }: AssignmentManagerProps) {
  const [exams, setExams] = React.useState<any[]>([]);
  const [classes, setClasses] = React.useState<any[]>([]);
  const [assignments, setAssignments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    examId: '',
    classId: '',
    startTime: '',
    endTime: '',
  });

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [examsRes, classesRes, assignmentsRes] = await Promise.all([
        fetch('/api/exams'),
        fetch('/api/classes'), // Fetches classes for current user's org
        fetch('/api/assignments'),
      ]);

      if (examsRes.ok) setExams(await examsRes.json());
      if (classesRes.ok) setClasses(await classesRes.json());
      if (assignmentsRes.ok) setAssignments(await assignmentsRes.json());
      
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.examId || !formData.classId || !formData.startTime || !formData.endTime) {
        toast.error('Please fill all fields');
        return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
         const err = await response.json();
         throw new Error(err.message || 'Failed to assign exam');
      }

      toast.success('Exam assigned successfully');
      setFormData({ examId: '', classId: '', startTime: '', endTime: '' });
      fetchData(); // Refresh list
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'ACTIVE': return 'default'; // dark/black
        case 'SCHEDULED': return 'secondary'; // gray
        case 'COMPLETED': return 'outline';
        default: return 'secondary';
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign Exam to Class</CardTitle>
          <CardDescription>Schedule exams for specific classes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssign} className="grid md:grid-cols-2 gap-6">
             <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="exam">Select Exam</Label>
                    <Select 
                      value={formData.examId} 
                      onValueChange={(val) => setFormData({...formData, examId: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an exam..." />
                      </SelectTrigger>
                      <SelectContent>
                        {exams.map(exam => (
                            <SelectItem key={exam._id} value={exam._id}>
                                {exam.title} ({exam.subject})
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>
                 
                 <div className="space-y-2">
                    <Label htmlFor="class">Select Class</Label>
                    <Select 
                      value={formData.classId} 
                      onValueChange={(val) => setFormData({...formData, classId: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a class..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map(cls => (
                            <SelectItem key={cls._id} value={cls._id}>
                                {cls.name} ({cls.level})
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>
             </div>

             <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input 
                        id="startTime" 
                        type="datetime-local" 
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input 
                        id="endTime" 
                        type="datetime-local" 
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                 </div>

                 <Button type="submit" className="w-full mt-2" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Assign Exam
                 </Button>
             </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
        </CardHeader>
        <CardContent>
             {assignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No assignments found.</div>
             ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exam</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments.map((assignment) => (
                            <TableRow key={assignment._id}>
                                <TableCell className="font-medium">
                                    {assignment.examId?.title || 'Unknown Exam'}
                                    <div className="text-xs text-muted-foreground">{assignment.examId?.subject}</div>
                                </TableCell>
                                <TableCell>{assignment.classId?.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        {format(new Date(assignment.startTime), 'PP p')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        {format(new Date(assignment.endTime), 'PP p')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusColor(assignment.status) as any}>{assignment.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             )}
        </CardContent>
      </Card>
    </div>
  );
}
