export interface Question {
  _id?: string; // Mongoose uses _id
  id?: string; // For backward compatibility if needed
  type: "multiple-choice" | "essay" | "true-false" | "short-answer";
  questionText: string; // Schema uses questionText
  options?: string[];
  correctAnswer?: number | string; // Correct answer index or text
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  tags?: string[];
}

export interface Exam {
  _id: string;
  id?: string;
  title: string;
  subject: string;
  description: string;
  duration: number;
  questions: Question[];
  examinerId: string;
  createdAt: string;
  status: string;
  totalPoints: number;
  isActive: boolean; // Added
  scheduledDate?: string; // Added
}

export interface ExamResult {
  _id: string;
  examId: string | { title: string }; // Populated or ID
  examineeId: string | { name: string; email: string };
  score: number;
  totalQuestions: number;
  percentage?: number; // Calculated on client for display if not in DB
  submittedAt: string;
}

export interface Student {
  id: string; // User ID
  studentId?: string; // Profile ID
  name: string;
  email: string;
  registeredAt: string;
  status?: string; // Add status
  className?: string; // Add class name
}

export const examService = {
  // Mock Data Access for Admin Dashboard
  // Data Access for Dashboard
  getStudents: async (): Promise<Student[]> => {
    const res = await fetch('/api/students');
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  // Exam Management
  getExams: async (): Promise<Exam[]> => {
    const res = await fetch('/api/exams');
    if (!res.ok) throw new Error('Failed to fetch exams');
    const data = await res.json();
    return data.map((exam: any) => ({
      ...exam,
      id: exam._id,
      questions: exam.questions?.map((q: any) => ({ ...q, id: q._id })) || [],
      totalPoints: exam.questions?.reduce((sum: number, q: any) => sum + (q.points || 1), 0) || 0
    }));
  },

  getExam: async (id: string): Promise<Exam | null> => {
    const res = await fetch(`/api/exams/${id}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch exam');
    }
    const data = await res.json();
    return {
      ...data,
      id: data._id,
      questions: data.questions?.map((q: any) => ({ ...q, id: q._id })) || [],
      totalPoints: data.questions?.reduce((sum: number, q: any) => sum + (q.points || 1), 0) || 0
    };
  },

  createExam: async (examData: Partial<Exam>) => {
    const res = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData),
    });
    // if (!res.ok) {
    //   const errorData = await res.json();
    //   throw new Error(errorData.message || 'Failed to create exam');
    // }
    return res.json();
  },

  updateExam: async (id: string, updates: Partial<Exam>) => {
    const res = await fetch(`/api/exams/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update exam');
    return res.json();
  },

  deleteExam: async (id: string) => {
    const res = await fetch(`/api/exams/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete exam');
    return res.json();
  },

  // Results Management
  submitExamResult: async (data: { examId: string; answers: Record<string, string>; timeSpent: number }) => {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit exam');
    }
    return res.json();
  },

  getExamResults: async (): Promise<ExamResult[]> => {
    const res = await fetch('/api/results');
    if (!res.ok) throw new Error('Failed to fetch results');
    return res.json();
  },

  assignExamToStudent: async (student: { id: string; name: string; email: string }, exam: { id: string; title: string }) => {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        examId: exam.id,
        examTitle: exam.title
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to assign exam");
    }
    return res.json();
  },

  getStudentAssignments: async (studentId?: string) => {
    const url = studentId ? `/api/assignments?studentId=${studentId}` : '/api/assignments';
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch assignments");
    return res.json();
  }
};

export const questionService = {
  getQuestions: async () => {
    const res = await fetch('/api/questions');
    if (!res.ok) throw new Error('Failed to fetch questions');
    return res.json();
  },

  createQuestion: async (questionData: Partial<Question>) => {
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData),
    });
    if (!res.ok) throw new Error('Failed to create question');
    return res.json();
  },

  updateQuestion: async (id: string, questionData: Partial<Question>) => {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData),
    });
    if (!res.ok) throw new Error('Failed to update question');
    return res.json();
  },

  deleteQuestion: async (id: string) => {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete question');
    return res.json();
  }
};
