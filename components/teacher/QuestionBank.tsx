'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Plus, Search, Filter, Pencil, Trash2, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { QuestionEditor } from './QuestionEditor';

interface Question {
  _id: string;
  questionText: string;
  subject: string;
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: string;
  points: number;
  createdAt: string;
}

export function QuestionBank() {
  const [view, setView] = React.useState<'list' | 'create' | 'edit'>('list');
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedQuestion, setSelectedQuestion] = React.useState<any | null>(null);
  
  // Filters
  const [filterSubject, setFilterSubject] = React.useState('all');
  const [filterDifficulty, setFilterDifficulty] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchQuestions = React.useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/questions?';
      if (filterSubject !== 'all') url += `subject=${filterSubject}&`;
      if (filterDifficulty !== 'all') url += `difficulty=${filterDifficulty}&`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      setQuestions(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [filterSubject, filterDifficulty]);

  React.useEffect(() => {
    if (view === 'list') {
      fetchQuestions();
    }
  }, [fetchQuestions, view]);

  const handleEdit = async (questionId: string) => {
    try {
      // Fetch full details including options
      const response = await fetch(`/api/questions/${questionId}`);
      if (!response.ok) throw new Error('Failed to fetch question details');
      
      const data = await response.json();
      setSelectedQuestion(data);
      setView('edit');
    } catch (error: any) {
      toast.error('Could not load question details');
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete question');

      toast.success('Question deleted');
      fetchQuestions();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Unique subjects for filter
  const subjects = Array.from(new Set(questions.map(q => q.subject)));

  if (view === 'create' || view === 'edit') {
    return (
      <QuestionEditor 
        question={selectedQuestion} 
        onSave={() => {
          setView('list');
          setSelectedQuestion(null);
        }}
        onCancel={() => {
          setView('list');
          setSelectedQuestion(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Question Bank</h2>
          <p className="text-muted-foreground">
            Manage your repository of questions
          </p>
        </div>
        <Button onClick={() => setView('create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Question
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[180px]">
             <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(sub => (
              <SelectItem key={sub} value={sub}>{sub}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
          <SelectTrigger className="w-[180px]">
             <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mb-4 flex justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-medium">No questions found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your filters or create a new question.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredQuestions.map((q) => (
            <Card key={q._id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <Badge variant={
                          q.difficulty === 'easy' ? 'secondary' : 
                          q.difficulty === 'medium' ? 'default' : 'destructive'
                        }>
                          {q.difficulty}
                        </Badge>
                        <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                          {q.subject}
                        </span>
                        {q.topic && (
                          <span className="text-xs text-muted-foreground">
                             • {q.topic}
                          </span>
                        )}
                    </div>
                    <p className="line-clamp-2 font-medium mt-1">
                      {q.questionText}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(q._id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(q._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
