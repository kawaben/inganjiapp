// app/api/orders/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const dummyOrders = [
    { id: 1, item: 'Graphic Hoodie', total: 40.0 },
    { id: 2, item: 'Embroidered Tee', total: 25.5 },
    { id: 3, item: 'Cap', total: 15.0 },
  ]

  return NextResponse.json({ orders: dummyOrders })
}
