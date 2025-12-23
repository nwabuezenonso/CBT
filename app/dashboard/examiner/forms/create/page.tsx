'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ExternalField {
    label: string;
    type: string;
    required: boolean;
}

export default function CreateFormPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        targetClassId: '',
        targetSubject: '',
        accessDurationDays: '30', // Default 30 days
    });

    const [customFields, setCustomFields] = useState<ExternalField[]>([]);

    useEffect(() => {
        if (user?.organizationId) {
            fetchClasses();
        }
    }, [user?.organizationId]);

    const fetchClasses = async () => {
        try {
            const response = await fetch(`/api/classes?organizationId=${user?.organizationId}`);
            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        } catch (error) {
            console.error('Failed to fetch classes', error);
        }
    };

    const addField = () => {
        setCustomFields([...customFields, { label: '', type: 'text', required: false }]);
    };

    const removeField = (index: number) => {
        const newFields = [...customFields];
        newFields.splice(index, 1);
        setCustomFields(newFields);
    };

    const updateField = (index: number, key: keyof ExternalField, value: any) => {
        const newFields = [...customFields];
        (newFields[index] as any)[key] = value;
        setCustomFields(newFields);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/registration-forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    accessDurationDays: parseInt(formData.accessDurationDays) || undefined,
                    targetClassId: formData.targetClassId === 'none' ? undefined : formData.targetClassId,
                    fields: customFields,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create form');
            }

            toast.success('Registration form created successfully');
            router.push('/dashboard/examiner/forms');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Registration Form</h1>
                    <p className="text-muted-foreground">Design a custom registration form for your students.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Form Details</CardTitle>
                        <CardDescription>Basic configurations for the registration form</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Form Title</Label>
                            <Input
                                id="title"
                                required
                                placeholder="e.g. JSS1 Entrance Assessment Registration"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="class">Target Class (Optional)</Label>
                                <Select
                                    value={formData.targetClassId}
                                    onValueChange={(val) => setFormData({ ...formData, targetClassId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a class to auto-assign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None (Don't assign class)</SelectItem>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls._id} value={cls._id}>
                                                {cls.level} {cls.section}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">Students will be automatically added to this class.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Access Duration (Days)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    placeholder="30"
                                    value={formData.accessDurationDays}
                                    onChange={(e) => setFormData({ ...formData, accessDurationDays: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">How long the student account will remain active.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Target Subject (Optional)</Label>
                            <Input
                                id="subject"
                                placeholder="e.g. Mathematics"
                                value={formData.targetSubject}
                                onChange={(e) => setFormData({ ...formData, targetSubject: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Custom Fields</CardTitle>
                        <CardDescription>Add extra information you want to collect (e.g. Parent Phone, Previous School)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {customFields.map((field, index) => (
                            <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-muted/20 relative">
                                <div className="flex-1 space-y-2">
                                    <Label>Field Label</Label>
                                    <Input
                                        value={field.label}
                                        onChange={(e) => updateField(index, 'label', e.target.value)}
                                        placeholder="e.g. Parent Phone Number"
                                        required
                                    />
                                </div>
                                <div className="w-40 space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={field.type}
                                        onValueChange={(val) => updateField(index, 'type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="tel">Phone</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-10 pt-8">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeField(index)} className="text-destructive hover:text-destructive/90">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addField} className="w-full border-dashed">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Custom Field
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Form
                    </Button>
                </div>
            </form>
        </div>
    );
}
