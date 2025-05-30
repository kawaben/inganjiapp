"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react"; 
import Image from 'next/image';
import { MoreHorizontal,Download,Share2,Truck,CheckCircle,ShoppingBag,Package } from 'lucide-react';

export default function OrderPopupCard({ order }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

 const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/download-order');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'order-summary.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };




  return (
    <div className="p-6">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
      >
        <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-5000 pt-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl p-6 relative flex flex-col md:flex-row gap-6 overflow-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl"
            >
              &times;
            </button>

            {/* Left Column: Order Details */}
            <div className="flex-1">
                <div className="flex flex-row bg-yellow-600 rounded-md shadow-inner p-4 mb-6">
                    <div className="flex-1 text-white">
                        <h2 className="text-xl font-bold">Order #{order.id}</h2>
                        <p className="text-sm mb-4">{new Date(order.date).toLocaleString()}</p>
                    </div>
                    {/* Icons */}
                    <div className="flex flex-row items-center justify-center gap-3 ">

                        <button onClick={handleDownload} disabled={isDownloading}>
                            <Download className="w-5 h-5 cursor-pointer text-white"/>
                             
                        </button>
                        <p><Share2 className="w-5 h-5 cursor-pointer text-blue-400"/></p>
                    </div>
                </div>
              {/* Order Table */}
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="text-left border-b border-gray-300">
                    <th className="py-2">Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                    {order.items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 flex flex-row gap-2 items-center">
                        <Image
                            src={item.image || '/logo.svg'}
                            width={80}
                            height={80}
                            alt={item.name}
                            className="rounded"
                        />
                      <strong>{item.name}</strong><br />
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toLocaleString('en-US')}</td>
                    <td>${(item.quantity * item.price).toLocaleString('en-US')}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
                <div className="mb-4 flex flex-col-reverse md:flex-row">
                  
                    
                    {/* Note */}
                    <div className="flex-3 mr-4">
                        <h2 className="font-bold">Note:</h2>
                        <p className="text-xs text-gray-500">
                           {order.note}
                        </p>
                    </div>
                    
                      {/* Totals */}
                    <div className="flex-1  space-y-1 mb-4 ">
                        <p><span className="font-medium">Total:</span> ${(order.total - 20).toLocaleString('en-US')}</p>
                        <p><span className="font-medium">Shipping:</span> $20.00</p>
                        <p className="text-lg font-bold">Order Total: ${order.total.toLocaleString('en-US')}</p>
                    </div>
                </div>
                <div className="bg-gray-50 flex flex-row rounded-md shadow-inner">
                    <div className="flex-1 flex flex-col md:flex-row text-gray-400 text-s p-4">
                        <div className="mr-7">
                            <p>Customer Details:</p>
                            <p className="font-bold text-orange-400">{order.name}</p>
                            <p>{order.shipingAddress}</p>
                            <p>{order.country}</p>
                        </div>
                        <div>
                            <p>{order.phone}</p>
                            <p className="text-orange-400">{order.userEmail}</p>
                            <p>By {order.payment}</p>
                            <p>{new Date(order.date).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="m-2 text-center">
                        <QRCodeSVG value="https://example.com/order/09746" size={70} />
                        <p className="text-xs text-gray-500 mt-1">Scan to track</p>
                    </div>

                </div>
            </div>

            {/* Right Column: Status */}
            <div className="w-full md:w-64 bg-gray-50 p-4 rounded-md shadow-inner">
              <h3 className="font-semibold text-gray-700 mb-4">Order Status</h3>
              <div className="space-y-4 text-sm">
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
                        step.done ? "text-orange-400" : "text-gray-300"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <p>{step.label}</p>
                      {step.date && <p className="text-gray-400 text-xs">{step.date}</p>}
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
