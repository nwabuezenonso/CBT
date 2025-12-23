'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentRegistrationPage() {
    const params = useParams();
    const router = useRouter();
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const [customResponses, setCustomResponses] = useStateAnd<Record<string, any>>({});

    useEffect(() => {
        if (params?.formId) {
            fetchForm(params.formId as string);
        }
    }, [params?.formId]);

    const fetchForm = async (id: string) => {
        try {
            const response = await fetch(`/api/registration-forms/${id}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error('Form not found');
                if (response.status === 410) throw new Error('Form is no longer active');
                throw new Error('Failed to load form');
            }
            const data = await response.json();
            setForm(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await fetch(`/api/registration-forms/${params?.formId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    customData: customResponses
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            setSuccess(true);
            toast.success('Registration successful!');
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                        <CardTitle className="text-destructive">Registration Unavailable</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Link href="/auth/login">
                            <Button variant="outline">Go to Login</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl">Registration Successful!</CardTitle>
                        <CardDescription>
                            Your account has been created. You can now log in to the portal.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center gap-4">
                        <Link href="/auth/login">
                            <Button>Login Now</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader className="text-center border-b bg-white rounded-t-xl">
                        <CardTitle className="text-2xl">{form.title}</CardTitle>
                        <CardDescription>
                            {form.organizationId?.name && <span className="block font-medium text-primary mb-1">{form.organizationId.name}</span>}
                            Fill out the form below to register.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Account Details</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            required
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="student@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            minLength={6}
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            required
                                            placeholder="+234..."
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {form.fields && form.fields.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Additional Information</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {form.fields.map((field: any, index: number) => (
                                            <div key={index} className="space-y-2">
                                                <Label htmlFor={`field-${index}`}>
                                                    {field.label}
                                                    {field.required && <span className="text-red-500">*</span>}
                                                </Label>
                                                <Input
                                                    id={`field-${index}`}
                                                    type={field.type}
                                                    required={field.required}
                                                    onChange={(e) => setCustomResponses({ ...customResponses, [field.label]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button type="submit" className="w-full text-lg py-6" disabled={submitting}>
                                {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Complete Registration'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function useStateAnd<T>(initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    return useState(initial);
}
