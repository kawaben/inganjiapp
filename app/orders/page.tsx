'use client'

import { useEffect, useState } from 'react'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No token found. Please login.')
        return
      }

      try {
        const res = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Unauthorized')
          return
        }

        setOrders(data.orders)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to fetch orders.')
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="p-30">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {orders.map(order => (
            <li key={order.id} className="border p-4 rounded">
              {order.item} - ${order.total}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
