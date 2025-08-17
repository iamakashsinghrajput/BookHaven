import mongoose, { Document, Schema, Types } from 'mongoose';

// This is the full Mongoose Document type
export interface IUserActivity extends Document {
  userId: Types.ObjectId;
  type: 'download' | 'upload' | 'search' | 'view';
  resourceType: 'paper' | 'book' | 'note';
  resourceId?: Types.ObjectId;
  title: string;
  subject: string;
  category: string;
  tags: string[];
  fileUrl?: string;
  metadata?: {
    fileSize?: number;
    fileType?: string;
    downloadCount?: number;
    rating?: number;
  };
  searchQuery?: string;
  createdAt: Date;
  updatedAt: Date;
}

// This is a plain object type for lean queries
export interface IUserActivityLean {
  _id: Types.ObjectId;
  userId: Types.ObjectId | { name: string; email: string }; // Can be populated
  type: 'download' | 'upload' | 'search' | 'view';
  resourceType: 'paper' | 'book' | 'note';
  resourceId?: Types.ObjectId;
  title: string;
  subject: string;
  category: string;
  tags: string[];
  fileUrl?: string;
  metadata?: {
    fileSize?: number;
    fileType?: string;
    downloadCount?: number;
    rating?: number;
  };
  searchQuery?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserActivitySchema = new Schema<IUserActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['download', 'upload', 'search', 'view'],
    required: true,
    index: true,
  },
  resourceType: {
    type: String,
    enum: ['paper', 'book', 'note'],
    required: true,
    index: true,
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  fileUrl: {
    type: String,
    trim: true,
  },
  metadata: {
    fileSize: Number,
    fileType: String,
    downloadCount: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 5 },
  },
  searchQuery: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Compound indexes for better query performance
UserActivitySchema.index({ userId: 1, type: 1, createdAt: -1 });
UserActivitySchema.index({ userId: 1, subject: 1, createdAt: -1 });
UserActivitySchema.index({ userId: 1, category: 1, createdAt: -1 });
UserActivitySchema.index({ tags: 1 });

const UserActivity = mongoose.models.UserActivity || mongoose.model<IUserActivity>('UserActivity', UserActivitySchema);

export default UserActivity;
