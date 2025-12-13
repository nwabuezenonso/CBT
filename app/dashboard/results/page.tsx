"use client";

import React from "react";
import { useState } from "react";

import { type Exam, type ExamResult } from "@/services/examService";
import { ResultsAnalytics } from "@/components/examiner";

const ResultManagementPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);

  return <ResultsAnalytics exams={exams} results={results} />;
};

export default ResultManagementPage;
