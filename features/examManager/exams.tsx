import { useState } from "react"; 
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  FileText,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  status: "draft" | "active" | "completed";
  createdAt: string;
  examinees: number;
}

 export const RenderExams = () => {


     const [showExamModal, setShowExamModal] = useState(false);
      const [exams, setExams] = useState<Exam[]>([
         {
           id: "1",
           title: "General Knowledge Test",
           subject: "General",
           duration: 60,
           totalQuestions: 20,
           status: "active",
           createdAt: "2024-01-10",
           examinees: 45,
         },
         {
           id: "2",
           title: "Computer Science Fundamentals",
           subject: "Computer Science",
           duration: 90,
           totalQuestions: 30,
           status: "draft",
           createdAt: "2024-01-12",
           examinees: 0,
         },
       ]);
     
       return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Exam Management</h2>
        <button
          onClick={() => setShowExamModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Exam
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Exam Title</th>
                <th className="text-left p-4 font-medium text-gray-700">Subject</th>
                <th className="text-left p-4 font-medium text-gray-700">Duration</th>
                <th className="text-left p-4 font-medium text-gray-700">Questions</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Examinees</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-gray-500">Created: {exam.createdAt}</p>
                  </td>
                  <td className="p-4 text-gray-700">{exam.subject}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-gray-400" />
                      <span>{exam.duration} min</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{exam.totalQuestions}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        exam.status === "active"
                          ? "bg-green-100 text-green-800"
                          : exam.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{exam.examinees}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-500 hover:text-blue-600">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-blue-600">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-green-600">
                        <Download size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-600">
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
    </div>)
 };


