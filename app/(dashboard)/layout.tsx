'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Menu, X, LogOut, Home, FileText, CheckSquare, BarChart3, Settings, User, BookOpen,
  HelpCircle, Upload, Users, Clock, History, ChevronDown
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, menuItems, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // Map icon names to lucide-react components
  const iconMap: Record<string, React.ReactNode> = {
    Home: <Home size={20} />,
    FileText: <FileText size={20} />,
    CheckSquare: <CheckSquare size={20} />,
    BarChart3: <BarChart3 size={20} />,
    Settings: <Settings size={20} />,
    User: <User size={20} />,
    BookOpen: <BookOpen size={20} />,
    HelpCircle: <HelpCircle size={20} />,
    Upload: <Upload size={20} />,
    Users: <Users size={20} />,
    Clock: <Clock size={20} />,
    History: <History size={20} />,
  }

  // Convert menuItems to include icon components
  const processedMenuItems = menuItems.map((item) => ({
    ...item,
    iconComponent: iconMap[item.icon] || <FileText size={20} />,
  }))

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
        </div>
      </div>
    )
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
          {processedMenuItems.length > 0 ? (
            processedMenuItems.map((item: any) => (
              <div key={item.href}>
                {item.submenu ? (
                  // Parent menu dengan submenu
                  <div>
                    <button
                      onClick={() => setExpandedMenu(expandedMenu === item.href ? null : item.href)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-800 transition text-sm"
                      title={item.label}
                    >
                      {item.iconComponent}
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              expandedMenu === item.href ? 'rotate-180' : ''
                            }`}
                          />
                        </>
                      )}
                    </button>
                    {/* Submenu */}
                    {expandedMenu === item.href && sidebarOpen && (
                      <div className="bg-blue-950 pl-4">
                        {item.submenu.map((subitem: any) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-blue-800 transition text-sm border-l-2 border-blue-700"
                            title={subitem.label}
                          >
                            {iconMap[subitem.icon] || <FileText size={16} />}
                            <span>{subitem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular menu item
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 transition text-sm"
                    title={item.label}
                  >
                    {item.iconComponent}
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-blue-200">Loading menu...</div>
          )}
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
      <div className={`${sidebarOpen ? 'ml-56' : 'ml-20'} flex-1 transition-all duration-300 flex flex-col bg-white`}>
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
