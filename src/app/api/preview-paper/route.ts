import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { getAllPapers, QuestionPaper } from '../../data/questionPapers';
import connectDB from '../../../lib/mongodb';
import UserActivity, { IUserActivityLean } from '../../../models/UserActivity';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required for preview' },
        { status: 401 }
      );
    }

    const { paperId, paperUrl } = await req.json();

    if (!paperId) {
      return NextResponse.json(
        { error: 'Paper ID is required' },
        { status: 400 }
      );
    }

    let paper: QuestionPaper | undefined;

    if (typeof paperId === 'string' && paperId.match(/^[0-9a-fA-F]{24}$/)) {
      await connectDB();
      const activity = await UserActivity.findById(paperId);
      if (activity) {
        paper = {
          id: activity._id.toString(),
          title: activity.title,
          category: activity.category as QuestionPaper['category'],
          subCategory: activity.tags?.find((tag: string) => ['jee', 'neet', 'class12', 'class10', 'upsc', 'cse', 'mech', 'btech', 'aiims'].includes(tag)) || 'other',
          year: parseInt(activity.tags?.find((tag: string) => /^\d{4}$/.test(tag)) || new Date().getFullYear().toString()),
          subject: activity.subject,
          url: activity.fileUrl || '#',
          isUserUploaded: true,
        };
      }
    } else {
      const allPapers = getAllPapers();
      paper = allPapers.find(p => p.id === paperId);
    }

    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Don't allow preview for unavailable papers
    if (paper.url === '#') {
      return NextResponse.json(
        { error: 'Preview not available for this paper' },
        { status: 404 }
      );
    }

    // For security, we'll create a time-limited preview URL
    let previewUrl = paper.url;

    if (paper.url.startsWith('http')) {
      const encodedUrl = encodeURIComponent(paper.url);
      previewUrl = `/api/secure-embed?url=${encodedUrl}&paper=${paperId}&user=${encodeURIComponent(session.user.email)}`;
    } else if (paper.url.startsWith('/sample-papers/') || paper.url.startsWith('/uploads/papers/')) {
      previewUrl = `/api/secure-embed?local=${encodeURIComponent(paper.url)}&paper=${paperId}&user=${encodeURIComponent(session.user.email)}`;
    }

    console.log(`Preview accessed: Paper ${paperId} by ${session.user.email} at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      previewUrl,
      restrictions: {
        timeLimit: 300000, // 5 minutes in milliseconds
        downloadDisabled: true,
        screenshotProtected: true,
      },
    });
  } catch (error) {
    console.error('Preview generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}