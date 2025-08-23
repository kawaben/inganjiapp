import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 1. Get auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      )
    }

    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number
      email: string
    }

    // 3. Get minimal user data from database
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
      select: {
        user_id: true,
        email: true,
        firstname: true,
        lastname: true,
        username: true,
        image: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      )
    }

    // 4. Return auth status with basic user info
    return NextResponse.json({
      isAuthenticated: true,
      user
    })

  } catch (error) {
    console.error('Auth check error:', error)
    
    // Handle JWT errors (expired, invalid, etc.)
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      )
    }

    // For other errors, return unauthenticated status
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 200 }
    )
  } finally {
    await prisma.$disconnect()
  }
}