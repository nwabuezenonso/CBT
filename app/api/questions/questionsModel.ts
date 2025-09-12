import mongoose, { Schema, Document, Types } from "mongoose";

export interface QuestionDocument extends Document {
  exam: Types.ObjectId;
  text: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
}

const QuestionSchema = new Schema<QuestionDocument>(
  {
    exam: { type: Schema.Types.ObjectId, ref: "Exam" },
    text: { type: String, required: true },
    options: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    correctAnswer: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    subject: { type: String, required: true },
  },
  { timestamps: true }
);

const QuestionModel =
  mongoose.models.Question || mongoose.model<QuestionDocument>("Question", QuestionSchema);

export default QuestionModel;
