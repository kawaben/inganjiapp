
let cart = [];

export async function GET() {
  return Response.json(cart);
}

export async function POST(req) {
  const item = await req.json();
  if (!item || !item.id || !item.color || !item.size) {
    return new Response(JSON.stringify({ error: 'Invalid cart item' }), { status: 400 });
  }

  const exists = cart.find(
    (i) => i.id === item.id && i.color === item.color && i.size === item.size
  );

  if (exists) {
    exists.quantity += item.quantity || 1;
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }

  return Response.json({ success: true, cart });
}

export async function DELETE(req) {
  const { id, color, size } = await req.json();

  if (!id || !color || !size) {
    return new Response(JSON.stringify({ error: 'Missing identifiers' }), { status: 400 });
  }

  cart = cart.filter(
    (item) => !(item.id === id && item.color === color && item.size === size)
  );

  return Response.json({ success: true, cart });
}
