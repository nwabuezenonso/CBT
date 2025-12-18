import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
          <CardDescription>
            Your registration has been submitted successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2">
              Thank you for registering! Your account is currently pending approval from your organization administrator.
            </p>
            <p className="mb-2">
              You will receive an email notification once your account has been approved.
            </p>
            <p className="text-muted-foreground">
              This usually takes 1-2 business days.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">What happens next?</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Your organization admin will review your registration</li>
              <li>You'll receive an email when your account is approved</li>
              <li>Once approved, you can login and access the platform</li>
            </ul>
          </div>

          <div className="pt-4 space-y-2">
            <Link href="/auth/login" className="block">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground">
              Already approved?{' '}
              <Link href="/auth/login" className="underline hover:text-foreground">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
