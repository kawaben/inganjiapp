import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // Validate request body
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Validate credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Create response with user data
    const response = NextResponse.json({
      user: {
        user_id: user.user_id,
        email: user.email,
        image: user.image,
        username:  user.username,
        firstname: user.firstname,
      },
      token, 
    });

    // Set HTTP-only cookie with the token
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}