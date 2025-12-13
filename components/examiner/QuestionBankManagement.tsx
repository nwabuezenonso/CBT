"use client";

import { useState, useEffect } from "react";
import { questionService, type Question } from "@/services/examService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Database, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export function QuestionBankManagement() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
    difficulty: "medium",
    category: "General",
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionService.getQuestions();
      setQuestions(data);
    } catch (error) {
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSaveQuestion = async () => {
    if (!currentQuestion.questionText) {
       toast.error("Please enter question text");
       return;
    }

    try {
        if (isEditing && currentQuestion._id) {
           await questionService.updateQuestion(currentQuestion._id, currentQuestion);
           toast.success("Question updated successfully");
        } else {
           await questionService.createQuestion(currentQuestion);
           toast.success("Question added to bank");
        }
        setShowAddDialog(false);
        resetForm();
        fetchQuestions();
    } catch (error) {
        toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this question?")) {
        try {
            await questionService.deleteQuestion(id);
            toast.success("Question deleted");
            fetchQuestions();
        } catch (error) {
            toast.error("Failed to delete");
        }
    }
  };

  const handleEdit = (question: Question) => {
     setCurrentQuestion(question);
     setIsEditing(true);
     setShowAddDialog(true);
  };

  const resetForm = () => {
    setCurrentQuestion({
      type: "multiple-choice",
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
      difficulty: "medium",
      category: "General",
    });
    setIsEditing(false);
  };

  const filteredQuestions = questions.filter(q => {
     const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesType = typeFilter === "all" || q.type === typeFilter;
     return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
        {/* Header */}
        <div className="flex bg-card p-6 rounded-lg border shadow-sm flex-col md:flex-row items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold flex items-center gap-2">
                 <Database className="text-primary" /> Question Bank
               </h1>
               <p className="text-muted-foreground mt-1">Manage your question repository.</p>
            </div>
            <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg">
               <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input 
                   placeholder="Search questions..." 
                   className="pl-8 bg-background border-none shadow-sm w-[250px]"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px] border-none shadow-sm bg-background">
                     <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Types</SelectItem>
                     <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                     <SelectItem value="essay">Essay</SelectItem>
                  </SelectContent>
               </Select>
               <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
                  <Plus className="w-4 h-4 mr-2" /> Add Question
               </Button>
            </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.length === 0 ? (
               <div className="text-center py-20 bg-muted/10 border-2 border-dashed rounded-xl">
                  <Database className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No questions found</h3>
                  <p className="text-muted-foreground">Add questions to start building your bank.</p>
               </div>
            ) : (
                filteredQuestions.map((q) => (
                    <Card key={q._id} className="hover:shadow-md transition-all border-muted/60">
                       <CardHeader className="py-4 pb-2">
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                   <Badge variant="outline">{q.type}</Badge>
                                   <Badge className={q.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} variant="secondary">{q.difficulty || 'medium'}</Badge>
                                   <span className="text-xs text-muted-foreground">Points: {q.points}</span>
                                </div>
                                <h3 className="font-medium text-base pt-1">{q.questionText}</h3>
                             </div>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                   <DropdownMenuItem onClick={() => handleEdit(q)}><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleDelete(q._id!)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                          </div>
                       </CardHeader>
                       <CardContent className="pb-3 text-sm text-muted-foreground">
                           {q.type === 'multiple-choice' && (
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                 {q.options?.map((opt, i) => (
                                    <div key={i} className={`px-2 py-1 rounded border ${i === Number(q.correctAnswer) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-muted/50'}`}>
                                       {opt}
                                    </div>
                                 ))}
                              </div>
                           )}
                       </CardContent>
                    </Card>
                ))
            )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
           <DialogContent className="max-w-2xl">
              <DialogHeader>
                 <DialogTitle>{isEditing ? "Edit Question" : "Add New Question"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>Type</Label>
                       <Select value={currentQuestion.type} onValueChange={(v: any) => setCurrentQuestion(p => ({...p, type: v}))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                             <SelectItem value="essay">Essay</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label>Difficulty</Label>
                       <Select value={currentQuestion.difficulty} onValueChange={(v: any) => setCurrentQuestion(p => ({...p, difficulty: v}))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="easy">Easy</SelectItem>
                             <SelectItem value="medium">Medium</SelectItem>
                             <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea 
                       value={currentQuestion.questionText} 
                       onChange={(e) => setCurrentQuestion(p => ({...p, questionText: e.target.value}))} 
                    />
                 </div>
                 
                 {currentQuestion.type === 'multiple-choice' && (
                    <div className="space-y-2">
                        <Label>Options</Label>
                        {currentQuestion.options?.map((opt, i) => (
                           <div key={i} className="flex gap-2 items-center">
                              <span className="w-6 text-center text-sm font-medium">{String.fromCharCode(65+i)}</span>
                              <Input 
                                 value={opt} 
                                 onChange={(e) => {
                                    const newOpts = [...(currentQuestion.options || [])];
                                    newOpts[i] = e.target.value;
                                    setCurrentQuestion(p => ({...p, options: newOpts}));
                                 }} 
                              />
                              <Button 
                                 size="icon" 
                                 variant={Number(currentQuestion.correctAnswer) === i ? "default" : "ghost"}
                                 className={Number(currentQuestion.correctAnswer) === i ? "bg-green-600" : ""}
                                 onClick={() => setCurrentQuestion(p => ({...p, correctAnswer: i}))}
                              >
                                 <CheckCircle className="w-4 h-4" />
                              </Button>
                           </div>
                        ))}
                    </div>
                 )}

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>Points</Label>
                       <Input type="number" value={currentQuestion.points} onChange={(e) => setCurrentQuestion(p => ({...p, points: parseInt(e.target.value) || 0}))} />
                    </div>
                    <div className="space-y-2">
                       <Label>Category/Tag</Label>
                       <Input value={currentQuestion.category} onChange={(e) => setCurrentQuestion(p => ({...p, category: e.target.value}))} placeholder="e.g. Mathematics" />
                    </div>
                 </div>
              </div>
              <DialogFooter>
                 <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                 <Button onClick={handleSaveQuestion}>Save Question</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
    </div>
  );
}
