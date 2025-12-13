import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  examId: {
    type: String,
    required: true,
    ref: 'Exam'
  },
  examTitle: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed'],
    default: 'assigned',
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  }
});

export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
