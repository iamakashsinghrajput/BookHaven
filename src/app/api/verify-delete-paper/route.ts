import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import UserActivity from "../../../models/UserActivity";
import Book from "../../../models/Book";
import VerificationCode from "../../../models/VerificationCode";
import { unlink } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { paperId, userEmail, verificationCode } = await request.json();

    if (!paperId || !userEmail || !verificationCode) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectDB();

    // Check verification code in database
    console.log(`Looking for verification code: paperId=${paperId}, email=${userEmail}, code=${verificationCode}`);
    
    const storedCode = await VerificationCode.findOne({ 
      paperId, 
      email: userEmail,
      expiry: { $gt: new Date() } // Only get non-expired codes
    });

    console.log(`Found stored code:`, storedCode ? { 
      id: storedCode._id, 
      code: storedCode.code, 
      paperId: storedCode.paperId, 
      email: storedCode.email, 
      expiry: storedCode.expiry 
    } : 'Not found');

    if (!storedCode) {
      // Check if there's any code for this paper/email (even expired)
      const anyCode = await VerificationCode.findOne({ paperId, email: userEmail });
      console.log(`Any code found (including expired):`, anyCode ? { 
        code: anyCode.code, 
        expiry: anyCode.expiry,
        isExpired: anyCode.expiry < new Date()
      } : 'None');
      
      return new NextResponse("Verification code not found or expired", { status: 400 });
    }

    if (storedCode.code !== verificationCode) {
      console.log(`Code mismatch: stored=${storedCode.code}, provided=${verificationCode}`);
      return new NextResponse("Invalid verification code", { status: 400 });
    }

    console.log(`Verification successful for paper: ${paperId}`);

    // Find the paper and verify ownership again
    const paper = await UserActivity.findById(paperId).populate('userId', 'email');
    
    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    if (paper.userId.email !== userEmail) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete the physical file if it exists
    if (paper.fileUrl && paper.fileUrl.startsWith('/uploads/')) {
      try {
        const filePath = path.join(process.cwd(), 'public', paper.fileUrl);
        await unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from Book collection if it exists
    if (paper.resourceId) {
      await Book.findByIdAndDelete(paper.resourceId);
    }

    // Delete the UserActivity record
    await UserActivity.findByIdAndDelete(paperId);

    // Clean up verification code
    await VerificationCode.deleteOne({ _id: storedCode._id });

    return NextResponse.json({
      message: "Paper deleted successfully"
    });

  } catch (error) {
    console.error("VERIFY_DELETE_PAPER_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}