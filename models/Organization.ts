import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an organization name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  type: {
    type: String,
    enum: ['SCHOOL', 'TUTORIAL_CENTER'],
    required: [true, 'Please specify organization type'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email for this organization'],
    unique: true,
  },
  phone: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  logoUrl: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'INACTIVE'],
    default: 'ACTIVE',
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
OrganizationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);
