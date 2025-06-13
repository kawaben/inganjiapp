// /app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from '../../lib/prisma'
import { verifyToken } from "../../lib/auth"

// GET CART ITEMS
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.split(" ")[1]
  const decoded = token && verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // @ts-ignore
  const userId = decoded.id

  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { product: true },
  })

  return NextResponse.json(cartItems)
}

// ADD TO CART
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.split(" ")[1]
  const decoded = token && verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { id: productId, color, size, quantity } = body

  if (!productId || !color || !size || !quantity) {
    return NextResponse.json({ error: "Missing item details" }, { status: 400 })
  }

  // @ts-ignore
  const userId = decoded.id

  // Check if item already in cart
  const existing = await prisma.cart.findFirst({
    where: { userId, productId, color, size },
  })

  if (existing) {
    // Update quantity
    const updated = await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    })

    return NextResponse.json(updated)
  }

  // Otherwise, add new item
  const newItem = await prisma.cart.create({
    data: {
      userId,
      productId,
      color,
      size,
      quantity,
    },
  })

  return NextResponse.json(newItem)
}

// DELETE FROM CART
export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.split(" ")[1]
  const decoded = token && verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { id: productId, color, size } = body

  if (!productId || !color || !size) {
    return NextResponse.json({ error: "Missing identifiers" }, { status: 400 })
  }

  // @ts-ignore
  const userId = decoded.id

  // Delete matching cart item
  await prisma.cart.deleteMany({
    where: { userId, productId, color, size },
  })

  return NextResponse.json({ success: true })
}
