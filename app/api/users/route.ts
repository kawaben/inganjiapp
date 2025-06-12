import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma"; 
import { PrismaClientKnownRequestError } from "../../generated/prisma/runtime/library";

export async function GET() {
  
  try {
    const users = await prisma.user.findMany({  
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        phone: true,
        bio: true,
        location: true,
        country: true,
        image: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
  console.error("Fetch users error:", error);
  if (error instanceof PrismaClientKnownRequestError) {
    return NextResponse.json({ error: "Database error" }, { status: 400 });
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
}