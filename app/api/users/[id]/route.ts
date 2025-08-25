import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

// Validation schema
const updateUserSchema = z.object({
  firstname: z.string().min(1, "First name is required").optional(),
  lastname: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Invalid phone number").optional().or(z.literal('')),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  image: z.string().optional(),
  gender: z.enum(['male', 'female', 'prefer_not_to_say']).optional().or(z.literal('').transform(() => undefined)),
});

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
    
    // Validate input
    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Only include fields that are actually provided
    const updateData: any = {};
    if (validatedData.firstname !== undefined) updateData.firstname = validatedData.firstname;
    if (validatedData.lastname !== undefined) updateData.lastname = validatedData.lastname;
    if (validatedData.username !== undefined) updateData.username = validatedData.username;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
    if (validatedData.location !== undefined) updateData.location = validatedData.location;
    if (validatedData.country !== undefined) updateData.country = validatedData.country;
    if (validatedData.image !== undefined) updateData.image = validatedData.image;
    if (validatedData.gender !== undefined) updateData.gender = validatedData.gender;

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: updateData, // Use the filtered data
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


    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update user error details:", {
    error,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    code: error instanceof PrismaClientKnownRequestError ? error.code : 'N/A',
    meta: error instanceof PrismaClientKnownRequestError ? error.meta : undefined
  });
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      if (error.code === "P2002") {
        const target = error.meta?.target as string[];
        if (target?.includes('username')) {
          return NextResponse.json(
            { error: "Username already taken" },
            { status: 409 }
          );
        }
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

//PATCH support
export { PUT as PATCH };