'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserByEmail } from '../lib/db'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

 

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Login failed')
      return
    }

    // Save JWT token
    localStorage.setItem('token', data.token)

    // Save logged-in user's email for future lookups
    localStorage.setItem('loggedInUserEmail', email)

    // (Optional) Preload full user info from IndexedDB
    const dbUser = await getUserByEmail(email)
    if (!dbUser) {
      console.warn('User not found in IndexedDB. Consider redirecting to setup/profile page.')
    }

    // Redirect
    router.push('/users')
  } catch (err) {
    console.error(err)
    setError('Something went wrong. Please try again.')
  }
}


  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded hover:bg-gray-800"
        >
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  )
}
