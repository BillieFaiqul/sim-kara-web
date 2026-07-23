'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulasi login (nanti ganti dengan API)
      if (email && password) {
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify({
          email,
          name: 'Admin Prodi',
          role: 'admin',
        }))
        localStorage.setItem('token', 'fake-token-12345')

        // Redirect ke dashboard
        router.push('/dashboard')
      } else {
        setError('Email dan password harus diisi')
      }
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo_landscape.png"
              alt="SIM-KARA"
              width={150}
              height={50}
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            SIM-KARA
          </h1>
          <p className="text-gray-600 text-sm">Sistem Informasi Manajemen Karya Akademik</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@unesa.ac.id"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Ingat saya
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        {/* Demo Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-3">
            Demo Account
          </p>
          <div className="bg-gray-50 p-3 rounded text-xs text-gray-700 space-y-1">
            <p><strong>Email:</strong> admin@unesa.ac.id</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
