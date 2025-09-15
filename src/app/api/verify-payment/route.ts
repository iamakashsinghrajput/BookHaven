import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { getAllPapers, QuestionPaper } from '../../data/questionPapers';
import connectDB from '../../../lib/mongodb';
import UserActivity, { IUserActivityLean } from '../../../models/UserActivity';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification parameters' },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Get order details from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const paperId = order.notes?.paperId;

    if (!paperId) {
      return NextResponse.json(
        { error: 'Invalid paper ID' },
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
        paper = allPapers.find(p => p.id === parseInt(paperId as string));
      }

    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Log the successful payment (you might want to store this in a database)
    console.log(`Payment successful for paper ${paperId} by user ${session.user.email}`);

    let downloadUrl = paper.url;
    if (downloadUrl.startsWith('/uploads/')) {
      downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}${downloadUrl}`;
    }

    // Return success with download URL
    return NextResponse.json({
      success: true,
      downloadUrl: downloadUrl,
      paperTitle: paper.title,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
