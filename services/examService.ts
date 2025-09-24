export interface Question {
  id: string
  type: "multiple-choice" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
}

export interface Exam {
  id: string
  title: string
  description: string
  duration: number // in minutes
  questions: Question[]
  createdBy: string
  createdAt: string
  scheduledDate?: string
  isActive: boolean
  totalPoints: number
}

export interface ExamResult {
  id: string
  examId: string
  studentId: string
  studentName: string
  studentEmail: string
  answers: Record<string, string>
  score: number
  totalPoints: number
  percentage: number
  completedAt: string
  timeSpent: number // in minutes
}

export interface Student {
  id: string
  name: string
  email: string
  registeredAt: string
  assignedExams: string[]
}

export const examService = {
  // Exam Management
  createExam: (exam: Omit<Exam, "id" | "createdAt" | "totalPoints">): Exam => {
    const newExam: Exam = {
      ...exam,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalPoints: exam.questions.reduce((sum, q) => sum + q.points, 0),
    }

    const exams = JSON.parse(localStorage.getItem("cbt_exams") || "[]")
    exams.push(newExam)
    localStorage.setItem("cbt_exams", JSON.stringify(exams))

    return newExam
  },

  getExams: (createdBy?: string): Exam[] => {
    const exams = JSON.parse(localStorage.getItem("cbt_exams") || "[]")
    return createdBy ? exams.filter((e: Exam) => e.createdBy === createdBy) : exams
  },

  getExam: (id: string): Exam | null => {
    const exams = JSON.parse(localStorage.getItem("cbt_exams") || "[]")
    return exams.find((e: Exam) => e.id === id) || null
  },

  updateExam: (id: string, updates: Partial<Exam>): Exam | null => {
    const exams = JSON.parse(localStorage.getItem("cbt_exams") || "[]")
    const index = exams.findIndex((e: Exam) => e.id === id)

    if (index === -1) return null

    exams[index] = { ...exams[index], ...updates }
    localStorage.setItem("cbt_exams", JSON.stringify(exams))

    return exams[index]
  },

  deleteExam: (id: string): boolean => {
    const exams = JSON.parse(localStorage.getItem("cbt_exams") || "[]")
    const filtered = exams.filter((e: Exam) => e.id !== id)

    if (filtered.length === exams.length) return false

    localStorage.setItem("cbt_exams", JSON.stringify(filtered))
    return true
  },

  // Student Management
  getStudents: (): Student[] => {
    const users = JSON.parse(localStorage.getItem("cbt_users") || "[]")
    return users
      .filter((u: any) => u.role === "student")
      .map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        registeredAt: u.createdAt,
        assignedExams: JSON.parse(localStorage.getItem(`student_exams_${u.id}`) || "[]"),
      }))
  },

  assignExamToStudent: (studentId: string, examId: string): boolean => {
    const assignedExams = JSON.parse(localStorage.getItem(`student_exams_${studentId}`) || "[]")

    if (!assignedExams.includes(examId)) {
      assignedExams.push(examId)
      localStorage.setItem(`student_exams_${studentId}`, JSON.stringify(assignedExams))
    }

    return true
  },

  // Results Management
  getExamResults: (examId?: string): ExamResult[] => {
    const results = JSON.parse(localStorage.getItem("cbt_results") || "[]")
    return examId ? results.filter((r: ExamResult) => r.examId === examId) : results
  },

  submitExamResult: (result: Omit<ExamResult, "id">): ExamResult => {
    const newResult: ExamResult = {
      ...result,
      id: Date.now().toString(),
    }

    const results = JSON.parse(localStorage.getItem("cbt_results") || "[]")
    results.push(newResult)
    localStorage.setItem("cbt_results", JSON.stringify(results))

    return newResult
  },
}
