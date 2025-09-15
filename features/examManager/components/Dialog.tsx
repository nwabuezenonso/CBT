"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Save, Plus, FileText, X, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (exam: any) => void;
}

export function CreateExamDialog({ open, onOpenChange, onCreate }: Props) {
  const [newExam, setNewExam] = useState<any>({
    title: "",
    subject: "",
    duration: 0,
    passingScore: 0,
    instructions: "",
    shuffleQuestions: false,
    showResults: false,
  });

  function handleSubmit() {
    onCreate(newExam);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exam</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="text-sm font-medium">Exam Title *</label>
            <Input
              value={newExam.title}
              onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
              placeholder="Enter exam title"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Subject *</label>
            <Input
              value={newExam.subject}
              onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
              placeholder="Enter subject"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Duration (minutes) *</label>
            <Input
              type="number"
              value={newExam.duration}
              onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) || 0 })}
              min={1}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Passing Score (%)</label>
            <Input
              type="number"
              value={newExam.passingScore}
              onChange={(e) =>
                setNewExam({ ...newExam, passingScore: parseInt(e.target.value) || 0 })
              }
              min={0}
              max={100}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium">Instructions</label>
          <Textarea
            rows={4}
            value={newExam.instructions}
            onChange={(e) => setNewExam({ ...newExam, instructions: e.target.value })}
            placeholder="Enter exam instructions..."
          />
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shuffleQuestions"
              checked={newExam.shuffleQuestions}
              onCheckedChange={(checked) =>
                setNewExam({ ...newExam, shuffleQuestions: Boolean(checked) })
              }
            />
            <label htmlFor="shuffleQuestions" className="text-sm">
              Shuffle Questions
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showResults"
              checked={newExam.showResults}
              onCheckedChange={(checked) =>
                setNewExam({ ...newExam, showResults: Boolean(checked) })
              }
            />
            <label htmlFor="showResults" className="text-sm">
              Show Results to Students
            </label>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!newExam.title || !newExam.subject}>
            <Save size={16} className="mr-2" />
            Create Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SelectExamsDialog({
  selectedExam,
  setSelectedExam,
  selectedExamData,
  setShowCreateQuestion,
}: any) {
  return (
    selectedExam &&
    selectedExamData && (
      <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle>{selectedExamData.title} - Questions</DialogTitle>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => setShowCreateQuestion(true)} className="gap-2">
                <Plus size={16} />
                Add Question
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Stats Section */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold">{selectedExamData.questions.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold">
                  {selectedExamData.questions.reduce((acc: any, q: any) => acc + q.points, 0)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold">{selectedExamData.duration}min</p>
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4">
              {selectedExamData.questions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No questions added yet</p>
                  <Button className="mt-4" onClick={() => setShowCreateQuestion(true)}>
                    Add First Question
                  </Button>
                </div>
              ) : (
                selectedExamData.questions.map((question: any, index: any) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            Q{index + 1}
                          </span>
                          <span className="text-sm text-gray-500">
                            {question.type.replace("-", " ").toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {question.points} point{question.points > 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium">{question.question}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </div>

                    {question.type === "multiple-choice" && question.options && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {question.options.map((option: any, optIndex: any) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded text-sm ${
                              optIndex === question.correctAnswer
                                ? "bg-green-50 border border-green-200 text-green-800"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}

export const CreateQuestionModal: React.FC<any> = ({
  open,
  onClose,
  newQuestion,
  setNewQuestion,
  onAddQuestion,
}) => {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Add New Question</DialogTitle>
          <DialogClose asChild>
            <button className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* Question Type + Points */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Question Type</Label>
              <select
                value={newQuestion.type}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    type: e.target.value,
                  })
                }
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="essay">Essay</option>
              </select>
            </div>

            <div>
              <Label>Points</Label>
              <Input
                type="number"
                value={newQuestion.points}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    points: parseInt(e.target.value) || 1,
                  })
                }
                min={1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Question */}
          <div>
            <Label>Question *</Label>
            <Textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              rows={3}
              className="mt-2"
              placeholder="Enter your question..."
            />
          </div>

          {/* Multiple Choice */}
          {newQuestion.type === "multiple-choice" && (
            <div>
              <Label>Options</Label>
              <div className="space-y-3 mt-3">
                {newQuestion.options?.map((option: any, index: any) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correctAnswer === index}
                      onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                      className="h-4 w-4 text-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 min-w-0">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <Input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(newQuestion.options || [])];
                        newOptions[index] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Select the correct answer by clicking the radio button
              </p>
            </div>
          )}

          {/* True/False */}
          {newQuestion.type === "true-false" && (
            <div>
              <Label>Correct Answer</Label>
              <div className="flex gap-6 mt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tfAnswer"
                    checked={newQuestion.correctAnswer === "true"}
                    onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: "true" })}
                    className="h-4 w-4 text-primary"
                  />
                  <span>True</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tfAnswer"
                    checked={newQuestion.correctAnswer === "false"}
                    onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: "false" })}
                    className="h-4 w-4 text-primary"
                  />
                  <span>False</span>
                </label>
              </div>
            </div>
          )}

          {/* Essay Note */}
          {newQuestion.type === "essay" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Essay questions will be graded manually by the instructor.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={onAddQuestion}
            disabled={
              !newQuestion.question ||
              (newQuestion.type === "multiple-choice" &&
                (!newQuestion.options?.every((opt: any) => opt.trim()) ||
                  newQuestion.correctAnswer === undefined)) ||
              (newQuestion.type === "true-false" && !newQuestion.correctAnswer)
            }
          >
            <Save size={16} className="mr-2" />
            Add Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
