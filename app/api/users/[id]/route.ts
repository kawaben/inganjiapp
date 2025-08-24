import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

//Params should have id as string (not user_id as number)
type Params = {
  params: {
    id: string; 
  };
};

export async function GET(request: Request, { params }: Params) {
  try {
    const user_id = parseInt(params.id, 10); 
    if (isNaN(user_id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { user_id }, 
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
        gender: true,
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
    const user_id = parseInt(params.id, 10); 
    if (isNaN(user_id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    
    

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { 
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