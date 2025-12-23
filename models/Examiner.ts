import mongoose from 'mongoose';

const ExaminerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required'],
  },
  active: {
    type: Boolean,
    default: true,
  },
  subjects: {
    type: [String],
    default: [],
  },
  employeeId: {
    type: String,
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
ExaminerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
ExaminerSchema.index({ organizationId: 1 });
ExaminerSchema.index({ userId: 1 });

export default mongoose.models.Examiner || mongoose.model('Examiner', ExaminerSchema);
