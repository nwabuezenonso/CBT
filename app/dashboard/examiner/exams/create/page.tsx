import { ExamEditor } from "@/components/teacher/ExamEditor";
import { Separator } from "@/components/ui/separator";

export default function CreateExamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create New Exam</h3>
        <p className="text-sm text-muted-foreground">
          Define the exam details and select questions from the bank.
        </p>
      </div>
      <Separator />
      <div className="max-w-5xl">
         <ExamEditor />
      </div>
    </div>
  );
}
