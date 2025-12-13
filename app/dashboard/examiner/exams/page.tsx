import { getExams } from "@/app/actions/get-exams";
import { ExamManagement } from "@/components/examiner/ExamManagement";
import { revalidatePath } from "next/cache";

export default async function ExamsPage() {
  const result = await getExams();
  const exams = result.data || [];

  async function handleRefresh() {
    "use server";
    revalidatePath("/dashboard/examiner/exams");
  }

  return (
    <div className="container mx-auto py-6">
      <ExamManagement exams={exams} onRefresh={handleRefresh} />
    </div>
  );
}
