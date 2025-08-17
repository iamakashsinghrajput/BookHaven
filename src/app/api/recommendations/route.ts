import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import connectDB from "../../../lib/mongodb";
import UserActivity, { IUserActivity } from "../../../models/UserActivity";
import Book, { IBook } from "../../../models/Book";
import User from "../../../models/User";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    await connectDB();
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get user's activity data for recommendations
    const userActivities = await UserActivity.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(100) // Get recent activities
      .lean() as unknown as IUserActivity[];

    // Extract user preferences
    const subjectCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};

    userActivities.forEach((activity: IUserActivity) => {
      // Count subjects
      subjectCounts[activity.subject] = (subjectCounts[activity.subject] || 0) + 1;
      
      // Count categories
      categoryCounts[activity.category] = (categoryCounts[activity.category] || 0) + 1;
      
      // Count tags
      activity.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Get top preferences
    const topSubjects = Object.entries(subjectCounts)
      .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)
      .slice(0, 3)
      .map(([subject]: [string, number]) => subject);

    const topCategories = Object.entries(categoryCounts)
      .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)
      .slice(0, 3)
      .map(([category]: [string, number]) => category);

    const topTags = Object.entries(tagCounts)
      .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)
      .slice(0, 5)
      .map(([tag]: [string, number]) => tag);

    // Build recommendation query
    const recommendationQuery: any = {
      isPublic: true,
      isApproved: true,
    };

    // If user has preferences, use them
    if (topSubjects.length > 0 || topCategories.length > 0 || topTags.length > 0) {
      recommendationQuery.$or = [];
      
      if (topSubjects.length > 0) {
        recommendationQuery.$or.push({ subject: { $in: topSubjects } });
      }
      
      if (topCategories.length > 0) {
        recommendationQuery.$or.push({ category: { $in: topCategories } });
      }
      
      if (topTags.length > 0) {
        recommendationQuery.$or.push({ tags: { $in: topTags } });
      }
    }

    // Get recommendations
    let recommendations = await Book.find(recommendationQuery)
      .populate('uploadedBy', 'name')
      .sort({ 
        downloadCount: -1, 
        'rating.average': -1, 
        createdAt: -1 
      })
      .limit(limit)
      .lean() as unknown as IBook[];

    // If not enough personalized recommendations, get popular books
    if (recommendations.length < limit) {
      const additionalBooks = await Book.find({
        isPublic: true,
        isApproved: true,
        _id: { $nin: recommendations.map((book: IBook) => book._id) },
      })
        .populate('uploadedBy', 'name')
        .sort({ downloadCount: -1, 'rating.average': -1 })
        .limit(limit - recommendations.length)
        .lean() as unknown as IBook[];

      recommendations = [...recommendations, ...additionalBooks];
    }

    // Calculate recommendation reasons
    const recommendationsWithReasons = recommendations.map((book: IBook) => {
      const reasons = [];
      
      if (topSubjects.includes(book.subject)) {
        reasons.push(`You frequently study ${book.subject}`);
      }
      
      if (topCategories.includes(book.category)) {
        reasons.push(`Popular in ${book.category}`);
      }
      
      const matchingTags = book.tags.filter((tag: string) => topTags.includes(tag));
      if (matchingTags.length > 0) {
        reasons.push(`Related to ${matchingTags.slice(0, 2).join(', ')}`);
      }
      
      if (reasons.length === 0) {
        reasons.push('Highly rated by other users');
      }

      return {
        ...book,
        recommendationReason: reasons[0], // Use the first/best reason
      };
    });

    return NextResponse.json({
      recommendations: recommendationsWithReasons,
      userPreferences: {
        topSubjects,
        topCategories,
        topTags,
      },
    });

  } catch (error) {
    console.error("RECOMMENDATIONS_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}