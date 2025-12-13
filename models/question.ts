import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    default: 'multiple-choice',
  },
  options: [{ type: String }],
  correctAnswer: { type: mongoose.Schema.Types.Mixed }, // String or Number index
  points: { type: Number, default: 1 },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  tags: [{ type: String }],
  examinerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
