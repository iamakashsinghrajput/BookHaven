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

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return new NextResponse("File size must be less than 10MB", { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new NextResponse("Only PDF and image files are allowed", { status: 400 });
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
    const mobile = formData.get('mobile') as string;

    // Validate required fields
    if (!title || !subject || !category || !mobile) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate mobile number format
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return new NextResponse("Please enter a valid 10-digit mobile number", { status: 400 });
    }

    // Update user's mobile number if not already set or if changed
    if (user.mobile !== mobile) {
      user.mobile = mobile;
      await user.save();
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

    // Create reward entry for the user (₹4 per paper)
    const reward = new UserReward({
      userEmail: user.email,
      userName: user.name || 'Anonymous',
      userMobile: user.mobile || null,
      paperTitle: title,
      paperId: newBook._id.toString(),
      rewardAmount: 4,
      status: 'approved', // Set to approved after paper upload
      uploadDate: new Date()
    });

    await reward.save();
    console.log(`Reward created for ${user.email}: ₹4 for paper "${title}"`);

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