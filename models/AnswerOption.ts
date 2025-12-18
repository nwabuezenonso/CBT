import mongoose from 'mongoose';

const AnswerOptionSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Question reference is required'],
  },
  optionText: {
    type: String,
    required: [true, 'Option text is required'],
  },
  optionImageUrl: {
    type: String,
    required: false,
  },
  isCorrect: {
    type: Boolean,
    required: [true, 'Please specify if this option is correct'],
    default: false,
  },
  displayOrder: {
    type: Number,
    required: [true, 'Display order is required'],
    // Original order before shuffling (0, 1, 2, 3...)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
AnswerOptionSchema.index({ questionId: 1, displayOrder: 1 });

export default mongoose.models.AnswerOption || mongoose.model('AnswerOption', AnswerOptionSchema);
