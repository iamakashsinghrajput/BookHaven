import mongoose from 'mongoose';

const VerificationCodeSchema = new mongoose.Schema({
  paperId: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  expiry: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index for auto-deletion
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster lookups
VerificationCodeSchema.index({ paperId: 1, email: 1 });

const VerificationCode = mongoose.models.VerificationCode || mongoose.model('VerificationCode', VerificationCodeSchema);

export default VerificationCode;