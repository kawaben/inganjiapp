

let wishlist = [];

export async function GET(request) {
  return Response.json(wishlist);
}

export async function POST(request) {
  const item = await request.json();
  if (!item?.id) {
    return new Response(JSON.stringify({ error: 'Invalid item data' }), { status: 400 });
  }

  const exists = wishlist.find((p) => p.id === item.id);
  if (!exists) {
    wishlist.push(item);
  }

  return Response.json({ message: 'Item added', wishlist });
}

export async function DELETE(request) {
  const { id } = await request.json();
  wishlist = wishlist.filter((item) => item.id !== id);
  return Response.json({ message: 'Item removed', wishlist });
}
