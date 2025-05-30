import { NextRequest } from 'next/server';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export async function GET(req: NextRequest) {
  const doc = new PDFDocument({ margin: 50 });
  const stream = new Readable({ read() {} });

  const order = {
    id: 'ORD123456',
    customer: 'John Doe',
    email: 'john@example.com',
    items: [
      { name: 'Black Hoodie', quantity: 2, price: 40 },
      { name: 'White Cap', quantity: 1, price: 15 },
    ],
    total: 95,
    status: 'Delivered',
    createdAt: new Date().toLocaleString(),
  };

  doc.pipe(stream);

  // --- HEADER ---
  doc
    .fontSize(24)
    .fillColor('#0f172a') // dark slate
    .text('Nuovire', { align: 'center' })
    .moveDown();

  // --- ORDER INFO ---
  doc
    .fontSize(12)
    .fillColor('black')
    .text(`Order ID: ${order.id}`, { continued: true })
    .text(`   |   Date: ${order.createdAt}`);

  doc
    .text(`Customer: ${order.customer}`)
    .text(`Email: ${order.email}`)
    .text(`Status: ${order.status}`)
    .moveDown();

  // --- HORIZONTAL LINE ---
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor('#94a3b8') // slate-400
    .stroke()
    .moveDown();

  // --- ITEMS TITLE ---
  doc
    .fontSize(14)
    .fillColor('#0f172a')
    .text('Items', { underline: true })
    .moveDown(0.5);

  // --- ITEM TABLE HEADERS ---
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Qty', 50)
    .text('Product', 100)
    .text('Price ($)', 450, undefined, { align: 'right' });

  doc.moveDown(0.3);

  // --- ITEM LIST ---
  doc.font('Helvetica');
  order.items.forEach((item) => {
    doc
      .text(`${item.quantity}`, 50)
      .text(item.name, 100)
      .text(`$${item.price}`, 450, undefined, { align: 'right' });
  });

  // --- TOTAL ---
  doc
    .moveDown(1)
    .font('Helvetica-Bold')
    .fontSize(13)
    .text(`Total: $${order.total}`, 400, undefined, { align: 'right' });

  // --- FOOTER LINE ---
  doc
    .moveDown(2)
    .fontSize(10)
    .fillColor('#64748b')
    .text('Thank you for shopping with us!', { align: 'center' });

  doc.end();

  const chunks: Buffer[] = [];
  for await (const chunk of doc) {
    chunks.push(chunk as Buffer);
  }
  const pdfBuffer = Buffer.concat(chunks);

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="order-summary.pdf"',
    },
  });
}
