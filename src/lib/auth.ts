import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./mongodb";
import User from "../models/User";

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
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;

        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            // User not found
            throw new Error("No user found with this email.");
          }
          
          if (!user.emailVerified) {
            // User exists but email is not verified
            throw new Error("Please verify your email before logging in.");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            // Incorrect password
            throw new Error("Invalid credentials.");
          }
          
          // Return user object if everything is valid
          return { id: user._id.toString(), name: user.name, email: user.email };
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
          const user = await User.findOne({ email: session.user.email });
          if (user) {
            session.user.name = user.name;
          }
        } catch (error) {
          console.error("Session callback error:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
      }
      return token;
    },
  },
};