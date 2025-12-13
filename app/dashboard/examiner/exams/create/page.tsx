import { ExamForm } from "@/components/examiner/exam-form"
import { Separator } from "@/components/ui/separator"

export default function CreateExamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create New Exam</h3>
        <p className="text-sm text-muted-foreground">
          Define the exam details and add questions.
        </p>
      </div>
      <Separator />
      <div className="max-w-3xl">
         <ExamForm />
      </div>
    </div>
  )
}
