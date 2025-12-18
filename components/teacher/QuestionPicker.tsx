'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Search, Filter, Plus, Check, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';

interface Question {
  _id: string;
  questionText: string;
  subject: string;
  topic?: string;
  difficulty: string;
  type: string;
}

interface QuestionPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectQuestions: (questions: Question[]) => void;
  selectedIds?: string[]; // IDs already selected
}

export function QuestionPicker({ open, onOpenChange, onSelectQuestions, selectedIds = [] }: QuestionPickerProps) {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterSubject, setFilterSubject] = React.useState('all');
  
  // Local selection state
  const [tempSelected, setTempSelected] = React.useState<Set<string>>(new Set());

  // Fetch questions when dialog opens
  React.useEffect(() => {
    if (open) {
      const fetchQs = async () => {
        setLoading(true);
        try {
           let url = '/api/questions?';
           if (filterSubject !== 'all') url += `subject=${filterSubject}&`;
           
           const res = await fetch(url);
           const data = await res.json();
           setQuestions(data);
           
           // Initialize temp selection with validation (only those that still exist)
           // Actually, we shouldn't pre-select what's already in the exam to avoid confusion?
           // Typically pickers show what's already picked.
           // Let's assume we want to ADD more.
           setTempSelected(new Set()); 
        } catch (e) {
          toast.error("Failed to load questions");
        } finally {
          setLoading(false);
        }
      };
      fetchQs();
    }
  }, [open, filterSubject]);

  const handleToggle = (id: string) => {
    const newSet = new Set(tempSelected);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setTempSelected(newSet);
  };

  const handleConfirm = () => {
    const selectedQs = questions.filter(q => tempSelected.has(q._id));
    onSelectQuestions(selectedQs);
    onOpenChange(false);
  };

  const filteredQuestions = questions.filter(q => 
    !selectedIds.includes(q._id) && // Exclude already added
    (q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
     q.topic?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const subjects = Array.from(new Set(questions.map(q => q.subject)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Questions from Bank</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
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
                {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1 pr-4">
            {loading ? (
                 <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : filteredQuestions.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">No matching questions found.</div>
            ) : (
                <div className="space-y-2">
                    {filteredQuestions.map(q => (
                        <Card key={q._id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleToggle(q._id)}>
                            <CardContent className="p-3 flex items-start gap-3">
                                <Checkbox 
                                    checked={tempSelected.has(q._id)}
                                    onCheckedChange={() => handleToggle(q._id)}
                                    className="mt-1"
                                />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium line-clamp-2">{q.questionText}</p>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-xs">{q.subject}</Badge>
                                        <Badge variant="secondary" className="text-xs">{q.difficulty}</Badge>
                                        {q.topic && <span className="text-xs text-muted-foreground">• {q.topic}</span>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </ScrollArea>

        <DialogFooter className="mt-4">
            <div className="flex-1 flex items-center text-sm text-muted-foreground">
                {tempSelected.size} questions selected
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={tempSelected.size === 0}>
                Add Selected Questions
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
