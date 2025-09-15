import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./mongodb";
import User from "../models/User";
import Admin from "../models/Admin";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;

        try {
          await connectDB();

          // Check if this is an admin login
          if (credentials.userType === 'admin') {
            // Try to find admin by email or username
            const admin = await Admin.findOne({
              $or: [
                { email: credentials.email },
                { username: credentials.email }
              ]
            });

            if (!admin) {
              throw new Error("No admin found with these credentials.");
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);

            if (!isPasswordValid) {
              throw new Error("Invalid admin credentials.");
            }

            // Update last login
            await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

            return {
              id: admin._id.toString(),
              name: admin.username,
              email: admin.email,
              role: admin.role,
              userType: 'admin'
            };
          } else {
            // Regular user login
            const user = await User.findOne({ email: credentials.email });

            if (!user) {
              throw new Error("No user found with this email.");
            }

            if (!user.emailVerified) {
              throw new Error("Please verify your email before logging in.");
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

            if (!isPasswordValid) {
              throw new Error("Invalid credentials.");
            }

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              userType: 'user'
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin', // Redirect to your custom sign-in page
  },
  // In-memory user management for demonstration purposes.
  // In a real app, you'd use a database adapter.
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              name: user.name,
              email: user.email,
              emailVerified: new Date(),
              image: user.image,
              provider: 'google',
            });
            await newUser.save();
          }
          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user?.email) {
        try {
          await connectDB();

          // Add user type and role from token
          session.user.userType = token.userType;
          session.user.role = token.role;

          if (token.userType === 'admin') {
            const admin = await Admin.findOne({ email: session.user.email });
            if (admin) {
              session.user.name = admin.username;
              session.user.role = admin.role;
            }
          } else {
            const user = await User.findOne({ email: session.user.email });
            if (user) {
              session.user.name = user.name;
            }
          }
        } catch (error) {
          console.error("Session callback error:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.userType = user.userType;
        token.role = user.role;
      }
      return token;
    },
  },
};