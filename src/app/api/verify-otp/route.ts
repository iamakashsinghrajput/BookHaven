import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return new NextResponse("Missing email or OTP", { status: 400 });
    }
    
    // Connect to MongoDB
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.otp !== otp) {
      return new NextResponse("Invalid OTP", { status: 400 });
    }

    if (user.otpExpires && new Date() > new Date(user.otpExpires)) {
      return new NextResponse("OTP has expired", { status: 400 });
    }

    // Mark email as verified and clear OTP fields
    user.emailVerified = new Date();
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("OTP_VERIFICATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}