import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    default: 'multiple-choice',
  },
  options: [{
    type: String,
  }], // For multiple choice
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be string index or text
    required: false, // Not required for essay
    select: false, 
  },
  points: {
    type: Number,
    default: 1,
  },
});

const ExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this exam.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  examinerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  questions: [QuestionSchema],
  accessCode: {
    type: String, // For private exams
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  scheduledDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
