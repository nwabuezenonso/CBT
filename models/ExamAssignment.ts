import mongoose from 'mongoose';

const ExamAssignmentSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam reference is required'],
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class reference is required'],
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assigner reference is required'],
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED',
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
ExamAssignmentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Auto-update status based on time
ExamAssignmentSchema.methods.updateStatus = function() {
  const now = new Date();
  if (this.status === 'CANCELLED') return;
  
  if (now < this.startTime) {
    this.status = 'SCHEDULED';
  } else if (now >= this.startTime && now <= this.endTime) {
    this.status = 'ACTIVE';
  } else if (now > this.endTime) {
    this.status = 'COMPLETED';
  }
};

// Index for faster queries
ExamAssignmentSchema.index({ examId: 1, classId: 1 });
ExamAssignmentSchema.index({ classId: 1, status: 1 });

export default mongoose.models.ExamAssignment || mongoose.model('ExamAssignment', ExamAssignmentSchema);
