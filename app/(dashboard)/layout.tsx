'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, LogOut, Home, FileText, CheckSquare, BarChart3, Settings, User, BookOpen, HelpCircle } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Karya Dosen', href: '/dashboard/karya-dosen' },
    { icon: BookOpen, label: 'Prestasi Mahasiswa', href: '/dashboard/prestasi' },
    { icon: CheckSquare, label: 'Validasi', href: '/dashboard/validasi' },
    { icon: BarChart3, label: 'Monitoring', href: '/dashboard/monitoring' },
    { icon: FileText, label: 'Laporan', href: '/dashboard/laporan' },
    { icon: Settings, label: 'Pengaturan', href: '/dashboard/pengaturan' },
    { icon: User, label: 'Profil', href: '/dashboard/profil' },
    { icon: HelpCircle, label: 'Panduan', href: '/dashboard/panduan' },
  ]

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-56' : 'w-20'
        } bg-blue-900 text-white transition-all duration-300 fixed h-full z-40`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-800 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded"
            />
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-sm">SIM-KARA</h2>
                <p className="text-xs text-blue-200">D4 Teknik Mesin</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 transition text-sm"
              title={item.label}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-blue-800 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-600 transition text-sm rounded"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-56' : 'ml-20'} flex-1 transition-all duration-300`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                🔔
              </button>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right text-sm">
                  <p className="font-medium text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-gray-500 text-xs">{user?.role || 'Administrator'}</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
