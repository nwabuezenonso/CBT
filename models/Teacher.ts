import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
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
  subjects: {
    type: [String],
    default: [],
    // Examples: ['Mathematics', 'English', 'Physics']
  },
  employeeId: {
    type: String,
    required: false,
    // Organization-specific employee ID
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
    // The org admin who created this teacher account
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
TeacherSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
TeacherSchema.index({ organizationId: 1 });
TeacherSchema.index({ userId: 1 });

export default mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
