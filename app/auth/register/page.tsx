import { AuthForm } from '@/components/auth/AuthForm';
import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm defaultIsLogin={false} />
    </Suspense>
  );
}
