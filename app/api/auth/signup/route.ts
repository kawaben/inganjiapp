import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma" // Use absolute import
import * as bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    console.log("Signup request received") // Debug log
    
    const body = await request.json()
    console.log("Request body:", body) // Debug log
    console.log('DB URL:', process.env.DATABASE_URL);

    // Validate only essential fields
    if (!body.email || !body.password) {
      console.log("Missing email or password")
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Verify JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing")
      throw new Error("Server configuration error")
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })
    
    if (existingUser) {
      console.log("Email already in use:", body.email)
      return NextResponse.json(
        { error: "Email already registered" }, 
        { status: 409 }
      )
    }

    // Create user with default values
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
        firstname: body.firstname || "User",
        lastname: body.lastname || "Account",
        username: body.username || `user${Math.floor(Math.random() * 9000) + 1000}`,
      },
      select: {
        user_id: true,
        email: true,
        firstname: true,
      }
    })

    console.log("User created successfully:", newUser.user_id)

    // Generate token
    const token = jwt.sign(
      { userId: newUser.user_id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Create response
    const response = NextResponse.json(
      { user: newUser, token },
      { status: 201 }
    )

    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response

  } catch (error) {
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}
}