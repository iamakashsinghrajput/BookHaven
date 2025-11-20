import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { getAllPapers } from '../../../data/questionPapers';
import connectDB from '../../../../lib/mongodb';
import Book from '../../../../models/Book';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Verify admin access
    if (!session || (session.user as any)?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { paperId, paperType = 'static' } = await request.json();

    if (!paperId) {
      return NextResponse.json({ error: 'Paper ID required' }, { status: 400 });
    }

    let paper;

    if (paperType === 'uploaded') {
      // For user-uploaded papers from MongoDB
      await connectDB();
      paper = await Book.findById(paperId).populate('uploadedBy', 'name email');

      if (!paper) {
        return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
      }

      console.log(`Admin direct access to uploaded paper ${paperId} (${paper.title}) by ${session.user.email}`);

      return NextResponse.json({
        success: true,
        downloadUrl: paper.fileUrl,
        paperTitle: paper.title,
        paperType: 'uploaded',
        adminAccess: true,
        message: `Admin access granted to "${paper.title}" - no payment required`
      });

    } else {
      // For static papers from questionPapers data
      const allPapers = getAllPapers();
      paper = allPapers.find(p => p.id === parseInt(paperId));

      if (!paper) {
        return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
      }

      console.log(`Admin direct access to static paper ${paperId} (${paper.title}) by ${session.user.email}`);

      return NextResponse.json({
        success: true,
        downloadUrl: paper.url,
        paperTitle: paper.title,
        paperType: 'static',
        adminAccess: true,
        message: `Admin access granted to "${paper.title}" - no payment required`
      });
    }

  } catch (error) {
    console.error('Admin direct download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}