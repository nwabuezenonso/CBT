import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required'],
  },
  name: {
    type: String,
    required: [true, 'Please provide a class name'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  level: {
    type: String,
    required: [true, 'Please provide a class level'],
    // Examples: JSS1, JSS2, JSS3, SS1, SS2, SS3
  },
  section: {
    type: String,
    required: false,
    // Examples: A, B, C
  },
  academicYear: {
    type: String,
    required: [true, 'Please provide an academic year'],
    // Example: 2024/2025
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
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
ClassSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
ClassSchema.index({ organizationId: 1, level: 1, section: 1 });

export default mongoose.models.Class || mongoose.model('Class', ClassSchema);
