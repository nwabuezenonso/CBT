import mongoose from 'mongoose';

const ExamAttemptSchema = new mongoose.Schema({
  examAssignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamAssignment',
    required: [true, 'Exam assignment reference is required'],
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student reference is required'],
  },
  attemptNumber: {
    type: Number,
    required: [true, 'Attempt number is required'],
    default: 1,
  },
  startedAt: {
    type: Date,
    required: [true, 'Start time is required'],
    default: Date.now,
  },
  submittedAt: {
    type: Date,
    required: false,
  },
  timeSpentSeconds: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    required: false,
    // Calculated after submission
  },
  percentage: {
    type: Number,
    required: false,
    // Calculated after submission
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'SUBMITTED', 'AUTO_SUBMITTED', 'ABANDONED'],
    default: 'IN_PROGRESS',
  },
  questionShuffleSeed: {
    type: Number,
    required: [true, 'Question shuffle seed is required'],
    // Used to consistently shuffle questions for this attempt
  },
  optionsShuffleSeed: {
    type: Number,
    required: [true, 'Options shuffle seed is required'],
    // Used to consistently shuffle options for this attempt
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
ExamAttemptSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
ExamAttemptSchema.index({ examAssignmentId: 1, studentId: 1 });
ExamAttemptSchema.index({ studentId: 1, status: 1 });

export default mongoose.models.ExamAttempt || mongoose.model('ExamAttempt', ExamAttemptSchema);
