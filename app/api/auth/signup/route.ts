import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import * as bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

interface RequestBody {
  email: string
  password: string
  firstname: string
  lastname: string
  username: string
  phone?: string
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()

    if (!body.email || !body.password || !body.firstname || !body.lastname || !body.username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "This Email Is Used" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        firstname: body.firstname,
        lastname: body.lastname,
        username: body.username,
        phone: body.phone || null,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        username: true,
      },
    })

    // 🔐 Generate JWT Token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    return NextResponse.json(
      {
        user: newUser,
        token,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
