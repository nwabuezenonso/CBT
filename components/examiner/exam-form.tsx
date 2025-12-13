'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const questionSchema = z.object({
  questionText: z.string().min(1, 'Question text is required'),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer']),
  options: z.array(z.string()).optional(), // For MC
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  points: z.coerce.number().min(1),
});

const examSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  duration: z.coerce.number().min(5, 'Duration must be at least 5 minutes'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

type ExamFormValues = z.infer<typeof examSchema>;

// Default values
const defaultValues: ExamFormValues = {
  title: '',
  description: '',
  questions: [
    {
      questionText: 'What is 2 + 2?',
      type: 'multiple-choice',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4', 
      points: 1,
    },
  ],
  duration: 60,
};

export function ExamForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const { fields,append, remove } = useFieldArray({
    name: 'questions',
    control: form.control,
  });

  async function onSubmit(data: ExamFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create exam');
      }

      toast.success('Exam created successfully');
      router.push('/dashboard/examiner/exams');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Title</FormLabel>
                <FormControl>
                  <Input placeholder="Introduction to Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of the exam..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
             <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
             <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  questionText: '',
                  type: 'multiple-choice',
                  options: ['', '', '', ''],
                  correctAnswer: '',
                  points: 1,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Question {index + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                 <FormField
                  control={form.control}
                  name={`questions.${index}.questionText`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter question..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-4">
                   <FormField
                    control={form.control}
                    name={`questions.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="multiple-choice">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="true-false">
                              True / False
                            </SelectItem>
                            <SelectItem value="short-answer">
                              Short Answer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`questions.${index}.points`}
                    render={({ field }) => (
                      <FormItem className="w-1/4">
                        <FormLabel>Points</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Conditional Rendering based on Type */}
                {/* We watch the type using `form.watch` but inside a map we need to be careful with perf. 
                    However, for < 50 questions it's fine. */}
                {form.watch(`questions.${index}.type`) === 'multiple-choice' && (
                  <div className="space-y-2 pl-4 border-l-2">
                    <FormLabel>Options (Enter text) - Mark correct one</FormLabel>
                    {[0, 1, 2, 3].map((optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                         <div className="grid w-full items-center gap-1.5">
                             <FormField
                              control={form.control}
                              name={`questions.${index}.options.${optIndex}`}
                              render={({ field }) => (
                                <Input placeholder={`Option ${optIndex + 1}`} {...field} /> 
                              )}
                            />
                         </div>
                         <input 
                            type="radio" 
                            name={`correct-${field.id}`}
                            className="h-4 w-4"
                            onChange={() => {
                                // Set the correct answer to the value of this option?? 
                                // Or the index? Let's assume user types value. 
                                // Ideally we use index. Let's use Index as string.
                                form.setValue(`questions.${index}.correctAnswer`, optIndex.toString());
                            }}
                            // Check if current correct answer matches this index
                            checked={form.watch(`questions.${index}.correctAnswer`) === optIndex.toString()}
                         />
                      </div>
                    ))}
                    <FormDescription>
                        Select the radio button next to the correct option.
                    </FormDescription>
                  </div>
                )}

                 {form.watch(`questions.${index}.type`) === 'true-false' && (
                   <FormField
                    control={form.control}
                    name={`questions.${index}.correctAnswer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correct Answer</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select correct answer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                 {form.watch(`questions.${index}.type`) === 'short-answer' && (
                   <FormField
                    control={form.control}
                    name={`questions.${index}.correctAnswer`}
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel>Correct Answer (Exact Match)</FormLabel>
                         <FormControl>
                            <Input placeholder="Enter the exact correct answer" {...field} />
                         </FormControl>
                         <FormDescription>Case-insensitive matching will be applied.</FormDescription>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Exam
            </Button>
        </div>
      </form>
    </Form>
  );
}
