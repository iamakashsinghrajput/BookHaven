import mongoose from 'mongoose';

interface IUserReward extends mongoose.Document {
  userEmail: string;
  userName: string;
  paperTitle: string;
  paperId?: string;
  rewardAmount: number;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'paid';
  notes?: string;
}

const userRewardSchema = new mongoose.Schema<IUserReward>({
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  paperTitle: {
    type: String,
    required: true,
    trim: true
  },
  paperId: {
    type: String,
    trim: true
  },
  rewardAmount: {
    type: Number,
    required: true,
    default: 4 // ₹4 per upload
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid'],
    default: 'approved'
  },
  notes: {
    type: String,
    trim: true
  }
});

// Index for efficient queries
userRewardSchema.index({ userEmail: 1, uploadDate: -1 });
userRewardSchema.index({ status: 1 });

const UserReward = mongoose.models.UserReward || mongoose.model<IUserReward>('UserReward', userRewardSchema);

export default UserReward;
export type { IUserReward };