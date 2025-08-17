import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
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