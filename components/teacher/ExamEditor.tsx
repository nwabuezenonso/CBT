'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Save, GripVertical } from 'lucide-react';

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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { QuestionPicker } from './QuestionPicker';

const examSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  duration: z.coerce.number().min(1, 'Duration is required'),
  instructions: z.string().optional(),
  shuffleQuestions: z.boolean().default(true),
  shuffleOptions: z.boolean().default(true),
  showResultsImmediately: z.boolean().default(false),
  questions: z.array(z.object({
    questionId: z.string(),
    questionText: z.string(), // For display
    marks: z.coerce.number().min(1),
  })).min(1, 'Add at least one question'),
});

type ExamFormValues = z.infer<typeof examSchema>;

export function ExamEditor() {
    const router = useRouter();
    const [pickerOpen, setPickerOpen] = React.useState(false);
    
    const form = useForm<ExamFormValues>({
        resolver: zodResolver(examSchema) as any,
        defaultValues: {
            title: '',
            subject: '',
            duration: 60,
            shuffleQuestions: true,
            shuffleOptions: true,
            showResultsImmediately: false,
            questions: [],
        }
    });

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: 'questions',
    });

    const onSubmit = async (data: ExamFormValues) => {
        try {
            const response = await fetch('/api/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if(!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to create exam');
            }

            toast.success('Exam created successfully!');
            router.push('/dashboard/examiner/exams');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleAddQuestions = (selectedQuestions: any[]) => {
        selectedQuestions.forEach(q => {
            append({
                questionId: q._id,
                questionText: q.questionText,
                marks: q.points || 1,
            });
        });
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader><CardTitle>Exam Details</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Exam Title</FormLabel>
                                                <FormControl><Input placeholder="e.g. Mid-Term Assessment" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                         <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Subject</FormLabel>
                                                    <FormControl><Input placeholder="Mathematics" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="duration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Duration (mins)</FormLabel>
                                                    <FormControl><Input type="number" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="instructions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Instructions</FormLabel>
                                                <FormControl><Textarea placeholder="Read carefully..." {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="shuffleQuestions"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Shuffle Questions</FormLabel>
                                                    <FormDescription>Randomize order for each student</FormDescription>
                                                </div>
                                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="shuffleOptions"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Shuffle Options</FormLabel>
                                                    <FormDescription>Randomize answer choices</FormDescription>
                                                </div>
                                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                      <FormField
                                        control={form.control}
                                        name="showResultsImmediately"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Show Results</FormLabel>
                                                    <FormDescription>Display score immediately after submission</FormDescription>
                                                </div>
                                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="space-y-4">
                            <Card className="h-full flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Selected Questions ({fields.length})</CardTitle>
                                    <Button type="button" size="sm" onClick={() => setPickerOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Questions
                                    </Button>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    {fields.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                            No questions selected. <br/> Click "Add Questions" to select from the bank.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex items-start gap-2 p-3 bg-muted/40 rounded-md border group">
                                                    <div className="mt-2 text-muted-foreground"><GripVertical className="h-4 w-4" /></div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex justify-between">
                                                            <span className="font-medium text-sm">Question {index + 1}</span>
                                                             <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => remove(index)}>
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">{field.questionText}</p>
                                                    </div>
                                                    <div className="w-20">
                                                        <Input 
                                                            type="number" 
                                                            className="h-8 text-right" 
                                                            {...form.register(`questions.${index}.marks`)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                     {form.formState.errors.questions && (
                                        <p className="text-sm text-destructive mt-2">{form.formState.errors.questions.message}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Exam
                        </Button>
                    </div>
                </form>
            </Form>

            <QuestionPicker 
                open={pickerOpen} 
                onOpenChange={setPickerOpen} 
                onSelectQuestions={handleAddQuestions}
                selectedIds={fields.map(f => f.questionId)} 
            />
        </div>
    );
}
