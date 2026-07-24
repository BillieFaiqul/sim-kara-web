'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { karyaAPI, type Karya, type StatsResponse } from '@/lib/karya-api'

interface RecentKarya {
  id: number
  judul: string
  jenis: string
  user?: { name: string; role: string }
  tahun: number
  icon: string
}

export default function Home() {
  const [recentKarya, setRecentKarya] = useState<RecentKarya[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const [chartData, setChartData] = useState<Array<{name: string; value: number}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Get stats
      const statsData = await karyaAPI.getStats()
      setStats(statsData.stats)
      setChartData(statsData.chart_data)

      // Get recent karya
      const karyaData = await karyaAPI.getAll()
      const transformed = karyaData.data.slice(0, 3).map((k: Karya) => ({
        id: k.id,
        judul: k.judul,
        jenis: k.jenis,
        user: k.user,
        tahun: k.tahun,
        icon: getIconForJenis(k.jenis),
      }))
      setRecentKarya(transformed)
    } catch (error) {
      console.error('Error loading data:', error)
      setStats({})
      setChartData([])
      setRecentKarya([])
    } finally {
      setLoading(false)
    }
  }

  const getIconForJenis = (jenis: string): string => {
    const iconMap: Record<string, string> = {
      'Publikasi': '📝',
      'Penelitian': '🔬',
      'Pengabdian': '🤝',
      'Prestasi': '🏆',
      'HKI': '🔐',
      'Artikel': '📰',
    }
    return iconMap[jenis] || '📊'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Background Image */}
      <section className="relative max-w-7xl mx-auto px-4 py-24 text-center overflow-hidden rounded-lg">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 z-1 bg-black opacity-40"></div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-6 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Etalase Karya Akademik
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Jelajahi prestasi dan karya penelitian dari D4 Teknik Mesin UNESA
          </p>
          <Link
            href="/karya"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Lihat Semua Karya →
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Statistik Karya
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {loading ? (
              <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
            ) : (
              Object.entries(stats).map(([key, value]) => (
                <div key={key} className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-4xl font-bold text-blue-600 mb-2">{value}</p>
                  <p className="text-gray-600 font-medium text-sm capitalize">{key}</p>
                </div>
              ))
            )}
          </div>

          {/* Chart - Real-time */}
          <div className="bg-gray-50 p-8 rounded-lg max-w-4xl mx-auto">
            <h4 className="text-xl font-bold mb-6 text-center text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Distribusi Karya per Kategori
            </h4>
            {loading ? (
              <div className="h-80 flex items-center justify-center text-gray-500">Loading chart...</div>
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
              <div className="h-80 flex items-center justify-center text-gray-500">Tidak ada data</div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Karya Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp size={28} className="text-blue-600" />
            <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Karya Terbaru
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">Loading karya...</div>
            ) : recentKarya.length > 0 ? (
              recentKarya.map((karya) => (
                <Link key={karya.id} href={`/karya/${karya.id}`}>
                  <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer h-full hover:border-b-4 hover:border-b-blue-600">
                    {/* Icon & Title */}
                    <div className="flex gap-3 mb-4">
                      <span className="text-3xl">{karya.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-600 text-sm mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {karya.jenis}
                        </h4>
                        <h5 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {karya.judul}
                        </h5>
                      </div>
                    </div>

                    {/* Author & Year */}
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-1">{karya.user?.name}</p>
                      <p className="text-sm font-medium text-gray-500">{karya.tahun}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">Tidak ada karya</div>
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <Link
              href="/karya"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Lihat Semua Karya →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
