import mongoose from 'mongoose';

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
  subject: {
    type: String,
    required: false,
  },
  assignedClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  }],
  assignedSubjects: [{
    type: String,
  }],
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
  duration: {
    type: Number, // in minutes
    required: true,
  },
  totalMarks: {
    type: Number,
    required: false,
    // Calculated from sum of question marks
  },
  passingScore: {
    type: Number,
    required: false,
    // Minimum score to pass
  },
  // Questions are now linked via ExamQuestion model
  shuffleQuestions: {
    type: Boolean,
    default: true,
  },
  shuffleOptions: {
    type: Boolean,
    default: true,
  },
  showResultsImmediately: {
    type: Boolean,
    default: false,
  },
  allowReview: {
    type: Boolean,
    default: true,
    // Allow students to review answers after submission
  },
  maxAttempts: {
    type: Number,
    default: 1,
  },
  instructions: {
    type: String,
    required: false,
  },
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
ExamSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
ExamSchema.index({ organizationId: 1, status: 1 });
ExamSchema.index({ createdBy: 1 });

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema);

