"use client";

import { useState } from "react";
import { examService, type Exam, type Student, type ExamResult } from "@/services/examService";
import { ExamManagement } from "@/components/examiner";
import { useAuth } from "@/hooks/use-auth";

export default function ExamManagementPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);

  const refreshData = () => {
    if (user) {
      setExams(examService.getExams(user.id));
      setStudents(examService.getStudents());
      setResults(examService.getExamResults());
    }
  };

  return <ExamManagement exams={exams} onRefresh={refreshData} />;
}
