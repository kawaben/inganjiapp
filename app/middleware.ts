// app/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized (missing or malformed token)' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export const config = {
  matcher: ['/api/orders'], // Protect the /api/orders route
}
