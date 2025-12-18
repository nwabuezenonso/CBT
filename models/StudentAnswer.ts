import mongoose from 'mongoose';

const StudentAnswerSchema = new mongoose.Schema({
  examAttemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamAttempt',
    required: [true, 'Exam attempt reference is required'],
  },
  examQuestionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamQuestion',
    required: [true, 'Exam question reference is required'],
  },
  selectedOptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnswerOption',
    required: false,
    // Null if not answered yet
  },
  answerText: {
    type: String,
    required: false,
    // For short-answer and essay questions
  },
  isCorrect: {
    type: Boolean,
    required: false,
    // Calculated after submission
  },
  marksAwarded: {
    type: Number,
    required: false,
    // Calculated after submission
  },
  timeSpentSeconds: {
    type: Number,
    default: 0,
    // Time spent on this specific question
  },
  markedForReview: {
    type: Boolean,
    default: false,
  },
  answeredAt: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
StudentAnswerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
StudentAnswerSchema.index({ examAttemptId: 1, examQuestionId: 1 });

export default mongoose.models.StudentAnswer || mongoose.model('StudentAnswer', StudentAnswerSchema);
