'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const optionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean().default(false),
});

const questionSchema = z.object({
  questionText: z.string().min(5, 'Question text must be at least 5 characters'),
  type: z.enum(['multiple-choice', 'true-false']), // Expandable later
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  points: z.coerce.number().min(1, 'Points must be at least 1'),
  explanation: z.string().optional(),
  options: z.array(optionSchema).min(2, 'At least 2 options are required'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionEditorProps {
  question?: any; // If editing, pass existing question with options
  onSave: () => void;
  onCancel: () => void;
}

export function QuestionEditor({ question, onSave, onCancel }: QuestionEditorProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaultValues: QuestionFormData = question ? {
    questionText: question.questionText,
    type: question.type || 'multiple-choice',
    subject: question.subject,
    topic: question.topic || '',
    difficulty: question.difficulty || 'medium',
    points: question.points || 1,
    explanation: question.explanation || '',
    options: question.options.map((o: any) => ({
      optionText: o.optionText,
      isCorrect: o.isCorrect,
    })),
  } : {
    questionText: '',
    type: 'multiple-choice',
    subject: '',
    topic: '',
    difficulty: 'medium',
    points: 1,
    explanation: '',
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
    ],
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema) as any,
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const onSubmit = async (data: QuestionFormData) => {
    // Validate that at least one option is correct
    if (!data.options.some((opt) => opt.isCorrect)) {
      toast.error('Please select at least one correct answer');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = question ? `/api/questions/${question._id}` : '/api/questions';
      const method = question ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to save question');
      }

      toast.success(`Question ${question ? 'updated' : 'created'} successfully`);
      onSave();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          {question ? 'Edit Question' : 'Create New Question'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Question Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Question Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="questionText">Question Text</Label>
                  <Textarea
                    id="questionText"
                    placeholder="Enter your question here..."
                    className="min-h-[100px]"
                    {...register('questionText')}
                  />
                  {errors.questionText && (
                    <p className="text-xs text-red-500">{errors.questionText.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g. Mathematics" {...register('subject')} />
                    {errors.subject && (
                      <p className="text-xs text-red-500">{errors.subject.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="topic">Topic (Optional)</Label>
                    <Input id="topic" placeholder="e.g. Algebra" {...register('topic')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      onValueChange={(val) => setValue('difficulty', val as any)}
                      defaultValue={defaultValues.difficulty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min={1}
                      {...register('points')}
                    />
                     {errors.points && (
                      <p className="text-xs text-red-500">{errors.points.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    placeholder="Explain the answer..."
                    {...register('explanation')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Answer Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Answer Options</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ optionText: '', isCorrect: false })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3 p-3 border rounded-md bg-muted/20">
                    <div className="pt-3">
                       <Checkbox
                        id={`option-${index}-correct`}
                        checked={watch(`options.${index}.isCorrect`)}
                        onCheckedChange={(checked) => 
                          setValue(`options.${index}.isCorrect`, checked === true)
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`option-${index}-text`} className="text-xs text-muted-foreground">
                        Option {index + 1} {watch(`options.${index}.isCorrect`) && '(Correct)'}
                      </Label>
                      <Input
                        id={`option-${index}-text`}
                        placeholder={`Option ${index + 1} text`}
                        {...register(`options.${index}.optionText` as const)}
                      />
                      {errors.options?.[index]?.optionText && (
                        <p className="text-xs text-red-500">
                          {errors.options[index]?.optionText?.message}
                        </p>
                      )}
                    </div>
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90 mt-6"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.options && (
                  <p className="text-xs text-red-500">{errors.options.message}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Question
          </Button>
        </div>
      </form>
    </div>
  );
}
