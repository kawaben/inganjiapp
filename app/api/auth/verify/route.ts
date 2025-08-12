// app/api/auth/verify/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  console.log('[API][Auth] Verification request received');
  
  try {
    // 1. Get all cookies (properly typed)
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log('[API][Auth] Available cookies:', allCookies.map(c => c.name));
    
    // 2. Get auth token
   const token = cookieStore.get('token')?.value;
    console.log('[API][Auth] Token found:', !!token);

    if (!token) {
      console.warn('[API][Auth] No token found in cookies');
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // 3. Verify token
    console.log('[API][Auth] Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };
    console.log('[API][Auth] Token decoded successfully:', { userId: decoded.userId });

    // 4. Return success
    console.log('[API][Auth] Verification successful');
    return NextResponse.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email
      }
    });

  } catch (error) {
    console.error('[API][Auth] Verification error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      console.warn('[API][Auth] JWT error:', error.message);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    console.error('[API][Auth] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}