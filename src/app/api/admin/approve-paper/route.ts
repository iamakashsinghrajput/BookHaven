import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Book from '../../../../models/Book';
import UserReward from '../../../../models/UserRewards';
import { sendUserNotification } from '../../../../lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { paperId, approve } = await request.json();

    if (!paperId || typeof approve !== 'boolean') {
      return NextResponse.json({ error: 'Paper ID and approval status required' }, { status: 400 });
    }

    await connectDB();

    // Find the paper
    const paper = await Book.findById(paperId).populate('uploadedBy', 'name email');

    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    if (approve) {
      // Approve the paper
      paper.isApproved = true;
      await paper.save();

      // Check if reward already exists for this paper
      const existingReward = await UserReward.findOne({ paperId: paperId });

      if (!existingReward) {
        // Create reward for the user (₹4 per approved paper)
        const reward = new UserReward({
          userEmail: paper.uploadedBy.email,
          userName: paper.uploadedBy.name || 'Anonymous',
          paperTitle: paper.title,
          paperId: paperId,
          rewardAmount: 4, // ₹4 per approved paper
          status: 'approved' // Approved by admin
        });

        await reward.save();

        console.log(`Admin approved paper "${paper.title}" by ${paper.uploadedBy.email} - ₹4 reward created`);

        // Send approval email to user with reward information
        try {
          await sendUserNotification({
            userName: paper.uploadedBy.name || 'Anonymous',
            userEmail: paper.uploadedBy.email,
            paperTitle: paper.title,
            status: 'approved',
            rewardAmount: 4
          });
          console.log(`Approval notification email sent to ${paper.uploadedBy.email}`);
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
        }

        return NextResponse.json({
          message: 'Paper approved successfully, ₹4 reward created, and user notified!',
          paper: {
            id: paper._id,
            title: paper.title,
            uploader: paper.uploadedBy.email,
            isApproved: true
          },
          reward: {
            amount: 4,
            status: 'approved',
            user: paper.uploadedBy.email
          }
        });
      } else {
        // Paper already has reward, just approve it
        return NextResponse.json({
          message: 'Paper approved successfully (reward already exists)',
          paper: {
            id: paper._id,
            title: paper.title,
            uploader: paper.uploadedBy.email,
            isApproved: true
          }
        });
      }
    } else {
      // Reject the paper
      paper.isApproved = false;
      await paper.save();

      console.log(`Admin rejected paper "${paper.title}" by ${paper.uploadedBy.email}`);

      // Send rejection email to user
      try {
        await sendUserNotification({
          userName: paper.uploadedBy.name || 'Anonymous',
          userEmail: paper.uploadedBy.email,
          paperTitle: paper.title,
          status: 'rejected',
          adminMessage: 'Your paper did not meet our quality standards. Please feel free to upload another paper.'
        });
        console.log(`Rejection notification email sent to ${paper.uploadedBy.email}`);
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
      }

      return NextResponse.json({
        message: 'Paper rejected and user notified',
        paper: {
          id: paper._id,
          title: paper.title,
          uploader: paper.uploadedBy.email,
          isApproved: false
        }
      });
    }

  } catch (error) {
    console.error('Error approving paper:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}