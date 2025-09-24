"use client";

import { useState } from "react";
import { StudentManagement } from "@/components/examiner";
import { examService, type Exam, type Student, type ExamResult } from "@/services/examService";
import { useAuth } from "@/hooks/use-auth";

const StudentManagementPage = () => {
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

  return <StudentManagement exams={exams} onRefresh={refreshData} students={students} />;
};

export default StudentManagementPage;
