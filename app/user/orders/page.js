'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAllOrders } from '../../lib/db'; 
import { useUser } from '../../context/UserContext';

export default function Orders() {
 const [orders, setOrders] = useState([]);
  const { user } = useUser(); 

  useEffect(() => {
    const fetchOrders = async () => {
      const allOrders = await getAllOrders();
      const userOrders = allOrders?.filter(order => order.userEmail === user?.email);
      setOrders(userOrders || []);
    };

    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);



  return (
    <div className="max-w-3xl mx-auto p-5 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-[var(--primary)]">My Orders</h1>

      {/* Header */}
      <div className="bg-[var(--background)] shadow p-4 rounded mb-6">
        <p className="text-[var(--secondary)]">
          Your order is being handled with care. We'll keep you updated every step of the way!
        </p>
      </div>

      {/* Shipping Addresses */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--background)] text-[var(--secondary)] p-4 shadow rounded">
          <h2 className="font-semibold text-[var(--text)] mb-2">Shipping Address (Seller)</h2>
          <p>Kigali</p>
          <p>kk 143 Market Street, Kigali, PA 19017</p>
          <p>Rwanda</p>
        </div>
        <div className="bg-[var(--background)] text-[var(--secondary)] p-4 shadow rounded">
          <h2 className="font-semibold text-[var(--text)] mb-2">Shipping Address (Buyer)</h2>
          <p>Rucas Royal</p>
          <p>4567 Elm Street, Apt 3B, Philadelphia, PA 19104, USA</p>
          <p>Near University City</p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
     orders.map((order) => (
    <div key={order.id} className="bg-[var(--background)] p-4 shadow rounded space-y-4">
      <h2 className="text-lg font-semibold text-[var(--text)]">Order ID: {order.id}</h2>
      <p className="text-sm text-[var(--secondary)]">
        Date: {new Date(order.date).toLocaleString()}
      </p>
      <p className="text-sm text-[var(--secondary)]">Status: {order.status}</p>

      {/* Order Progress */}
      <div className="flex gap-4 bg-[var(--background)] shadow p-4 rounded mb-6 overflow-x-auto">
        {['Order made', 'Order Paid', 'Shipped', 'Completed'].map((step, index) => (
          <div
            key={index}
            className={`px-4 py-2 border rounded ${
              index === 2 ? 'bg-[var(--primary)] text-[var(--foreground)]' : 'bg-[var(--secondary)] text-[var(--foreground)]'
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
              <p className="text-sm text-[var(--secondary)] flex items-center">
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
        <h3 className="font-semibold mb-2 text-[var(--text)]">Order Summary</h3>
        <ul className="text-[var(--secondary)] space-y-1 text-sm">
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
  <p className="text-[var(--secondary)] text-center">You have no orders yet.</p>
)}

    </div>
  );
}
