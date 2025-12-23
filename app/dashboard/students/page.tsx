"use client";

import { useState, useEffect } from "react";
import { ExamineeManagement } from "@/components/examiner";
import { examService, type Exam, type Student, type ExamResult } from "@/services/examService";
import { useAuth } from "@/hooks/use-auth";

const StudentManagementPage = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);

  const loadData = async () => {
    if (user) {
      try {
        const fetchedExams = await examService.getExams();
        setExams(fetchedExams);
        const fetchedStudents = await examService.getStudents();
        setStudents(fetchedStudents);
        const fetchedResults = await examService.getExamResults();
        setResults(fetchedResults);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const refreshData = () => {
    loadData();
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return <ExamineeManagement exams={exams} onRefresh={refreshData} students={students} />;
};

export default StudentManagementPage;
