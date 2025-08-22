// app/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'



// Initialize rate limiter (10 requests per minute per IP)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

const JWT_SECRET = process.env.JWT_SECRET!

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set!');
  return new NextResponse(
    JSON.stringify({ error: 'Server configuration error' }),
    { status: 500 }
  );
}

  // 1. Skip middleware for auth/public routes
  if (
    path.startsWith('/api/auth') || 
    path.startsWith('/login') ||
    path.startsWith('/register')
  ) {
    return NextResponse.next()
  }

  // 2. Rate limiting (applies to all routes)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
           req.headers.get('x-real-ip') || 
           '127.0.0.1';
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // 3. JWT Authentication (for protected routes)
  if (path.startsWith('/api/protected') || path.startsWith('/api/orders')) {
    const authHeader = req.headers.get('authorization')

    // 3.1 Validate token format
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Missing or malformed token' 
        }),
        { status: 401 }
      )
    }

    const token = req.cookies.get('token')?.value || 
             authHeader?.split(' ')[1];

    try {
      // 3.2 Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { 
        userId: string 
        role?: string
        exp: number
      }

      // 3.3 Check token expiration
      const now = Math.floor(Date.now() / 1000)
      if (decoded.exp <= now) {
        return new NextResponse(
          JSON.stringify({ error: 'Token expired' }),
          { status: 401 }
        )
      }

      // 3.4 Role-based access control (optional)
      if (path.startsWith('/api/admin') && decoded.role !== 'ADMIN') {
        return new NextResponse(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403 }
        )
      }

      // 3.5 Attach user context to request
      const headers = new Headers(req.headers)
      headers.set('x-user-id', decoded.userId)
      if (decoded.role) headers.set('x-user-role', decoded.role)

      return NextResponse.next({ request: { headers } })

    } catch (err) {
      console.error('JWT Error:', err)
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Invalid token',
          details: err instanceof Error ? err.message : null 
        }),
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*', // Apply to all API routes
    '/((?!_next/static|_next/image|favicon.ico).*)' // Exclude static files
  ]
}