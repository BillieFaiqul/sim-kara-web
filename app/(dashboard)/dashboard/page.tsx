'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/lib/auth-context'
import { karyaAPI } from '@/lib/karya-api'

interface StatItem {
  icon: string
  label: string
  value: string
}

interface ChartDataItem {
  name: string
  value: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StatItem[]>([])
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [availableYears, setAvailableYears] = useState<number[]>([])

  useEffect(() => {
    // Generate tahun dari 50 tahun yang lalu sampai sekarang
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 50
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)
    setAvailableYears(years.reverse())
  }, [])

  useEffect(() => {
    loadStats()
  }, [selectedYear])

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await karyaAPI.getStats(selectedYear || undefined)

      const iconMap: Record<string, string> = {
        publikasi: '📄',
        penelitian: '🔬',
        pengabdian: '🤝',
        prestasi: '🏆',
        hki: '🔐',
        artikel: '📰',
      }

      const statsArray: StatItem[] = []
      Object.entries(response.stats).forEach(([key, value]) => {
        statsArray.push({
          icon: iconMap[key] || '📊',
          label: key.charAt(0).toUpperCase() + key.slice(1),
          value: value.toString(),
        })
      })

      setStats(statsArray)
      setChartData(response.chart_data)
    } catch (error) {
      console.error('Error loading stats:', error)
      setStats([])
      setChartData([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Selamat datang, {user?.name} 👋</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
        ) : stats.length > 0 ? (
          stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-2">Total Data</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">Tidak ada data</div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Distribusi Karya per Kategori
            </h2>
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
            >
              <option value="">Semua Tahun</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">Loading...</div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">Tidak ada data</div>
          )}
        </div>

        {/* Placeholder Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Info Sistem
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded border-l-4 border-l-blue-600">
              <p className="font-medium text-gray-900 text-sm">Sistem SIM-KARA</p>
              <p className="text-xs text-gray-600 mt-1">Manajemen Karya Akademik</p>
            </div>
            <div className="p-3 bg-green-50 rounded border-l-4 border-l-green-600">
              <p className="font-medium text-gray-900 text-sm">Role Anda: {user?.role}</p>
              <p className="text-xs text-gray-600 mt-1">Akses sesuai permission</p>
            </div>
            <div className="p-3 bg-amber-50 rounded border-l-4 border-l-amber-600">
              <p className="font-medium text-gray-900 text-sm">Total Stats</p>
              <p className="text-xs text-gray-600 mt-1">Lihat grafik di atas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
