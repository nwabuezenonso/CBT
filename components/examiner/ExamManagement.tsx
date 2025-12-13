"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { examService, questionService, type Exam, type Question } from "@/services/examService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  DialogFooter
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  Plus, 
  Trash2, 
  Clock, 
  BookOpen, 
  Save, 
  X, 
  Edit, 
  FileText, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  CheckCircle,
  AlertCircle,
  LayoutGrid,
  List,
  Download
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";
import { RegistrationFormManager } from "./RegistrationFormManagement";
import { Users } from "lucide-react";
import { format } from "date-fns"; // Assuming date-fns is installed or use native Intl

interface ExamManagementProps {
  exams: Exam[];
  onRefresh: () => void;
}

export function ExamManagement({ exams, onRefresh }: ExamManagementProps) {
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQuestionsSheet, setShowQuestionsSheet] = useState(false);
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const [showRegistrationManager, setShowRegistrationManager] = useState(false);
  const [selectedExamForRegistration, setSelectedExamForRegistration] = useState<Exam | null>(null);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60,
    scheduledDate: "",
    isActive: false,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [selectedBankQuestions, setSelectedBankQuestions] = useState<string[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    questionText: "",
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
      questionText: "",
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
    if (!currentQuestion.questionText) return;

    const newQuestion: Question = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      type: currentQuestion.type as "multiple-choice" | "essay" | "true-false" | "short-answer",
      questionText: currentQuestion.questionText,
      options: currentQuestion.type === "multiple-choice" ? currentQuestion.options : undefined,
      correctAnswer:
        currentQuestion.type === "multiple-choice" ? currentQuestion.correctAnswer : undefined,
      points: currentQuestion.points || 1,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      type: "multiple-choice",
      questionText: "",
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
      // Sanitize questions to remove frontend IDs and ensure correct structure
      const sanitizedQuestions = questions.map(({ id, _id, ...q }) => ({
        ...q,
        // Ensure correctAnswer is undefined if type is essay (double safety)
        correctAnswer: q.type === 'essay' ? undefined : q.correctAnswer
      }));

      examService.createExam({
        ...formData,
        questions: sanitizedQuestions,
        examinerId: user.id,
      });

      toast.success("Success", {
        description: "Exam created successfully!",
      });

      resetForm();
      setShowQuestionsSheet(false);
      onRefresh();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create exam.",
      });
    }
  };

  const handleManageQuestions = (exam: Exam) => {
    setCurrentExamId(exam.id || exam._id);
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

  const handleDeleteExam = async (examId: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      try {
        await examService.deleteExam(examId);
        toast.success("Success", {
          description: "Exam deleted successfully!",
        });
        onRefresh();
      } catch (error) {
        toast.error("Error", {
          description: "Failed to delete exam",
        });
      }
    }
  };

  const toggleExamStatus = async (examId: string, currentStatus: boolean) => {
    try {
      await examService.updateExam(examId, { isActive: !currentStatus });
      toast.success("Success", {
        description: `Exam ${!currentStatus ? "activated" : "deactivated"} successfully!`,
      });
      onRefresh();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update exam status",
      });
    }
  };

  const handleManageRegistration = (exam: Exam) => {
    setSelectedExamForRegistration(exam);
    setShowRegistrationManager(true);
  };

  const openImportDialog = async () => {
    try {
      const data = await questionService.getQuestions();
      setBankQuestions(data);
      setShowImportDialog(true);
    } catch (error) {
      toast.error("Failed to fetch questions from bank");
    }
  };

  const handleImportToggle = (questionId: string) => {
    setSelectedBankQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const importSelectedQuestions = () => {
    const questionsToImport = bankQuestions.filter(q => selectedBankQuestions.includes(q._id || q.id!));
    
    // Assign new unique IDs to imported questions to avoid conflicts if imported multiple times
    const newQuestions = questionsToImport.map(q => ({
      ...q,
      _id: Date.now().toString() + Math.random().toString().slice(2, 5),
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
    }));

    setQuestions([...questions, ...newQuestions]);
    setShowImportDialog(false);
    setSelectedBankQuestions([]);
    toast.success(`Imported ${questionsToImport.length} questions`);
  };

  // Filtering Logic
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exam.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && exam.isActive) || 
                          (statusFilter === "draft" && !exam.isActive);
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalExams = exams.length;
  const activeExams = exams.filter(e => e.isActive).length;
  const draftExams = exams.filter(e => !e.isActive).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExams}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Active Exams</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{activeExams}</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Drafts</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{draftExams}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Exams</h1>
          <p className="text-muted-foreground mt-1">Manage, create, and monitoring your examinations.</p>
        </div>
        
        <div className="flex flex-1 md:flex-none w-full md:w-auto items-center gap-2">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           
           <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                 <Filter className="h-4 w-4 text-muted-foreground" />
                 <SelectValue placeholder="All Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
           </Select>

            <div className="flex items-center gap-1 border rounded-md p-1 bg-muted/20 mr-2">
               <Button 
                 variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                 size="icon" 
                 className="h-8 w-8"
                 onClick={() => setViewMode('grid')}
               >
                 <LayoutGrid className="w-4 h-4" />
               </Button>
               <Button 
                 variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                 size="icon" 
                 className="h-8 w-8"
                 onClick={() => setViewMode('list')}
               >
                 <List className="w-4 h-4" />
               </Button>
            </div>

            <Button onClick={() => setShowCreateDialog(true)}>
               <Plus className="w-4 h-4 mr-2" />
               <span className="hidden sm:inline">Create Exam</span>
               <span className="sm:hidden">New</span>
             </Button>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
                    placeholder="e.g. Midterm Mathematics"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: Number.parseInt(e.target.value) || 0,
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
                  placeholder="Provide brief instructions..."
                />
              </div>
             </div>
             
             <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateExamInfo}>
                  Next: Add Questions
                  <FileText className="w-4 h-4 ml-2" />
                </Button>
             </DialogFooter>
          </DialogContent>
      </Dialog>
      
      {/* Exam Grid / List */}
      {filteredExams.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <Card key={exam.id || exam._id} className={`group hover:shadow-lg transition-all duration-300 ${exam.isActive ? 'border-t-4 border-t-green-500' : 'border-t-4 border-t-orange-500'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                        {exam.title}
                      </CardTitle>
                      <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {exam.createdAt ? new Date(exam.createdAt).toLocaleDateString() : 'Date N/A'}
                        </span>
                        {exam.scheduledDate && (
                           <span className="flex items-center text-orange-500">
                             <Clock className="w-3 h-3 mr-1" />
                             Scheduled
                           </span>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={exam.isActive ? "default" : "secondary"}
                      className={exam.isActive ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {exam.isActive ? "Active" : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4">
                    {exam.description || "No description provided."}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                     <div className="flex items-center bg-muted/50 px-2 py-1 rounded">
                        <BookOpen className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium">{exam.questions.length}</span>
                        <span className="text-muted-foreground ml-1">Questions</span>
                     </div>
                      <div className="flex items-center bg-muted/50 px-2 py-1 rounded">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium">{exam.duration}</span>
                        <span className="text-muted-foreground ml-1">Min</span>
                     </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t bg-muted/10 flex justify-between">
                   <Button variant="ghost" size="sm" onClick={() => handleManageRegistration(exam)}>
                     <Users className="w-4 h-4 mr-2" />
                     Students
                   </Button>
                   
                   <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleManageQuestions(exam)} title="Edit Exam">
                         <Edit className="w-4 h-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem onClick={() => handleManageQuestions(exam)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Manage Questions
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => toggleExamStatus(exam.id || exam._id, exam.isActive)}>
                              {exam.isActive ? <X className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                              {exam.isActive ? "Deactivate Details" : "Activate Exam"}
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteExam(exam.id || exam._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Exam
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id || exam._id}>
                    <TableCell className="font-medium">
                      {exam.title}
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{exam.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={exam.isActive ? "default" : "secondary"}
                        className={exam.isActive ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {exam.isActive ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{exam.questions.length}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>{exam.createdAt ? new Date(exam.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleManageQuestions(exam)}>
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                               <DropdownMenuItem onClick={() => handleManageRegistration(exam)}>
                                  <Users className="w-4 h-4 mr-2" />
                                  Manage Registration
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => toggleExamStatus(exam.id || exam._id, exam.isActive)}>
                                  {exam.isActive ? <X className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                  {exam.isActive ? "Deactivate" : "Activate"}
                               </DropdownMenuItem>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteExam(exam.id || exam._id)}
                                >
                                  Delete
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-muted/10 border-2 border-dashed rounded-xl">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
             <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
             {searchQuery || statusFilter !== 'all' ? "No exams found" : "No exams created yet"}
          </h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
             {searchQuery || statusFilter !== 'all' 
                ? "Try adjusting your search or filters to find what you're looking for." 
                : "Get started by creating your first exam. You can add questions and manage students later."}
          </p>
          {(searchQuery || statusFilter !== 'all') ? (
             <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>
               Clear Filters
             </Button>
          ) : (
             <Button onClick={() => setShowCreateDialog(true)}>
               <Plus className="w-4 h-4 mr-2" />
               Create Exam
             </Button>
          )}
        </div>
      )}

      {/* Questions Sheet (Preserved Logic) */}
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
            <div className="border rounded-lg p-4 space-y-4 bg-card/50">
              <h3 className="font-semibold flex items-center justify-between">
                 <span className="flex items-center"><Plus className="w-4 h-4 mr-2" /> Add New Question</span>
                 <Button variant="outline" size="sm" onClick={openImportDialog}>
                   <Download className="w-4 h-4 mr-2" />
                   Import from Bank
                 </Button>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
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
                    value={currentQuestion.points || ""}
                    onChange={(e) =>
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        points: Number.parseInt(e.target.value) || 0,
                      }))
                    }
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Question Text</Label>
                <Textarea
                  value={currentQuestion.questionText}
                  onChange={(e) =>
                    setCurrentQuestion((prev) => ({ ...prev, questionText: e.target.value }))
                  }
                  placeholder="Enter your question here..."
                  className="min-h-[100px]"
                />
              </div>

              {currentQuestion.type === "multiple-choice" && (
                <div className="space-y-3">
                  <Label>Answer Options</Label>
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                         {String.fromCharCode(65 + index)}
                      </div>
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(currentQuestion.options || [])];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Option ${index + 1}`}
                        className={currentQuestion.correctAnswer === index ? "border-green-500 ring-1 ring-green-500" : ""}
                      />
                      <Button
                        type="button"
                        variant={currentQuestion.correctAnswer === index ? "default" : "outline"}
                        size="icon"
                        className={currentQuestion.correctAnswer === index ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() =>
                          setCurrentQuestion((prev) => ({ ...prev, correctAnswer: index }))
                        }
                        title="Mark as correct"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button type="button" onClick={addQuestion} disabled={!currentQuestion.questionText} className="w-full">
                Add Question to Exam
              </Button>
            </div>

            {questions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <h3 className="font-semibold">Questions ({questions.length})</h3>
                   <Badge variant="outline">{questions.reduce((acc, q) => acc + (q.points || 0), 0)} Total Points</Badge>
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {questions.map((question, index) => (
                    <div
                      key={question.id || index}
                      className="flex items-start justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-2 mb-1">
                           <Badge variant="secondary" className="text-[10px] h-5">{question.type}</Badge>
                           <span className="text-xs text-muted-foreground font-mono">{question.points} pts</span>
                        </div>
                        <p className="font-medium text-sm line-clamp-2">{question.questionText}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editQuestion(index)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeQuestion(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t sticky bottom-0 bg-background pb-4">
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

      {selectedExamForRegistration && (
        <RegistrationFormManager
          examId={selectedExamForRegistration.id || selectedExamForRegistration._id}
          examTitle={selectedExamForRegistration.title}
          isOpen={showRegistrationManager}
          onClose={() => {
            setShowRegistrationManager(false);
            setSelectedExamForRegistration(null);
          }}
        />
      )}

      
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Import Questions from Bank</DialogTitle>
            <DialogDescription>
              Select questions to add to this exam.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden min-h-[300px]">
             {bankQuestions.length === 0 ? (
               <div className="flex items-center justify-center h-full text-muted-foreground">
                 No questions found in bank.
               </div>
             ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {bankQuestions.map((q) => (
                      <div key={q._id || q.id} className="flex items-start space-x-3 p-3 border rounded hover:bg-muted/50">
                        <Checkbox 
                          id={`q-${q._id}`} 
                          checked={selectedBankQuestions.includes(q._id || q.id!)}
                          onCheckedChange={() => handleImportToggle(q._id || q.id!)}
                        />
                        <div className="space-y-1 flex-1">
                          <Label htmlFor={`q-${q._id}`} className="font-medium cursor-pointer block leading-snug">
                            {q.questionText}
                          </Label>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px]">{q.type}</Badge>
                            <Badge variant="secondary" className="text-[10px]">{q.difficulty}</Badge>
                            <span>{q.points} pts</span>
                            <span className="truncate max-w-[200px]">{q.category}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
             )}
          </div>

          <DialogFooter>
             <Button variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button>
             <Button onClick={importSelectedQuestions} disabled={selectedBankQuestions.length === 0}>
               Import {selectedBankQuestions.length} Questions
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
