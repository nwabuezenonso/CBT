'use client';

import { AssignmentManager } from "@/components/teacher/AssignmentManager";
import { Separator } from "@/components/ui/separator";

// In a real app we'd get current user from session
// For now we assume the component handles data fetching using API which uses cookies
export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Exam Assignments</h3>
        <p className="text-sm text-muted-foreground">
          Schedule and manage exam assignments for your classes.
        </p>
      </div>
      <Separator />
      <AssignmentManager currentUserId="dummy" /> 
    </div>
  );
}
