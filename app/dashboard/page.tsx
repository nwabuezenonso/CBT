"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { StudentDashboard } from "@/components/student-dashboard";
import { Loader2 } from "lucide-react";

import { Overview } from "@/components/examiner";

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [mounted, loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return user.role === "admin" ? <Overview /> : <StudentDashboard />;
}
