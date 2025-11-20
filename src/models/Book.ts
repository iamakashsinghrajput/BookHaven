import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn?: string;
  subject: string;
  category: string;
  tags: string[];
  description?: string;
  imageUrl?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy: mongoose.Types.ObjectId;
  downloadCount: number;
  viewCount: number;
  rating: {
    average: number;
    count: number;
  };
  isPublic: boolean;
  isApproved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  isbn: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
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
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '/default-book-cover.jpg',
  },
  fileUrl: {
    type: String,
    trim: true,
  },
  fileType: {
    type: String,
    trim: true,
  },
  fileSize: {
    type: Number,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
    index: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  isPublic: {
    type: Boolean,
    default: true,
    index: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true,
  },
  rejectionReason: {
    type: String,
    trim: true,
    default: null,
  },
}, {
  timestamps: true,
});

// Text index for search functionality
BookSchema.index({
  title: 'text',
  author: 'text',
  description: 'text',
  tags: 'text',
});

// Compound indexes for recommendations
BookSchema.index({ subject: 1, category: 1, rating: -1 });
BookSchema.index({ tags: 1, downloadCount: -1 });
BookSchema.index({ isPublic: 1, isApproved: 1, createdAt: -1 });

const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;