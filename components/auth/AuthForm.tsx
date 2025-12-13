'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['examiner', 'examinee']),
});

type FormData = {
  name?: string;
  email: string;
  password: string;
  role?: 'examiner' | 'examinee';
};

interface AuthFormProps {
  defaultIsLogin: boolean;
}

export function AuthForm({ defaultIsLogin }: AuthFormProps) {
  const router = useRouter();
  const [isLogin] = React.useState<boolean>(defaultIsLogin);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // We use the register schema for typing, but resolve based on mode
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema) as any,
    defaultValues: {
      role: 'examinee',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: data.email, password: data.password }
        : data;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      const result = await response.json();

      if (isLogin) {
        toast.success('Signed in successfully');
        // Redirect based on role
        if (result.role === 'examiner') {
          router.push('/dashboard/examiner');
        } else {
          router.push('/dashboard/examinee');
        }
      } else {
        toast.success('Account created successfully');
        // Redirect to login page after successful registration
        router.push('/auth/login');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isLogin 
            ? 'Enter your email to sign in to your account'
            : 'Enter your details below to create your account'}
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            {!isLogin && (
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register('name')}
                />
                {errors?.name && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}
            
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...register('email')}
              />
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                {...register('password')}
              />
              {errors?.password && (
                <p className="px-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>


            <Button disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href={isLogin ? "/auth/register" : "/auth/login"}
          className="hover:text-brand underline underline-offset-4"
        >
          {isLogin 
            ? "Don't have an account? Sign Up" 
            : "Already have an account? Sign In"}
        </Link>
      </p>
    </>
  );
}
