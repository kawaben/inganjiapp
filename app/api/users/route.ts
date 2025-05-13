import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma"; // Adjust the path if needed

export async function GET() {
  try {
    const users = await prisma.users.findMany({
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
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
