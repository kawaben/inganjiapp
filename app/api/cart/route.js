
let userCarts = {};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('userEmail');

  if (!userEmail) {
    return new Response(JSON.stringify({ error: 'Missing userEmail' }), { status: 400 });
  }

  const cart = userCarts[userEmail] || [];
  return Response.json(cart);
}

export async function POST(req) {
  const item = await req.json();
  const { id, color, size, userEmail } = item;

  if (!id || !color || !size || !userEmail) {
    return new Response(JSON.stringify({ error: 'Invalid cart item or missing userEmail' }), {
      status: 400,
    });
  }

  if (!userCarts[userEmail]) {
    userCarts[userEmail] = [];
  }

  const cart = userCarts[userEmail];
  const existing = cart.find(
    (i) => i.id === id && i.color === color && i.size === size
  );

  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }

  return Response.json({ success: true, cart });
}

export async function DELETE(req) {
  const { id, color, size, userEmail } = await req.json();

  if (!id || !color || !size || !userEmail) {
    return new Response(JSON.stringify({ error: 'Missing identifiers or userEmail' }), {
      status: 400,
    });
  }

  if (!userCarts[userEmail]) {
    userCarts[userEmail] = [];
  }

  userCarts[userEmail] = userCarts[userEmail].filter(
    (item) => !(item.id === id && item.color === color && item.size === size)
  );

  return Response.json({ success: true, cart: userCarts[userEmail] });
}
