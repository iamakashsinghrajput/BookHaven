import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { getAllPapers } from '../../../../data/questionPapers';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const paperId = parseInt(params.id);
    const papers = getAllPapers();
    const paper = papers.find(p => p.id === paperId);

    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    if (paper.url === '#') {
      return NextResponse.json({ error: 'Paper not available yet' }, { status: 404 });
    }

    // For external URLs, redirect directly
    if (paper.url.startsWith('http')) {
      return NextResponse.redirect(paper.url);
    }

    // For local files, serve them directly (admin has unrestricted access)
    // In a real implementation, you'd serve the actual file from your storage
    return NextResponse.json({
      message: 'Admin download access',
      paper: {
        id: paper.id,
        title: paper.title,
        url: paper.url,
        directAccess: true
      }
    });

  } catch (error) {
    console.error('Error in admin download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}