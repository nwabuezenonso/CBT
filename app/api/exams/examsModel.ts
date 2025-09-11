import mongoose, { Schema, Document, Types } from "mongoose";

export interface ExamDocument extends Document {
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  status: "draft" | "active" | "archived";
  examinees: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<ExamDocument>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    status: { type: String, enum: ["draft", "active", "archived"], default: "draft" },
    examinees: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Avoid recompiling model
export const Exam = mongoose.models.Exam || mongoose.model<ExamDocument>("Exam", ExamSchema);
