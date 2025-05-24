'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAllOrders } from '../../lib/db'; 

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedOrders = await getAllOrders();
      setOrders(storedOrders || []);
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {/* Header */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <p className="text-gray-500">
          Your order is being handled with care. We'll keep you updated every step of the way!
        </p>
      </div>

      {/* Shipping Addresses */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Shipping Address (Seller)</h2>
          <p>Kigali</p>
          <p>kk 143 Market Street, Kigali, PA 19017</p>
          <p>Rwanda</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Shipping Address (Buyer)</h2>
          <p>Rucas Royal</p>
          <p>4567 Elm Street, Apt 3B, Philadelphia, PA 19104, USA</p>
          <p>Near University City</p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
  orders.map((order) => (
    <div key={order.id} className="bg-white p-4 shadow rounded space-y-4">
      <h2 className="text-lg font-semibold">Order ID: {order.id}</h2>
      <p className="text-sm text-gray-500">
        Date: {new Date(order.date).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">Status: {order.status}</p>

      {/* Order Progress */}
      <div className="flex gap-4 bg-white shadow p-4 rounded mb-6 overflow-x-auto">
        {['Order made', 'Order Paid', 'Shipped', 'Completed'].map((step, index) => (
          <div
            key={index}
            className={`px-4 py-2 border rounded ${
              index === 2 ? 'bg-orange-500 text-white' : 'bg-gray-100'
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-6 gap-4 p-2">
        {order.items?.map((item, index) => (
          <div key={index} className="grid grid-rows-2 gap-2">
            <Image
              src={item.image || '/images/default.jpg'}
              width={80}
              height={80}
              alt={item.name}
              className="rounded"
            />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500 flex items-center">
                <span
                  style={{
                    backgroundColor: item.color || '#ccc',
                    width: 15,
                    height: 15,
                    display: 'inline-block',
                    borderRadius: '50%',
                    marginRight: 5,
                    border: '1px solid #999',
                  }}
                ></span>
                <span className="mr-2">Size: {item.size || 'N/A'}</span>
              </p>
              <p>
                {item.quantity} × ${item.price.toLocaleString('en-US')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-4 border-t pt-4">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li className="flex justify-between">
            <span>Product Price ({order.items.length} items)</span>
            <span>${(order.total - 20).toLocaleString('en-US')}</span>
          </li>
          <li className="flex justify-between">
            <span>Shipping Cost</span>
            <span>$20.00</span>
          </li>
          <hr className="my-2" />
          <li className="flex justify-between font-bold">
            <span>Total Sales</span>
            <span>${order.total.toLocaleString('en-US')}</span>
          </li>
        </ul>
      </div>
    </div>
  ))
) : (
  <p className="text-gray-500 text-center">You have no orders yet.</p>
)}

    </div>
  );
}
