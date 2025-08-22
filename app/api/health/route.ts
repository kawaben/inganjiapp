// app/api/health/route.ts
import { prisma } from '../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'OK' })
  } catch (error) {
    return NextResponse.json(
      { status: 'ERROR', error: error.message },
      { status: 500 }
    )
  }
}