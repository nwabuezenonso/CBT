'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

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
  role: z.enum(['TEACHER', 'STUDENT', 'ORG_ADMIN']),
  organizationId: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email().optional().or(z.literal('')),
  // Organization fields
  organizationName: z.string().optional(),
  organizationType: z.enum(['SCHOOL', 'TUTORIAL_CENTER']).optional(),
  organizationEmail: z.string().email().optional().or(z.literal('')),
  organizationPhone: z.string().optional(),
  organizationAddress: z.string().optional(),
}).refine((data) => {
  if (data.role === 'ORG_ADMIN') {
    return !!data.organizationName && !!data.organizationType && !!data.organizationEmail;
  }
  return !!data.organizationId;
}, {
  message: "Organization details are required",
  path: ["organizationId"], // attach error to a field
});

type FormData = z.infer<typeof registerSchema> | z.infer<typeof loginSchema>;

interface AuthFormProps {
  defaultIsLogin: boolean;
}

export function AuthForm({ defaultIsLogin }: AuthFormProps) {
  const router = useRouter();
  const [isLogin] = React.useState<boolean>(defaultIsLogin);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [organizations, setOrganizations] = React.useState<any[]>([]);
  const [selectedRole, setSelectedRole] = React.useState<'TEACHER' | 'STUDENT' | 'ORG_ADMIN'>('STUDENT');
  const { login: authLogin } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema) as any,
    defaultValues: {
      role: 'STUDENT',
    },
  });

  // Fetch organizations for registration
  React.useEffect(() => {
    if (!isLogin) {
      fetch('/api/organizations')
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch organizations');
          }
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setOrganizations(data);
          } else {
            console.error('Invalid organizations data:', data);
            setOrganizations([]);
          }
        })
        .catch((error) => {
          console.error('Error loading organizations:', error);
          toast.error('Failed to load organizations');
          setOrganizations([]);
        });
    }
  }, [isLogin]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      let endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      // Use special endpoint for school registration
      if (!isLogin && (data as any).role === 'ORG_ADMIN') {
        endpoint = '/api/auth/register-school';
      }

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
      console.log('Login result:', result); // Debug log

      if (isLogin) {
        // Store user data in a way the auth hook can pick it up immediately
        // This avoids the need for a second API call to /api/auth/me
        const userData = {
          id: result._id,
          name: result.name,
          email: result.email,
          role: result.role,
          status: result.status,
          organizationId: result.organizationId,
          createdAt: result.createdAt
        };
        
        // Trigger a custom event to notify the auth hook
        window.dispatchEvent(new CustomEvent('user-logged-in', { detail: userData }));
        
        toast.success('Signed in successfully');
        
        console.log('Redirecting based on role:', result.role); // Debug log
        // Redirect based on role
        if (result.role === 'SUPER_ADMIN') {
          router.push('/dashboard/admin');
        } else if (result.role === 'ORG_ADMIN') {
          console.log('Pushing to /dashboard/org-admin'); // Debug log
          router.push('/dashboard/org-admin');
        } else if (result.role === 'TEACHER') {
          router.push('/dashboard/examiner');
        } else {
          router.push('/dashboard/student');
        }
      } else {
        if ((data as any).role === 'ORG_ADMIN') {
             toast.success('School registration successful!');
             // Org admins are active immediately per our new API
             router.push('/auth/login');
        } else {
             toast.success('Registration successful! Please wait for admin approval.');
             router.push('/auth/pending');
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
          <div className={`grid gap-4 ${!isLogin && 'md:grid-cols-2'}`}>
            {!isLogin && (
              <>
                <div className="grid gap-1">
                  <Label htmlFor="name">Full Name</Label>
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

                <div className="grid gap-1">
                  <Label htmlFor="role">I am a</Label>
                  <Select
                    onValueChange={(value: 'TEACHER' | 'STUDENT' | 'ORG_ADMIN') => {
                      setValue('role', value);
                      setSelectedRole(value);
                    }}
                    defaultValue="STUDENT"
                    disabled={isLoading}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="ORG_ADMIN">School / Tutorial Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole !== 'ORG_ADMIN' && (
                  <div className="grid gap-1">
                    <Label htmlFor="organizationId">Organization</Label>
                    <Select
                      onValueChange={(value) => setValue('organizationId', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select your school/center" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(organizations) && organizations.map((org) => (
                          <SelectItem key={org._id} value={org._id}>
                            {org.name} ({org.type === 'SCHOOL' ? 'School' : 'Tutorial Center'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors?.organizationId && (
                      <p className="px-1 text-xs text-red-600">
                        {errors.organizationId.message as string}
                      </p>
                    )}
                  </div>
                )}

                {selectedRole === 'ORG_ADMIN' && (
                  <>
                    <div className="grid gap-1">
                      <Label htmlFor="organizationName">School/Center Name</Label>
                      <Input
                        id="organizationName"
                        placeholder="Excellence Academy"
                        disabled={isLoading}
                        {...register('organizationName')}
                      />
                    </div>
                    
                    <div className="grid gap-1">
                      <Label htmlFor="organizationType">Type</Label>
                      <Select
                        onValueChange={(value) => setValue('organizationType', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SCHOOL">School</SelectItem>
                          <SelectItem value="TUTORIAL_CENTER">Tutorial Center</SelectItem>
                        </SelectContent>
                      </Select>
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

                    <div className="grid gap-1">
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

                {selectedRole === 'STUDENT' && (
                  <>
                    <div className="grid gap-1">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        disabled={isLoading}
                        {...register('dateOfBirth')}
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="guardianName">Guardian Name</Label>
                      <Input
                        id="guardianName"
                        placeholder="Parent/Guardian Name"
                        disabled={isLoading}
                        {...register('guardianName')}
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="guardianPhone">Guardian Phone</Label>
                      <Input
                        id="guardianPhone"
                        type="tel"
                        placeholder="+234-800-000-0000"
                        disabled={isLoading}
                        {...register('guardianPhone')}
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="guardianEmail">Guardian Email (Optional)</Label>
                      <Input
                        id="guardianEmail"
                        type="email"
                        placeholder="guardian@email.com"
                        disabled={isLoading}
                        {...register('guardianEmail')}
                      />
                    </div>
                  </>
                )}

                <div className="grid gap-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234-800-000-0000"
                    disabled={isLoading}
                    {...register('phone')}
                  />
                </div>
              </>
            )}
            
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

            <Button disabled={isLoading} className={`mt-2 ${!isLogin && 'md:col-span-2'}`}>
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
