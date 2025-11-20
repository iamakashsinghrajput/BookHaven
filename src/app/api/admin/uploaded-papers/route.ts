import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Book from '../../../../models/Book';
import User from '../../../../models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    await connectDB();

    // Get all uploaded papers with uploader details
    const papers = await Book.find({})
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .exec();

    const formattedPapers = papers.map(paper => ({
      id: paper._id,
      title: paper.title,
      author: paper.author,
      subject: paper.subject,
      category: paper.category,
      tags: paper.tags,
      description: paper.description,
      fileUrl: paper.fileUrl,
      fileType: paper.fileType,
      fileSize: paper.fileSize,
      uploadedBy: {
        name: paper.uploadedBy?.name || 'Unknown',
        email: paper.uploadedBy?.email || 'Unknown'
      },
      downloadCount: paper.downloadCount,
      viewCount: paper.viewCount,
      rating: paper.rating,
      isPublic: paper.isPublic,
      isApproved: paper.isApproved,
      status: paper.status || (paper.isApproved ? 'approved' : 'pending'),
      rejectionReason: paper.rejectionReason || null,
      uploadDate: paper.createdAt.toISOString().split('T')[0],
      createdAt: paper.createdAt,
      updatedAt: paper.updatedAt
    }));

    return NextResponse.json(formattedPapers);
  } catch (error) {
    console.error('Error fetching uploaded papers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}