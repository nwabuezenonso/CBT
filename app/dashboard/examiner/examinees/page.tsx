"use client";

import { useEffect, useState } from "react";
import { ExamineeManagement } from "@/components/examiner";
import { registrationService } from "@/services/registrationService";
import { examService, type Exam } from "@/services/examService";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  status?: string;
  className?: string;
}

export default function ExamineesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedStudents, fetchedExams, fetchedAssignments] = await Promise.all([
        examService.getStudents(),
        examService.getExams(),
        examService.getStudentAssignments()
      ]);

      setExams(fetchedExams);
      setAssignments(fetchedAssignments);
      setStudents(fetchedStudents as any); // Type assertion needed due to local vs imported interface mismatch if any

    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load examinees data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading examinees...</div>;
  }

  return (
    <ExamineeManagement
      students={students}
      exams={exams}
      assignments={assignments}
      onRefresh={fetchData}
    />
  );
}
