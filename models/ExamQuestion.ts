import mongoose from 'mongoose';

const ExamQuestionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam reference is required'],
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Question reference is required'],
  },
  questionOrder: {
    type: Number,
    required: [true, 'Question order is required'],
    // Order in the exam (1, 2, 3...) before shuffling
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    default: 1,
    // Can override the default points from Question
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for faster queries
ExamQuestionSchema.index({ examId: 1, questionOrder: 1 });
ExamQuestionSchema.index({ questionId: 1 });

export default mongoose.models.ExamQuestion || mongoose.model('ExamQuestion', ExamQuestionSchema);
