import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstname: user.firstname
    }
  });
}