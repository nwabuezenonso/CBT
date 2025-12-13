import mongoose, { Schema, model, models } from 'mongoose';

const RegistrationFieldSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'email', 'select', 'textarea', 'date'] },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [String],
});

const RegistrationResponseSchema = new Schema({
  id: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentName: { type: String, required: true },
  responses: { type: Map, of: String },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

const RegistrationFormSchema = new Schema({
  examId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  fields: [RegistrationFieldSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  responses: [RegistrationResponseSchema]
}, { timestamps: true });

const RegistrationForm = models.RegistrationForm || model('RegistrationForm', RegistrationFormSchema);

export default RegistrationForm;
