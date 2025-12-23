'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// import { useAuth } from '@/hooks/use-auth';

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

const registerSchoolSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.literal('ORG_ADMIN'),
  organizationName: z.string().min(2, 'School name is required'),
  organizationType: z.enum(['SCHOOL', 'TUTORIAL_CENTER']),
  organizationEmail: z.string().email().optional().or(z.literal('')),
  organizationPhone: z.string().optional(),
  organizationAddress: z.string().optional(),
});

const registerInviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['EXAMINER', 'STUDENT']),
  organizationId: z.string(),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof registerSchoolSchema> | z.infer<typeof loginSchema> | z.infer<typeof registerInviteSchema>;

interface AuthFormProps {
  defaultIsLogin: boolean;
}

export function AuthForm({ defaultIsLogin }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin] = React.useState<boolean>(defaultIsLogin);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Parse invite query params
  const inviteRole = searchParams.get('role');
  const inviteOrgId = searchParams.get('orgId');
  const isInvite = !!(inviteRole && inviteOrgId && !isLogin);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(
      isLogin
        ? loginSchema
        : (isInvite ? registerInviteSchema : registerSchoolSchema)
    ) as any,
    defaultValues: {
      role: isInvite ? inviteRole : 'ORG_ADMIN',
      organizationId: isInvite ? inviteOrgId : undefined,
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      let endpoint = isLogin
        ? '/api/auth/login'
        : (isInvite ? '/api/auth/register' : '/api/auth/register-school');

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
      console.log('Auth result:', result);

      if (isLogin) {
        const userData = {
          id: result._id,
          name: result.name,
          email: result.email,
          role: result.role,
          status: result.status,
          organizationId: result.organizationId,
          createdAt: result.createdAt
        };

        window.dispatchEvent(new CustomEvent('user-logged-in', { detail: userData }));

        toast.success('Signed in successfully');

        // Redirect based on role
        if (result.role === 'SUPER_ADMIN') {
          router.push('/dashboard/admin');
        } else if (result.role === 'ORG_ADMIN') {
          router.push('/dashboard/org-admin');
        } else if (result.role === 'EXAMINER') {
          router.push('/dashboard/examiner');
        } else {
          router.push('/dashboard/student');
        }
      } else {
        if (isInvite) {
          toast.success('Registration successful! Please wait for approval.');
          router.push('/auth/login');
        } else {
          toast.success('School registration successful!');
          router.push('/auth/login');
        }
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
          {isLogin
            ? 'Welcome back'
            : (isInvite ? 'Join Organization' : 'Create School Account')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isLogin
            ? 'Enter your email to sign in to your account'
            : (isInvite
              ? 'Create your account to join the organization'
              : 'Enter your school details below to create an account')}
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`grid gap-4 ${(!isLogin && !isInvite) && 'md:grid-cols-2'}`}>

            {/* School Registration Fields */}
            {!isLogin && !isInvite && (
              <>
                <div className="grid gap-1 md:col-span-2">
                  <Label htmlFor="name">Admin Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="name"
                    disabled={isLoading}
                    {...register('name')}
                  />
                  {errors?.name && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>

                <input type="hidden" {...register('role')} value="ORG_ADMIN" />

                <div className="grid gap-1">
                  <Label htmlFor="organizationName">School/Center Name</Label>
                  <Input
                    id="organizationName"
                    placeholder="Excellence Academy"
                    disabled={isLoading}
                    {...register('organizationName')}
                  />
                  {errors?.organizationName && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.organizationName.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="organizationType">Type</Label>
                  <Select
                    onValueChange={(value) => setValue('organizationType', value)}
                    disabled={isLoading}
                    defaultValue="SCHOOL"
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHOOL">School</SelectItem>
                      <SelectItem value="TUTORIAL_CENTER">Tutorial Center</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors?.organizationType && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.organizationType.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="organizationEmail">School Email</Label>
                  <Input
                    id="organizationEmail"
                    type="email"
                    placeholder="info@school.com"
                    disabled={isLoading}
                    {...register('organizationEmail')}
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="organizationPhone">School Phone</Label>
                  <Input
                    id="organizationPhone"
                    type="tel"
                    placeholder="+234..."
                    disabled={isLoading}
                    {...register('organizationPhone')}
                  />
                </div>

                <div className="grid gap-1 md:col-span-2">
                  <Label htmlFor="organizationAddress">Address</Label>
                  <Input
                    id="organizationAddress"
                    placeholder="123 Street..."
                    disabled={isLoading}
                    {...register('organizationAddress')}
                  />
                </div>
              </>
            )}

            {/* Invite Registration Fields */}
            {!isLogin && isInvite && (
              <>
                <input type="hidden" {...register('role')} value={inviteRole} />
                <input type="hidden" {...register('organizationId')} value={inviteOrgId} />

                <div className="grid gap-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    autoComplete="name"
                    disabled={isLoading}
                    {...register('name')}
                  />
                  {errors?.name && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    disabled={isLoading}
                    {...register('phone')}
                  />
                </div>
              </>
            )}


            {/* Common Fields: Email and Password */}
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                disabled={isLoading}
                {...register('email')}
              />
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                disabled={isLoading}
                {...register('password')}
              />
              {errors?.password && (
                <p className="px-1 text-xs text-red-600">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <Button disabled={isLoading} className={`mt-2 ${(!isLogin && !isInvite) && 'md:col-span-2'}`}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLogin ? 'Sign In' : (isInvite ? 'Join Organization' : 'Create School Account')}
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
