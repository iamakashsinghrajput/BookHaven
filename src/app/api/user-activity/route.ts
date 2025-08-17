import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import connectDB from "../../../lib/mongodb";
import UserActivity from "../../../models/UserActivity";
import User from "../../../models/User";

// GET - Fetch user's activities
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'download', 'upload', 'search', 'view'
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    await connectDB();
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Build query
    const query: any = { userId: user._id };
    if (type) {
      query.type = type;
    }

    // Fetch activities with pagination
    const activities = await UserActivity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const totalCount = await UserActivity.countDocuments(query);

    return NextResponse.json({
      activities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore: page * limit < totalCount,
      },
    });

  } catch (error) {
    console.error("USER_ACTIVITY_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST - Record new user activity
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      resourceType,
      resourceId,
      title,
      subject,
      category,
      tags = [],
      fileUrl,
      metadata = {},
      searchQuery,
    } = body;

    // Validate required fields
    if (!type || !resourceType || !title || !subject || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectDB();
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create activity record
    const activity = new UserActivity({
      userId: user._id,
      type,
      resourceType,
      resourceId: resourceId || undefined,
      title,
      subject,
      category,
      tags,
      fileUrl,
      metadata,
      searchQuery,
    });

    await activity.save();

    return NextResponse.json({ 
      message: "Activity recorded successfully",
      activityId: activity._id,
    }, { status: 201 });

  } catch (error) {
    console.error("USER_ACTIVITY_POST_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}