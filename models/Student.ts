import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
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
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: false, // Can be assigned later by admin
  },
  studentId: {
    type: String,
    required: false,
    // Organization-specific student ID (e.g., "STU-2024-001")
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  guardianName: {
    type: String,
    required: false,
    maxlength: [100, 'Guardian name cannot be more than 100 characters'],
  },
  guardianPhone: {
    type: String,
    required: false,
  },
  accessExpiresAt: {
    type: Date,
    required: false,
  },
  customData: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  guardianEmail: {
    type: String,
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
StudentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
StudentSchema.index({ organizationId: 1, classId: 1 });
StudentSchema.index({ userId: 1 });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
