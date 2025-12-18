import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionText: { 
    type: String, 
    required: true 
  },
  questionImageUrl: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    default: 'multiple-choice',
  },
  // Options are now stored in separate AnswerOption model
  subject: {
    type: String,
    required: false,
  },
  topic: {
    type: String,
    required: false,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  tags: [{ type: String }],
  points: { 
    type: Number, 
    default: 1 
  },
  explanation: {
    type: String,
    required: false,
    // Shown to students after exam submission
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
QuestionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
QuestionSchema.index({ organizationId: 1, subject: 1 });
QuestionSchema.index({ createdBy: 1 });

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);

