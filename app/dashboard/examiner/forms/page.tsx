'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Copy, Link as LinkIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

export default function FormsListPage() {
    const { user } = useAuth();
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.organizationId) {
            fetchForms();
        }
    }, [user?.organizationId]);

    const fetchForms = async () => {
        try {
            const response = await fetch('/api/registration-forms');
            if (response.ok) {
                const data = await response.json();
                setForms(data);
            }
        } catch (error) {
            toast.error('Failed to load forms');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = (formId: string) => {
        const link = `${window.location.origin}/register/student/${formId}`;
        navigator.clipboard.writeText(link);
        toast.success('Registration link copied');
    };

    const deleteForm = async (formId: string) => {
        if (!confirm('Are you sure you want to delete this form?')) return;

        try {
            const response = await fetch(`/api/registration-forms/${formId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Form deleted');
                fetchForms();
            } else {
                toast.error('Failed to delete form');
            }
        } catch (error) {
            toast.error('Error deleting form');
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Registration Forms</h2>
                <Link href="/dashboard/examiner/forms/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Form
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Forms</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Target Class</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Fields</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {forms.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No forms created yet. Click "Create New Form" to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                forms.map((form) => (
                                    <TableRow key={form._id}>
                                        <TableCell className="font-medium">{form.title}</TableCell>
                                        <TableCell>
                                            {form.targetClassId
                                                ? `${form.targetClassId.level} ${form.targetClassId.section}`
                                                : (form.targetSubject || 'Any')}
                                        </TableCell>
                                        <TableCell>
                                            {form.accessDurationDays ? `${form.accessDurationDays} days` : 'Unlimited'}
                                        </TableCell>
                                        <TableCell>{form.fields?.length || 0} custom fields</TableCell>
                                        <TableCell>{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" onClick={() => copyLink(form._id)}>
                                                <LinkIcon className="h-3 w-3 mr-1" /> Link
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => deleteForm(form._id)} className="text-destructive hover:text-destructive/90">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
