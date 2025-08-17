import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import connectDB from "../../../lib/mongodb";
import UserActivity from "../../../models/UserActivity";
import Book from "../../../models/Book";
import User from "../../../models/User";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
    const fileName = `${timestamp}_${originalName}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'papers');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file to local storage
    const filePath = path.join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);
    
    // Create file URL
    const fileUrl = `/uploads/papers/${fileName}`;

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

    return NextResponse.json({
      message: "Paper uploaded successfully",
      bookId: newBook._id,
      fileUrl,
    }, { status: 201 });

  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}