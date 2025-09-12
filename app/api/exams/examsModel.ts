import mongoose, { Schema, Document, Types } from "mongoose";

export interface ExamDocument extends Document {
  title: string;
  subject: string;
  duration: number; // in minutes
  status: "draft" | "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<ExamDocument>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true },
    status: { type: String, enum: ["draft", "active", "archived"], default: "draft" },
  },
  { timestamps: true }
);

// Avoid recompiling model
const ExamModel = mongoose.models.Exam || mongoose.model<ExamDocument>("Exam", ExamSchema);
export default ExamModel;
