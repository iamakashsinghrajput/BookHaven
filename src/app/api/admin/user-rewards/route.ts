import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import UserReward from '../../../../models/UserRewards';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    await connectDB();

    const rewards = await UserReward.find({})
      .sort({ uploadDate: -1 })
      .exec();

    const formattedRewards = rewards.map(reward => ({
      _id: reward._id,
      userEmail: reward.userEmail,
      userName: reward.userName,
      userMobile: reward.userMobile || 'Not provided',
      paperTitle: reward.paperTitle,
      paperId: reward.paperId,
      rewardAmount: reward.rewardAmount,
      uploadDate: reward.uploadDate.toISOString().split('T')[0],
      status: reward.status,
      paidDate: reward.paidDate ? reward.paidDate.toISOString().split('T')[0] : null,
      notes: reward.notes
    }));

    return NextResponse.json(formattedRewards);
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}