import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import connectDB from "../../../lib/mongodb";
import UserActivity from "../../../models/UserActivity";
import Book from "../../../models/Book";
import User from "../../../models/User";

export async function POST(request: Request) {
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

    // Sample books data
    const sampleBooks = [
      {
        title: "Concepts of Physics Vol. 1",
        author: "H.C. Verma",
        subject: "Physics",
        category: "Engineering",
        tags: ["JEE", "NEET", "Physics", "Mechanics"],
        description: "Comprehensive physics textbook for competitive exams",
        imageUrl: "/book-covers/hc-verma-vol1.jpg",
        uploadedBy: user._id,
        downloadCount: 1250,
        rating: { average: 4.8, count: 156 },
        isPublic: true,
        isApproved: true,
      },
      {
        title: "Objective Chemistry",
        author: "Dr. R.K. Gupta",
        subject: "Chemistry",
        category: "Engineering",
        tags: ["JEE", "Chemistry", "Organic", "Inorganic"],
        description: "Complete chemistry guide with solved examples",
        imageUrl: "/book-covers/rk-gupta-chemistry.jpg",
        uploadedBy: user._id,
        downloadCount: 980,
        rating: { average: 4.6, count: 89 },
        isPublic: true,
        isApproved: true,
      },
      {
        title: "Indian Polity",
        author: "M. Laxmikanth",
        subject: "Political Science",
        category: "UPSC",
        tags: ["UPSC", "Polity", "Government", "Constitution"],
        description: "Comprehensive guide to Indian political system",
        imageUrl: "/book-covers/laxmikanth-polity.jpg",
        uploadedBy: user._id,
        downloadCount: 2100,
        rating: { average: 4.9, count: 234 },
        isPublic: true,
        isApproved: true,
      },
      {
        title: "Mathematics for Class 12",
        author: "R.D. Sharma",
        subject: "Mathematics",
        category: "School",
        tags: ["CBSE", "Class 12", "Mathematics", "Calculus"],
        description: "Complete mathematics textbook for Class 12",
        imageUrl: "/book-covers/rd-sharma-12.jpg",
        uploadedBy: user._id,
        downloadCount: 750,
        rating: { average: 4.5, count: 67 },
        isPublic: true,
        isApproved: true,
      },
      {
        title: "Fundamentals of Computer Science",
        author: "E. Balagurusamy",
        subject: "Computer Science",
        category: "Engineering",
        tags: ["Programming", "C++", "Algorithms", "Data Structures"],
        description: "Introduction to computer science concepts",
        imageUrl: "/book-covers/balagurusamy-cs.jpg",
        uploadedBy: user._id,
        downloadCount: 890,
        rating: { average: 4.4, count: 45 },
        isPublic: true,
        isApproved: true,
      },
    ];

    // Sample user activities
    const sampleActivities = [
      {
        userId: user._id,
        type: "download",
        resourceType: "paper",
        title: "JEE Main 2023 Mathematics Paper",
        subject: "Mathematics",
        category: "Engineering",
        tags: ["JEE", "Mathematics", "2023"],
        fileUrl: "/papers/jee-main-2023-math.pdf",
        metadata: { fileSize: 2048000, downloadCount: 45, rating: 5 },
      },
      {
        userId: user._id,
        type: "download",
        resourceType: "paper",
        title: "NEET 2023 Biology Question Paper",
        subject: "Biology",
        category: "Medical",
        tags: ["NEET", "Biology", "2023"],
        fileUrl: "/papers/neet-2023-biology.pdf",
        metadata: { fileSize: 1524000, downloadCount: 67, rating: 4 },
      },
      {
        userId: user._id,
        type: "upload",
        resourceType: "paper",
        title: "GATE 2022 Computer Science Solutions",
        subject: "Computer Science",
        category: "Engineering",
        tags: ["GATE", "Computer Science", "Solutions"],
        fileUrl: "/papers/gate-2022-cs-solutions.pdf",
        metadata: { fileSize: 3072000, downloadCount: 123 },
      },
      {
        userId: user._id,
        type: "search",
        resourceType: "paper",
        title: "Physics mechanics problems",
        subject: "Physics",
        category: "Engineering",
        tags: ["Physics", "Mechanics"],
        searchQuery: "physics mechanics problems JEE",
      },
      {
        userId: user._id,
        type: "view",
        resourceType: "book",
        title: "Concepts of Physics Vol. 1",
        subject: "Physics",
        category: "Engineering",
        tags: ["Physics", "H.C. Verma"],
      },
    ];

    // Insert sample books
    await Book.insertMany(sampleBooks);
    
    // Insert sample activities
    await UserActivity.insertMany(sampleActivities);

    return NextResponse.json({ 
      message: "Sample data created successfully",
      booksCreated: sampleBooks.length,
      activitiesCreated: sampleActivities.length,
    });

  } catch (error) {
    console.error("SEED_DATA_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}