import React from "react";
import { Plus, Eye, Edit, Download, Trash2, Clock, Search, Filter } from "lucide-react";

import { CreateExamDialog, CreateQuestionModal, SelectExamsDialog } from "./components/Dialog";
import useExamManagement from "./hooks/useExamManagement";

interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "essay";
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questions: Question[];
  status: "active" | "draft" | "archived";
  examinees: number;
  created: string;
}

const ExamManager = () => {
  const {
    filteredExams,
    getStatusColor,
    handleAddQuestion,
    handleCreateExam,
    newQuestion,
    searchTerm,
    selectedExam,
    selectedExamData,
    setSearchTerm,
    setSelectedExam,
    setShowCreateExam,
    setShowCreateQuestion,
    setNewQuestion,
    showCreateExam,
  } = useExamManagement();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Exams</h2>
                <p className="text-gray-600">Manage your CBT system</p>
              </div>
              <button
                onClick={() => setShowCreateExam(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Create Exam
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={20} />
                Filter
              </button>
            </div>
          </div>

          {/* Exams Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Questions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Examinees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                          <div className="text-sm text-gray-500">Created: {exam.created}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Clock size={16} className="text-gray-400" />
                          {exam.duration} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam.questions.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            exam.status
                          )}`}
                        >
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam.examinees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-600 hover:text-blue-600">
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setSelectedExam(exam.id)}
                            className="text-gray-600 hover:text-green-600"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-blue-600">
                            <Download size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <CreateExamDialog
        open={showCreateExam}
        onOpenChange={setShowCreateExam}
        onCreate={handleCreateExam}
      />

      <SelectExamsDialog
        selectedExam={selectedExam}
        setSelectedExam={setSelectedExam}
        selectedExamData={selectedExamData}
        setShowCreateQuestion={setShowCreateQuestion}
      />

      <CreateQuestionModal
        open={showCreateExam}
        onClose={false}
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        onAddQuestion={handleAddQuestion}
      />
    </div>
  );
};

export default ExamManager;
