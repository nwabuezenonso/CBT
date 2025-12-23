"use server";

import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";
import { type Exam as ExamType } from "@/services/examService";

export async function getExams(): Promise<{ success: boolean; data?: ExamType[]; error?: string }> {
  try {
    await dbConnect();

    // Fetch exams and sort by creation date (newest first)
    const exams = await Exam.find({}).sort({ createdAt: -1 }).lean();

    // Map to plain objects (convert _id to id and stringify ObjectIds)
    const formattedExams = exams.map((exam: any) => ({
      ...exam,
      id: exam._id.toString(),
      _id: exam._id.toString(),
      examinerId: exam.createdBy ? exam.createdBy.toString() : (exam.examinerId ? exam.examinerId.toString() : ''),
      createdBy: exam.createdBy ? exam.createdBy.toString() : undefined, // Explicitly stringify createdBy to avoid serialization error
      organizationId: exam.organizationId ? exam.organizationId.toString() : undefined,
      assignedClasses: exam.assignedClasses ? exam.assignedClasses.map((id: any) => id.toString()) : [],
      questions: exam.questions?.map((q: any) => ({
        ...q,
        id: q._id ? q._id.toString() : undefined,
        _id: q._id ? q._id.toString() : undefined,
      })) || [],
      scheduledDate: exam.scheduledDate ? exam.scheduledDate.toISOString() : undefined,
      createdAt: exam.createdAt ? exam.createdAt.toISOString() : undefined,
      updatedAt: exam.updatedAt ? exam.updatedAt.toISOString() : undefined,
      totalPoints: exam.questions?.reduce((sum: number, q: any) => sum + (q.points || 1), 0) || 0
    }));

    return {
      success: true,
      data: formattedExams
    };
  } catch (error) {
    console.error("Error fetching exams:", error);
    return {
      success: false,
      error: "Failed to fetch exams"
    };
  }
}
