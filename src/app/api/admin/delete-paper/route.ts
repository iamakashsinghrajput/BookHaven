import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Book from '../../../../models/Book';
import UserActivity from '../../../../models/UserActivity';
import UserReward from '../../../../models/UserRewards';
import { del } from '@vercel/blob';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || (session.user as any)?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    await connectDB();

    const { paperId } = await request.json();

    if (!paperId) {
      return NextResponse.json({ error: 'Paper ID is required' }, { status: 400 });
    }

    // Find the paper
    const paper = await Book.findById(paperId);

    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // Delete the file from Vercel Blob if it exists
    if (paper.fileUrl) {
      try {
        // Check if it's a Vercel Blob URL
        if (paper.fileUrl.includes('blob.vercel-storage.com')) {
          await del(paper.fileUrl);
          console.log(`Deleted file from Vercel Blob: ${paper.fileUrl}`);
        }
      } catch (fileError) {
        console.error('Error deleting file from Vercel Blob:', fileError);
        // Continue with deletion even if file deletion fails
      }
    }

    // Delete associated user activities
    await UserActivity.deleteMany({
      resourceId: paperId,
      type: 'upload'
    });

    // Delete associated rewards
    const deletedRewards = await UserReward.deleteMany({
      paperId: paperId.toString()
    });

    // Delete the paper from database
    await Book.findByIdAndDelete(paperId);

    console.log(`Admin deleted paper: ${paper.title} (ID: ${paperId})`);
    console.log(`Deleted ${deletedRewards.deletedCount} associated rewards`);

    return NextResponse.json({
      message: 'Paper deleted successfully',
      deletedPaper: paper.title,
      deletedRewards: deletedRewards.deletedCount
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting paper:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
