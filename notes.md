// import { useState } from "react"
// import { LoginPage } from "@/components/login-page"
// import { ExamInterface } from "@/components/exam-interface"
// import { ResultPage } from "@/components/result-page"

// export type ExamState = "login" | "exam" | "result"

// export interface Question {
// id: number
// question: string
// options: string[]
// correctAnswer: number
// }

// export interface ExamData {
// title: string
// duration: number // in minutes
// questions: Question[]
// }

// // Sample exam data
// const sampleExam: ExamData = {
// title: "Computer Science Fundamentals",
// duration: 60,
// questions: [
// {
// id: 1,
// question: "What does CPU stand for?",
// options: [
// "Central Processing Unit",
// "Computer Personal Unit",
// "Central Program Unit",
// "Computer Processing Unit",
// ],
// correctAnswer: 0,
// },
// {
// id: 2,
// question: "Which of the following is a programming language?",
// options: ["HTML", "CSS", "JavaScript", "All of the above"],
// correctAnswer: 3,
// },
// {
// id: 3,
// question: "What is the binary representation of decimal 8?",
// options: ["1000", "1001", "1010", "1100"],
// correctAnswer: 0,
// },
// {
// id: 4,
// question: "Which data structure follows LIFO principle?",
// options: ["Queue", "Stack", "Array", "Linked List"],
// correctAnswer: 1,
// },
// {
// id: 5,
// question: "What does RAM stand for?",
// options: ["Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Remote Access Memory"],
// correctAnswer: 0,
// },
// ],
// }

// export default function CBTApp() {
// const [currentState, setCurrentState] = useState<ExamState>("login")
// const [examData, setExamData] = useState<ExamData | null>(null)
// const [userAnswers, setUserAnswers] = useState<number[]>([])
// const [score, setScore] = useState(0)

// const handleLogin = (examId: string, password: string) => {
// // In a real app, this would validate credentials and fetch exam data
// setExamData(sampleExam)
// setUserAnswers(new Array(sampleExam.questions.length).fill(-1))
// setCurrentState("exam")
// }

// const handleExamSubmit = (answers: number[]) => {
// if (!examData) return

// let correctCount = 0
// examData.questions.forEach((question, index) => {
// if (answers[index] === question.correctAnswer) {
// correctCount++
// }
// })

// setScore(correctCount)
// setUserAnswers(answers)
// setCurrentState("result")
// }

// const handleRestart = () => {
// setCurrentState("login")
// setExamData(null)
// setUserAnswers([])
// setScore(0)
// }

// if (currentState === "login") {
// return <LoginPage onLogin={handleLogin} />
// }

// if (currentState === "exam" && examData) {
// return <ExamInterface examData={examData} onSubmit={handleExamSubmit} />
// }

// if (currentState === "result" && examData) {
// return (
// <ResultPage
// score={score}
// totalQuestions={examData.questions.length}
// examData={examData}
// userAnswers={userAnswers}
// onRestart={handleRestart}
// />
// )
// }

// return null
// }
