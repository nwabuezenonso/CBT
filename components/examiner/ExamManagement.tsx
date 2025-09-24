"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { examService, type Exam, type Question } from "@/services/examService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Trash2, Clock, BookOpen, Save, X, Edit, FileText } from "lucide-react";
// import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner";
// import { RegistrationFormManager } from "./registration-form-manager"

import { RegistrationFormManager } from "./RegistrationFormManagement";
import { Users } from "lucide-react";

interface ExamManagementProps {
  exams: Exam[];
  onRefresh: () => void;
}

export function ExamManagement({ exams, onRefresh }: ExamManagementProps) {
  const { user } = useAuth();
  // const { toast } = useToast()
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQuestionsSheet, setShowQuestionsSheet] = useState(false);
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const [showRegistrationManager, setShowRegistrationManager] = useState(false);
  const [selectedExamForRegistration, setSelectedExamForRegistration] = useState<Exam | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60,
    scheduledDate: "",
    isActive: false,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: 60,
      scheduledDate: "",
      isActive: false,
    });
    setQuestions([]);
    setCurrentQuestion({
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    });
    setCurrentExamId(null);
    setSelectedExamForRegistration(null);
  };

  const handleCreateExamInfo = () => {
    if (!user || !formData.title) {
      toast.error("Error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    const examId = Date.now().toString();
    setCurrentExamId(examId);
    setShowCreateDialog(false);
    setShowQuestionsSheet(true);
  };

  const addQuestion = () => {
    if (!currentQuestion.question) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type as "multiple-choice" | "essay",
      question: currentQuestion.question,
      options: currentQuestion.type === "multiple-choice" ? currentQuestion.options : undefined,
      correctAnswer:
        currentQuestion.type === "multiple-choice" ? currentQuestion.correctAnswer : undefined,
      points: currentQuestion.points || 1,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const editQuestion = (index: number) => {
    const question = questions[index];
    setCurrentQuestion(question);
    removeQuestion(index);
  };

  const handleFinalizeExam = () => {
    if (!user || !currentExamId || questions.length === 0) {
      toast.error("Error", {
        description: "Please add at least one question to complete the exam.",
      });
      return;
    }

    try {
      examService.createExam({
        ...formData,
        questions,
        createdBy: user.id,
      });

      toast.success("Success", {
        description: "Exam created successfully!",
      });

      resetForm();
      setShowQuestionsSheet(false);
      3;
      onRefresh();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create exam.",
      });
    }
  };

  const handleManageQuestions = (exam: Exam) => {
    setCurrentExamId(exam.id);
    setQuestions(exam.questions);
    setFormData({
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      scheduledDate: exam.scheduledDate || "",
      isActive: exam.isActive,
    });
    setShowQuestionsSheet(true);
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      examService.deleteExam(examId);
      toast.success("Success", {
        description: "Exam deleted successfully!",
      });
      onRefresh();
    }
  };

  const toggleExamStatus = (examId: string, currentStatus: boolean) => {
    examService.updateExam(examId, { isActive: !currentStatus });
    toast.success("Success", {
      description: `Exam ${!currentStatus ? "activated" : "deactivated"} successfully!`,
    });
    onRefresh();
  };

  const handleManageRegistration = (exam: Exam) => {
    setSelectedExamForRegistration(exam);
    setShowRegistrationManager(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exam Management</h2>
          <p className="text-muted-foreground">Create and manage your exams</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>Set up your exam basic information</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter exam title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Enter exam description"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateExamInfo}>
                  Next: Add Questions
                  <FileText className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Sheet open={showQuestionsSheet} onOpenChange={setShowQuestionsSheet}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {currentExamId && exams.find((e) => e.id === currentExamId)
                ? "Manage Questions"
                : "Add Questions"}
            </SheetTitle>
            <SheetDescription>
              {formData.title && `Questions for: ${formData.title}`}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Add Question</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={currentQuestion.type}
                    onValueChange={(value) =>
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        type: value as "multiple-choice" | "essay",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) =>
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        points: Number.parseInt(e.target.value),
                      }))
                    }
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea
                  value={currentQuestion.question}
                  onChange={(e) =>
                    setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))
                  }
                  placeholder="Enter your question"
                />
              </div>

              {currentQuestion.type === "multiple-choice" && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(currentQuestion.options || [])];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant={currentQuestion.correctAnswer === index ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setCurrentQuestion((prev) => ({ ...prev, correctAnswer: index }))
                        }
                      >
                        Correct
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button type="button" onClick={addQuestion} disabled={!currentQuestion.question}>
                Add Question
              </Button>
            </div>

            {questions.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Questions ({questions.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-muted-foreground">
                          {question.type} • {question.points} points
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => editQuestion(index)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowQuestionsSheet(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleFinalizeExam} disabled={questions.length === 0}>
                <Save className="w-4 h-4 mr-2" />
                {currentExamId && exams.find((e) => e.id === currentExamId)
                  ? "Update Exam"
                  : "Create Exam"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{exam.title}</CardTitle>
                  <CardDescription className="mt-1">{exam.description}</CardDescription>
                </div>
                <Badge variant={exam.isActive ? "default" : "secondary"}>
                  {exam.isActive ? "Active" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {exam.questions.length} questions
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {exam.duration} min
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Points: {exam.totalPoints}</span>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleManageQuestions(exam)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Questions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => toggleExamStatus(exam.id, exam.isActive)}
                  >
                    {exam.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleManageRegistration(exam)}
                >
                  <Users className="w-4 h-4 mr-1" />
                  Registration Form
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive bg-transparent"
                  onClick={() => handleDeleteExam(exam.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {exams.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No exams yet</h3>
            <p className="text-muted-foreground mb-4">Create your first exam to get started</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Exam
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedExamForRegistration && (
        <RegistrationFormManager
          examId={selectedExamForRegistration.id}
          examTitle={selectedExamForRegistration.title}
          isOpen={showRegistrationManager}
          onClose={() => {
            setShowRegistrationManager(false);
            setSelectedExamForRegistration(null);
          }}
        />
      )}
    </div>
  );
}
