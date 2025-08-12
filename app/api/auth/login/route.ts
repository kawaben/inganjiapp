import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const { email, password } = await request.json();

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
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // Create response with user data
  const response = NextResponse.json({
  user: {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
  },
  token, 
});

  // Set HTTP-only cookie with the token
  response.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day in seconds
    path: "/",
  });

  return response;
}