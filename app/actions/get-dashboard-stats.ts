"use server";

import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";
import User from "@/models/User";
import Result from "@/models/Result";

export async function getDashboardStats() {
  try {
    await dbConnect();

    const [totalExams, activeExaminees, completedExams, averageScoreAgg, recentExams] = await Promise.all([
      Exam.countDocuments({}),
      User.countDocuments({ role: "examinee" }),
      Result.countDocuments({}),
      Result.aggregate([
        {
          $group: {
            _id: null,
            avgScore: { $avg: "$score" }
          }
        }
      ]),
      Exam.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title createdAt questions isActive")
        .lean()
    ]);

    const averageScore = averageScoreAgg.length > 0 ? Math.round(averageScoreAgg[0].avgScore) : 0;

    // Serialize MongoDB objects
    const serializedRecentExams = recentExams.map((exam: any) => ({
      id: exam._id.toString(),
      title: exam.title,
      createdAt: exam.createdAt,
      questionCount: exam.questions?.length || 0,
      isActive: exam.isActive
    }));

    return {
      success: true,
      data: {
        totalExams,
        activeExaminees,
        completedExams,
        averageScore,
        recentExams: serializedRecentExams
      }
    };

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard statistics"
    };
  }
}
