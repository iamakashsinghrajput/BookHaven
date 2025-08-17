import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import UserActivity, { IUserActivityLean } from "../../../models/UserActivity";

export const dynamic = 'force-dynamic';

// Define a specific type for the query object
interface PaperQuery {
  type: 'upload';
  resourceType: 'paper';
  category?: string;
  subject?: { $regex: string; $options: 'i' };
  tags?: string;
}

// GET - Fetch all public uploaded papers for display to all users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const subject = searchParams.get('subject');
    const year = searchParams.get('year');

    await connectDB();

    // Build query for public uploaded papers
    const query: PaperQuery = { 
      type: 'upload',
      resourceType: 'paper'
    };

    // Add filters if provided
    if (category) {
      query.category = category;
    }
    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }
    if (year) {
      query.tags = year;
    }

    // Fetch public uploaded papers with user information
    const activities = await UserActivity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .lean() as unknown as IUserActivityLean[];

    // Transform the data to match QuestionPaper interface
    const publicPapers = activities.map((activity: IUserActivityLean) => {
      // Type guard to ensure userId is populated
      const uploaderName = (activity.userId && typeof activity.userId === 'object' && 'name' in activity.userId) ? activity.userId.name : 'Anonymous';
      const uploaderEmail = (activity.userId && typeof activity.userId === 'object' && 'email' in activity.userId) ? activity.userId.email : '';

      return {
        id: activity._id.toString(),
        title: activity.title,
        category: activity.category,
        subCategory: activity.tags?.find((tag: string) => ['jee', 'neet', 'class12', 'class10', 'upsc', 'cse', 'mech', 'btech', 'aiims'].includes(tag)) || 'other',
        year: parseInt(activity.tags?.find((tag: string) => /^\d{4}$/.test(tag)) || new Date().getFullYear().toString()),
        subject: activity.subject,
        url: activity.fileUrl,
        isUserUploaded: true,
        uploaderName,
        uploaderEmail,
        uploadDate: new Date(activity.createdAt).toISOString().split('T')[0]
      }
    });

    return NextResponse.json({
      papers: publicPapers,
      count: publicPapers.length
    });

  } catch (error) {
    console.error("PUBLIC_PAPERS_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}