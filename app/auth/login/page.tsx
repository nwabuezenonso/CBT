import { AuthForm } from '@/components/auth/AuthForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm defaultIsLogin={true} />
    </Suspense>
  );
}
