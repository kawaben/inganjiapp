'use client';
import React, { useState } from 'react';
import { CheckCircle,AlertCircle,TrendingUp,Hourglass } from 'lucide-react';

const ordersData = [
  {
    id: '121091',
    date: 'Aug 1, 2019',
    customer: 'Harriet Santiago',
    fulfillment: 'Unfulfilled',
    total: 604.5,
    profit: 182.5,
    status: 'Authorized',
    updated: 'Today',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '121090',
    date: 'Jul 21, 2019',
    customer: 'Sara Graham',
    fulfillment: 'Pending Receipt',
    total: 1175.5,
    profit: 524.25,
    status: 'Paid',
    updated: 'Today',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '121058',
    date: 'Jul 16, 2019',
    customer: 'Elmer McGee',
    fulfillment: 'Fulfilled',
    total: 175.5,
    profit: 78,
    status: 'Authorized',
    updated: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/men/13.jpg',
  },
 
];

const filters = ['All Orders', 'Fulfilled', 'Unpaid', 'Unfulfilled'];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('All Orders');

  const filteredOrders = ordersData.filter((order) => {
    if (activeFilter === 'All Orders') return true;
    if (activeFilter === 'Fulfilled') return order.fulfillment === 'Fulfilled';
    if (activeFilter === 'Unpaid') return order.status !== 'Paid';
    if (activeFilter === 'Unfulfilled') return order.fulfillment === 'Unfulfilled';
    return true;
  });

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {[ 
          { title: 'Active Orders', value: '1,046', color: 'text-blue-600', chart: <TrendingUp size={20} /> },
          { title: 'Unfulfilled', value: '159', color: 'text-yellow-500', chart: <AlertCircle size={20} /> },
          { title: 'Pending Receipt', value: '624', color: 'text-purple-500', chart: <Hourglass size={20} />},
          { title: 'Fulfilled', value: '263', color: 'text-green-500', chart: <CheckCircle size={20} />},
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</h2>
              <span className={`text-2xl ${stat.color}`}>{stat.chart}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-4 border-b pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`text-sm font-medium px-3 py-1 border-b-2 transition ${
              activeFilter === filter
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3"><input type="checkbox" /></th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Fulfillment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Profit</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="px-6 py-4"><input type="checkbox" /></td>
                <td className="px-4 py-3 text-blue-600 font-medium">{order.id}</td>
                <td className="px-4 py-3">{order.date}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <img src={order.avatar} alt="" className="w-6 h-6 rounded-full" />
                  {order.customer}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-2 rounded-l text-xs font-medium ${
                      order.fulfillment === 'Fulfilled'
                        ? 'bg-green-400 text-white-700'
                        : order.fulfillment === 'Pending Receipt'
                        ? 'bg-purple-500 text-white-100'
                        : 'bg-yellow-500 text-white-700'
                    }`}
                  >
                    {order.fulfillment}
                  </span>
                </td>
                <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                <td className="px-4 py-3">${order.profit.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-2 rounded-l text-xs font-medium ${
                      order.status === 'Paid'
                        ? 'bg-green-500 text-white-100'
                        : 'bg-orange-500 text-white-100'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">{order.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
