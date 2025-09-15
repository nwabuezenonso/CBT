import { useState } from "react";

const useExamManagement = () => {
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [exams, setExams] = useState<any[]>([
    {
      id: "1",
      title: "General Knowledge Test",
      subject: "General",
      duration: 60,
      questions: [],
      status: "active",
      examinees: 45,
      created: "2024-01-10",
    },
    {
      id: "2",
      title: "Computer Science Fundamentals",
      subject: "Computer Science",
      duration: 90,
      questions: [],
      status: "draft",
      examinees: 0,
      created: "2024-01-12",
    },
  ]);

  const [newExam, setNewExam] = useState({
    title: "",
    subject: "",
    duration: 60,
    instructions: "",
    passingScore: 70,
    maxAttempts: 1,
    shuffleQuestions: true,
    showResults: true,
  });

  const [newQuestion, setNewQuestion] = useState<any>({
    id: "",
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
  });

  const handleCreateExam = () => {
    const exam = {
      id: Date.now().toString(),
      title: newExam.title,
      subject: newExam.subject,
      duration: newExam.duration,
      questions: [],
      status: "draft",
      examinees: 0,
      created: new Date().toISOString().split("T")[0],
    };

    setExams([...exams, exam]);
    setShowCreateExam(false);
    setNewExam({
      title: "",
      subject: "",
      duration: 60,
      instructions: "",
      passingScore: 70,
      maxAttempts: 1,
      shuffleQuestions: true,
      showResults: true,
    });
  };

  const handleAddQuestion = () => {
    if (selectedExam) {
      const questionWithId = {
        ...newQuestion,
        id: Date.now().toString(),
      };

      setExams(
        exams.map((exam) =>
          exam.id === selectedExam
            ? { ...exam, questions: [...exam.questions, questionWithId] }
            : exam
        )
      );

      setShowCreateQuestion(false);
      setNewQuestion({
        id: "",
        type: "multiple-choice",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedExamData = exams.find((exam) => exam.id === selectedExam);

  return {
    getStatusColor,
    filteredExams,
    setShowCreateExam,
    searchTerm,
    setSearchTerm,
    setSelectedExam,
    showCreateExam,
    handleCreateExam,
    selectedExam,
    selectedExamData,
    setShowCreateQuestion,
    newQuestion,
    setNewExam,
    setNewQuestion,
    handleAddQuestion,
  };
};

export default useExamManagement;
