import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const externalUrl = searchParams.get('url');
    const localPath = searchParams.get('local');
    const paperId = searchParams.get('paper');
    const userEmail = searchParams.get('user');

    if (!paperId || !userEmail || userEmail !== session.user.email) {
      return new Response('Invalid access parameters', { status: 403 });
    }

    let pdfBytes: Buffer;

    if (externalUrl) {
      const decodedUrl = decodeURIComponent(externalUrl);
      const response = await fetch(decodedUrl);
      if (!response.ok) {
        return new Response('Failed to fetch PDF', { status: 500 });
      }
      pdfBytes = Buffer.from(await response.arrayBuffer());
    } else if (localPath) {
      const decodedPath = decodeURIComponent(localPath);
      if (!decodedPath.startsWith('/sample-papers/') && !decodedPath.startsWith('/uploads/papers/')) {
        return new Response('Access denied', { status: 403 });
      }
      const filePath = path.join(process.cwd(), 'public', decodedPath);
      pdfBytes = await fs.readFile(filePath);
    } else {
      return new Response('Invalid request', { status: 400 });
    }

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdfDoc = await PDFDocument.create();
    const [firstPage] = await newPdfDoc.copyPages(pdfDoc, [0]);
    newPdfDoc.addPage(firstPage);

    const newPdfBytes = await newPdfDoc.save();

    return new Response(newPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="preview.pdf"',
      },
    });

  } catch (error) {
    console.error('Secure embed error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
