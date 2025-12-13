import mongoose from 'mongoose';

const ExamProgressSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  examineeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: {
    type: Map,
    of: String, // Or Mixed if we want to store other types
    default: {},
  },
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  timeRemaining: {
    type: Number, // In seconds
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to quickly find a user's progress for a specific exam
ExamProgressSchema.index({ examId: 1, examineeId: 1 }, { unique: true });

export default mongoose.models.ExamProgress || mongoose.model('ExamProgress', ExamProgressSchema);
