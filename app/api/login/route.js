// app/api/login/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Make sure this file exports a working Prisma client
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Return basic user data
    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
