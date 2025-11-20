import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import UserReward from '../../../../models/UserRewards';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { rewardId, status } = await request.json();

    if (!rewardId || !status) {
      return NextResponse.json({ error: 'Reward ID and status are required' }, { status: 400 });
    }

    if (!['pending', 'approved', 'paid'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();

    // Prepare update object
    const updateData: any = { status };

    // If marking as paid, set the paidDate
    if (status === 'paid') {
      updateData.paidDate = new Date();
    }

    const updatedReward = await UserReward.findByIdAndUpdate(
      rewardId,
      updateData,
      { new: true }
    );

    if (!updatedReward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Reward status updated successfully',
      reward: updatedReward
    });
  } catch (error) {
    console.error('Error updating reward status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}