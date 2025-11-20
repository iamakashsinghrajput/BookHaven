import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import UserActivity from "../../../models/UserActivity";
import VerificationCode from "../../../models/VerificationCode";
import nodemailer from 'nodemailer';

// Generate random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Setup nodemailer transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

export async function POST(request: Request) {
  try {
    const { paperId, userEmail } = await request.json();

    if (!paperId || !userEmail) {
      return new NextResponse("Missing paperId or userEmail", { status: 400 });
    }

    await connectDB();

    // Find the paper and verify ownership
    const paper = await UserActivity.findById(paperId).populate('userId', 'email name');
    
    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Check if the user email matches the uploader's email
    if (paper.userId.email !== userEmail) {
      return new NextResponse("You are not authorized to delete this paper", { status: 403 });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Delete any existing verification codes for this paper and email
    await VerificationCode.deleteMany({ paperId, email: userEmail });

    // Store verification code in database
    const newVerificationCode = new VerificationCode({
      paperId,
      email: userEmail,
      code: verificationCode,
      expiry
    });

    await newVerificationCode.save();
    console.log(`Verification code saved: paperId=${paperId}, email=${userEmail}, code=${verificationCode}, expiry=${expiry}`);

    // Send email with verification code
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Paper Deletion Verification - BookHaven',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Paper Deletion Verification</h2>
          <p>Hello ${paper.userId.name || 'User'},</p>
          <p>You have requested to delete the following paper:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>Title:</strong> ${paper.title}<br>
            <strong>Subject:</strong> ${paper.subject}<br>
            <strong>Category:</strong> ${paper.category}
          </div>
          <p>Your verification code is:</p>
          <div style="background: #007bff; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 15px 0;">
            ${verificationCode}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p>If you did not request this deletion, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">BookHaven - Your Educational Resource Hub</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${userEmail} for paper: ${paper.title}`);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return new NextResponse("Failed to send verification email", { status: 500 });
    }

    return NextResponse.json({
      message: "Verification code sent successfully",
      expiry: expiry.getTime()
    });

  } catch (error) {
    console.error("SEND_DELETE_VERIFICATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}