import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    

    // Connect to MongoDB
    await connectDB();

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return new NextResponse("Email already exists", { status: 409 });
    }

    

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      provider: 'credentials',
    });

    const savedUser = await newUser.save();
    console.log("✅ REGISTRATION: User created successfully:", savedUser._id, savedUser.email);

    // Send OTP email using nodemailer
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'BookHaven Library <noreply@bookhaven.com>',
        to: email,
        subject: 'Your BookHaven Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563EB; font-family: 'Rampart One', cursive;">BookHaven</h1>
            </div>
            <h2 style="color: #333;">Welcome to BookHaven!</h2>
            <p style="color: #666; line-height: 1.6;">Thank you for signing up. To complete your registration, please use the verification code below:</p>
            
            <div style="background-color: #f8f9fa; border: 2px dashed #2563EB; padding: 30px; text-align: center; margin: 30px 0; border-radius: 10px;">
              <h1 style="color: #2563EB; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Verification Code</p>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;"><strong>⏰ Important:</strong> This code will expire in 10 minutes.</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">If you didn't request this code, please ignore this email. Your account will not be created without verification.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This email was sent by BookHaven Library App<br>
                Your trusted source for academic resources and study materials
              </p>
            </div>
          </div>
        `,
        text: `Welcome to BookHaven! Your verification code is: ${otp}. This code will expire in 10 minutes. If you didn't request this code, please ignore this email.`
      };

      const emailResult = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully with nodemailer:', emailResult.messageId);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Still return success but log the error
      // In production, you might want to handle this differently
    }
    
    return NextResponse.json({ message: "OTP sent to your email." }, { status: 200 });

  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}