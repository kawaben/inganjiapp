import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type Params = {
  params: {
    user_id: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  try {
    const user_id = parseInt(params.user_id); // Changed from 'id' to 'user_id'
    if (isNaN(user_id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { user_id }, // Now matches the variable name
      select: {
        user_id: true,
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const user_id = parseInt(params.user_id); // Changed from 'id' to 'user_id'
    if (isNaN(user_id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    
    if (!body.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { user_id }, // Now matches the variable name
      data: {
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        username: body.username,
        phone: body.phone,
        bio: body.bio,
        location: body.location,
        country: body.country,
        image: body.image,
      },
      select: {
        user_id: true,
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

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Database error" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}