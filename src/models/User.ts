import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  otp?: string;
  otpExpires?: Date;
  emailVerified?: Date;
  image?: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      return this.provider !== 'google';
    },
  },
  mobile: {
    type: String,
    trim: true,
    default: null,
    validate: {
      validator: function(v: string) {
        // Optional field, but if provided, must be valid Indian mobile number
        if (!v) return true;
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Please enter a valid 10-digit mobile number'
    }
  },
  otp: {
    type: String,
    default: undefined,
  },
  otpExpires: {
    type: Date,
    default: undefined,
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials',
  },
}, {
  timestamps: true,
});

// Index for faster queries (email already has unique index from schema definition)
UserSchema.index({ otp: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;