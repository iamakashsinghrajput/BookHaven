import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import connectDB from "../../../../lib/mongodb";
import UserActivity from "../../../../models/UserActivity";
import Book from "../../../../models/Book";
import User from "../../../../models/User";
import { unlink } from 'fs/promises';
import path from 'path';

// GET - Get specific paper details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const book = await Book.findOne({ 
      _id: params.id,
      uploadedBy: user._id 
    });

    if (!book) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    return NextResponse.json(book);

  } catch (error) {
    console.error("GET_PAPER_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT - Update paper details
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updateData = await request.json();
    const { title, subject, category, description, tags } = updateData;

    const book = await Book.findOneAndUpdate(
      { 
        _id: params.id,
        uploadedBy: user._id 
      },
      {
        title,
        subject,
        category,
        description,
        tags: Array.isArray(tags) ? tags : tags?.split(',').map((tag: string) => tag.trim()),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!book) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Update corresponding user activity
    await UserActivity.findOneAndUpdate(
      {
        userId: user._id,
        resourceId: params.id,
        type: 'upload'
      },
      {
        title,
        subject,
        category,
        tags: Array.isArray(tags) ? tags : tags?.split(',').map((tag: string) => tag.trim()),
      }
    );

    return NextResponse.json({ 
      message: "Paper updated successfully",
      book 
    });

  } catch (error) {
    console.error("UPDATE_PAPER_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE - Delete paper
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }


    const book = await Book.findOne({ 
      _id: params.id,
      uploadedBy: user._id 
    });

    if (!book) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Delete the physical file
    if (book.fileUrl) {
      try {
        const filename = book.fileUrl.split('/').pop();
        if (filename) {
          const filePath = path.join(process.cwd(), 'public', 'uploads', 'papers', filename);
          await unlink(filePath);
        }
      } catch (fileError) {
        console.error("File deletion error:", fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await Book.findByIdAndDelete(params.id);

    // Delete corresponding user activities
    await UserActivity.deleteMany({
      userId: user._id,
      resourceId: params.id
    });

    return NextResponse.json({ 
      message: "Paper deleted successfully" 
    });

  } catch (error) {
    console.error("DELETE_PAPER_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}