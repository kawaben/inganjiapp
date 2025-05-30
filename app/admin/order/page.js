"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react"; 
import { MoreHorizontal,Download,Share2,Truck,CheckCircle,ShoppingBag,Package } from 'lucide-react';

export default function OrderPopupCard() {
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
                        <h2 className="text-xl font-bold">Order #09746</h2>
                        <p className="text-sm mb-4">July 27, 2022 at 09:44 AM</p>
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
                  <tr className="border-b border-gray-100">
                    <td className="py-2">
                      <strong>Venus Dashboard Builder PRO</strong><br />
                      <span className="text-gray-500 text-xs">SKU: 94321870</span>
                    </td>
                    <td>1</td>
                    <td>$150.00</td>
                    <td>$150.00</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">
                      <strong>Horizon UI – Dashboard PRO</strong><br />
                      <span className="text-gray-500 text-xs">SKU: 04756323</span>
                    </td>
                    <td>3</td>
                    <td>$99.00</td>
                    <td>$297.00</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">
                      <strong>Parts for Service</strong><br />
                      <span className="text-gray-500 text-xs">SKU: 39403827</span>
                    </td>
                    <td>1</td>
                    <td>$89.00</td>
                    <td>$89.00</td>
                  </tr>
                </tbody>
              </table>
                <div className="mb-4 flex flex-row">
                  
                    
                    {/* Note */}
                    <div className="mr-4">
                        <h2 className="font-bold">Note:</h2>
                        <p className="text-xs text-gray-500">
                            Ship all the ordered items together by Friday and I send you an email, please check. Thanks!
                        </p>
                    </div>
                    
                      {/* Totals */}
                    <div className="flex-1  space-y-1 mb-4 ">
                        <p><span className="font-medium">Total:</span> $395.00</p>
                        <p><span className="font-medium">Shipping:</span> $10.00</p>
                        <p className="text-lg font-bold">Order Total: $405.00</p>
                    </div>
                </div>
                <div className="bg-gray-50 flex flex-row rounded-md shadow-inner">
                    <div className="flex-1 flex flex-row text-gray-400 text-s p-4">
                        <div className="mr-7">
                            <p>Customer Details:</p>
                            <p className="font-bold text-orange-400">ANTONY Peterson</p>
                            <p>37 Avenue,Eggtown</p>
                            <p>Indiana,United State</p>
                        </div>
                        <div>
                            <p>+25089858599494</p>
                            <p className="text-orange-400">kabagema@nuovire.com</p>
                            <p>By Credit Card</p>
                            <p>July,27 2022 At 09:44</p>
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
                  { label: "Order Placed", date: "27 Jul 2022", done: true , icon: <CheckCircle size={20} />},
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
