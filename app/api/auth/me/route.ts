import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import * as jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const userId = typeof decoded.userId === 'string' 
  ? parseInt(decoded.userId, 10) 
  : decoded.userId;
    
    // Validate the conversion
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId }, 
      select: {
        user_id: true,
        email: true,
        firstname: true,
        lastname: true,
        username: true,
        phone: true,
        location: true,
        country: true,
        bio: true,
        image: true,
        gender: true,
        account_status: true,
        createdAt: true,
        email_verified: true,
        display_name: true,
        theme_preference: true,
              }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}