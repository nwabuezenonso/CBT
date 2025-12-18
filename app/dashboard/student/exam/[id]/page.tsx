'use client';

import { ExamInterface } from "@/components/student/ExamInterface";

export default function ExamPage({ params }: { params: { id: string } }) {
  // id is the attemptId
  return <ExamInterface attemptId={params.id} />;
}
