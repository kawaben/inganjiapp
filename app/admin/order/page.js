"use client";

import { useEffect, useState } from 'react';
import { QRCodeSVG } from "qrcode.react"; 
import Image from 'next/image';
import { MoreHorizontal,Download,Share2,Truck,CheckCircle,ShoppingBag,Package } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function OrderPopupCard({ order }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageData, setImageData] = useState(null)
  
  useEffect(() => {
    fetch('/logo.png')
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => setImageData(reader.result);
        reader.readAsDataURL(blob);
      });
  }, []);
  const getImageDataURL = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const handleDownload = async () => {
    const doc = new jsPDF();
  
    if (imageData) {
      doc.addImage(imageData, 'PNG', 20, 20, 50, 30);
    }
    let y = 70;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Order #${order.id}`, 115, 25, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 115, 33, { align: 'center' });

    

    

    // Customer Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Customer Information:", 20, y);
    doc.setFont('helvetica', 'normal');
    y += 6;
    doc.text(`Name: ${order.name}`, 20, y);
    y += 6;
    doc.text(`Address: ${order.shipingAddress}, ${order.country}`, 20, y);
    y += 6;
    doc.text(`Phone: ${order.phone}`, 20, y);
    y += 6;
    doc.text(`Email: ${order.userEmail}`, 20, y);

    // Items
    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.text("Items Ordered:", 20, y);
    y += 6;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    for (const item of order.items) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      // Load item image
      const imageBase64 = await getImageDataURL(item.image);

      // Add image
      doc.addImage(imageBase64, 'JPEG', 20, y, 20, 20); // X, Y, width, height

      // Add item text
      doc.text(`${item.name}`, 45, y + 5);
      doc.text(`Qty: ${item.quantity}`, 45, y + 10);
      doc.text(`Price: $${item.price.toLocaleString()}`, 45, y + 15);
      doc.text(`Total: $${(item.quantity * item.price).toLocaleString()}`, 45, y + 20);

      y += 30; // Leave space between items
    }

    // Total Summary
    doc.setFont('helvetica', 'bold');
    doc.text(`Subtotal: $${(order.total - 20).toLocaleString()}`, 20, y);
    y += 6;
    doc.text(`Shipping: $20.00`, 20, y);
    y += 6;
    doc.text(`Total: $${order.total.toLocaleString()}`, 20, y);
    y += 6;
    doc.text(`Paid By: ${order.payment}`, 20, y);

    // Optional Note
    if (order.note) {
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.text("Note:", 20, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(order.note, 20, y);
    }

    doc.save(`order-${order.id}.pdf`);
  };





  return (
    <div className="p-6">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
      >
        <MoreHorizontal className="w-5 h-5 text-[var(--secondary)] cursor-pointer" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-5000 pt-4">
          <div className="bg-[var(--background2)] rounded-xl shadow-xl w-full max-w-5xl p-6 relative flex flex-col md:flex-row gap-6 overflow-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl"
            >
              &times;
            </button>

            {/* Left Column: Order Details */}
            <div className="flex-1">
                <div className="flex flex-row bg-[var(--primary)] rounded-md shadow-inner p-4 mb-6">
                    <div className="flex-1 text-[var(--text)]">
                        <h2 className="text-xl font-bold">Order #{order.id}</h2>
                        <p className="text-sm mb-4">{new Date(order.date).toLocaleString()}</p>
                    </div>
                    {/* Icons */}
                    <div className="flex flex-row items-center justify-center gap-3 ">

                        <button onClick={handleDownload}>
                            <Download className="w-5 h-5 cursor-pointer text-[var(--text)] hover:text-[var(--background)]"/>
                             
                        </button>
                        <p><Share2 className="w-5 h-5 cursor-pointer text-[var(--link)]"/></p>
                    </div>
                </div>
              {/* Order Table */}
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="text-left border-b border-[var(--border)]">
                    <th className="py-2 text-[var(--text)]">Item</th>
                    <th className='text-[var(--secondary)]'>Qty</th>
                    <th className='text-[var(--secondary)]'>Rate</th>
                    <th className='text-[var(--secondary)]'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                    {order.items?.map((item, index) => (
                  <tr key={index} className="border-b border-[var(--border)]">
                    <td className="py-2 flex flex-row gap-2 items-center">
                        <Image
                            src={item.image || '/logo.svg'}
                            width={80}
                            height={80}
                            alt={item.name}
                            className="rounded"
                        />
                      <strong className='text-[var(--secondary)]'>{item.name}</strong><br />
                    </td>
                    <td className='text-[var(--secondary)]'>{item.quantity}</td>
                    <td className='text-[var(--secondary)]'>${item.price.toLocaleString('en-US')}</td>
                    <td className='text-[var(--secondary)]'>${(item.quantity * item.price).toLocaleString('en-US')}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
                <div className="mb-4 flex flex-col-reverse md:flex-row">
                  
                    
                    {/* Note */}
                    <div className="flex-3 mr-4 ">
                        <h2 className="font-bold text-[var(--text)]">Note:</h2>
                        <p className="text-xs text-[var(--secondary)]">
                           {order.note}
                        </p>
                    </div>
                    
                      {/* Totals */}
                    <div className="flex-1  space-y-1 mb-4 text-[var(--text)] ">
                        <p><span className="font-medium text-[var(--secondary)]">Total:</span> ${(order.total - 20).toLocaleString('en-US')}</p>
                        <p><span className="font-medium text-[var(--secondary)]">Shipping:</span> $20.00</p>
                        <p><span className="text-lg font-bold text-[var(--secondary)]">Order Total:</span> ${order.total.toLocaleString('en-US')}</p>
                    </div>
                </div>
                <div className="bg-[var(--background)] flex flex-row rounded-md shadow-inner">
                    <div className="flex-1 flex flex-col md:flex-row text-[var(--secondary)] text-s p-4">
                        <div className="mr-7">
                            <p>Customer Details:</p>
                            <p className="font-bold text-[var(--primary)]">{order.name}</p>
                            <p>{order.shipingAddress}</p>
                            <p>{order.country}</p>
                        </div>
                        <div>
                            <p>{order.phone}</p>
                            <p className="text-[var(--primary)]">{order.userEmail}</p>
                            <p>By {order.payment}</p>
                            <p>{new Date(order.date).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="m-2 text-center">
                        <QRCodeSVG value="https://example.com/order/09746" size={70} />
                        <p className="text-xs text-[var(--secondary)] mt-1">Scan to track</p>
                    </div>

                </div>
            </div>

            {/* Right Column: Status */}
            <div className="w-full md:w-64 bg-[var(--background)] p-4 rounded-md shadow-inner">
              <h3 className="font-semibold text-[var(--text)] mb-4">Order Status</h3>
              <div className="space-y-4 text-sm text-[var(--text)]">
                {[
                  { label: "Order Placed", date: `${new Date(order.date).toLocaleString()}`, done: true , icon: <CheckCircle size={20} />},
                  { label: "Products Picked", date: "27 Jul 2022", done: true,icon: <ShoppingBag size={20} /> },
                  { label: "Order Packed", date: "28 Jul 2022", done: true,icon: <Package size={20} /> },
                  { label: "Shipped", date: "28 Jul 2022", done: true,icon: <Truck size={20} /> },
                  { label: "Delivered", date: "", done: false,icon: <Truck size={20} /> },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5  flex items-center justify-center text-xs ${
                        step.done ? "text-[var(--primary)]" : "text-[var(--secondary)]"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <p>{step.label}</p>
                      {step.date && <p className="text-[var(--secondary)] text-xs">{step.date}</p>}
                    </div>
                  </div>
                ))}
              </div>

              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
