"use client";

import { useState } from "react";
import { examService, type Student, type Exam } from "@/services/examService";
import { notificationService } from "@/lib/notification-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, UserPlus, Mail, Calendar, BookOpen } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

import { toast } from "sonner";

interface StudentManagementProps {
  students: Student[];
  exams: Exam[];
  onRefresh: () => void;
}

export function StudentManagement({ students, exams, onRefresh }: StudentManagementProps) {
  // const { toast } = useToast();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedExam, setSelectedExam] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignExam = () => {
    if (!selectedStudent || !selectedExam) return;

    examService.assignExamToStudent(selectedStudent.id, selectedExam);

    const exam = exams.find((e) => e.id === selectedExam);
    if (exam) {
      notificationService.notifyExamAssigned(selectedStudent.id, exam.title, exam.id);

      // Simulate email notification
      notificationService.sendEmailNotification(
        selectedStudent.email,
        "New Exam Assigned",
        `You have been assigned to take "${exam.title}". Please log in to your CBT Pro account to view details.`
      );
    }

    toast.success("Success", {
      description: `Exam assigned to ${selectedStudent.name} successfully! Notification sent.`,
    });

    setShowAssignDialog(false);
    setSelectedStudent(null);
    setSelectedExam("");
    onRefresh();
  };

  const getAssignedExamsCount = (studentId: string) => {
    const assignedExams = JSON.parse(localStorage.getItem(`student_exams_${studentId}`) || "[]");
    return assignedExams.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Student Management</h2>
          <p className="text-muted-foreground">Manage students and assign exams</p>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.filter((e) => e.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Available for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.reduce((sum, student) => sum + getAssignedExamsCount(student.id), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Exam assignments</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>All registered students and their assigned exams</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Assigned Exams</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                        {student.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {new Date(student.registeredAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getAssignedExamsCount(student.id)} exams</Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={showAssignDialog && selectedStudent?.id === student.id}
                        onOpenChange={(open) => {
                          setShowAssignDialog(open);
                          if (open) setSelectedStudent(student);
                          else setSelectedStudent(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Assign Exam
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Exam to {student.name}</DialogTitle>
                            <DialogDescription>
                              Select an exam to assign to this student
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Select Exam</label>
                              <Select value={selectedExam} onValueChange={setSelectedExam}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose an exam" />
                                </SelectTrigger>
                                <SelectContent>
                                  {exams
                                    .filter((e) => e.isActive)
                                    .map((exam) => (
                                      <SelectItem key={exam.id} value={exam.id}>
                                        {exam.title} ({exam.questions.length} questions,{" "}
                                        {exam.duration} min)
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleAssignExam} disabled={!selectedExam}>
                                Assign Exam
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No students match your search criteria"
                  : "No students have registered yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
