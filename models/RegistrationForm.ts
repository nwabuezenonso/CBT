import mongoose from 'mongoose';

const RegistrationFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
  },
  targetClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: false, // Optional: if set, students are auto-assigned to this class
  },
  targetSubject: {
    type: String,
    required: false, // Optional: for tutorial centers or specific subjects
  },
  accessDurationDays: {
    type: Number,
    required: false, // Optional: if set, student access expires after this many days
  },
  fields: [{
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'number', 'email', 'tel', 'date'], default: 'text' },
    required: { type: Boolean, default: false },
    options: [String], // For select/radio types if needed in future
  }],
  isActive: {
    type: Boolean,
    default: true,
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

RegistrationFormSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.RegistrationForm || mongoose.model('RegistrationForm', RegistrationFormSchema);
