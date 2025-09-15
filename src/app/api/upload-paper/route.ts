import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import connectDB from "../../../lib/mongodb";
import UserActivity from "../../../models/UserActivity";
import Book from "../../../models/Book";
import User from "../../../models/User";
import UserReward from "../../../models/UserRewards";
import { sendAdminUploadNotification, sendUserNotification } from "../../../lib/email";
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Get form fields
    const title = formData.get('title') as string;
    const subject = formData.get('subject') as string;
    const category = formData.get('category') as string;
    const year = formData.get('year') as string;
    const branch = formData.get('branch') as string;
    const description = formData.get('description') as string;
    const examType = formData.get('examType') as string;
    const tagsString = formData.get('tags') as string;

    // Validate required fields
    if (!title || !subject || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Process tags
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    // Add additional tags based on form data
    if (year) tags.push(year);
    if (branch) tags.push(branch);
    if (examType) tags.push(examType);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `papers/${timestamp}_${originalName}`;
    
    // Upload file to Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
    });
    
    // Get the file URL from blob
    const fileUrl = blob.url;

    // Create book record
    const newBook = new Book({
      title,
      author: user.name,
      subject,
      category,
      tags,
      description: description || undefined,
      fileUrl,
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: user._id,
      isPublic: true,
      isApproved: false, // Requires admin approval
    });

    await newBook.save();

    // Record user activity
    const activity = new UserActivity({
      userId: user._id,
      type: 'upload',
      resourceType: 'paper',
      resourceId: newBook._id,
      title,
      subject,
      category,
      tags,
      fileUrl,
      metadata: {
        fileSize: file.size,
        fileType: file.type,
        downloadCount: 0,
      },
    });

    await activity.save();

    // Note: Reward will be created only after admin approval

    // Send email notifications
    try {
      // Send notification to admin
      await sendAdminUploadNotification({
        userName: user.name || 'Anonymous',
        userEmail: user.email,
        paperTitle: title,
        category,
        subject,
        uploadDate: new Date().toLocaleDateString()
      });

      // Send confirmation email to user
      await sendUserNotification({
        userName: user.name || 'Anonymous',
        userEmail: user.email,
        paperTitle: title,
        status: 'uploaded'
      });

      console.log(`Email notifications sent for paper upload: ${title} by ${user.email}`);
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
      // Don't fail the upload if email fails, just log it
    }

    return NextResponse.json({
      message: "Paper uploaded successfully! Admin notification sent. You'll receive ₹4 reward once approved.",
      bookId: newBook._id,
      fileUrl,
      pendingApproval: true,
      note: "Your paper is pending admin approval. You'll receive ₹4 reward once approved."
    }, { status: 201 });

  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}