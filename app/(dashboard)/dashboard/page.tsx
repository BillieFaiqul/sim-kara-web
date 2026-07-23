'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const stats = [
    { icon: '📄', label: 'Publikasi', value: '128' },
    { icon: '🔬', label: 'Penelitian', value: '86' },
    { icon: '🤝', label: 'Pengabdian', value: '42' },
    { icon: '🏆', label: 'Prestasi', value: '35' },
  ]

  const chartData = [
    { name: 'Publikasi', value: 128 },
    { name: 'Penelitian', value: 86 },
    { name: 'Pengabdian', value: 42 },
    { name: 'Prestasi', value: 35 },
    { name: 'HKI', value: 20 },
    { name: 'Artikel', value: 68 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Selamat datang, Admin Prodi 👋</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Grafik Karya per Kategori
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Karya Terbaru
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded border-l-4 border-l-blue-600">
              <p className="font-medium text-gray-900 text-sm">Optimalisasi Rangka Sepeda</p>
              <p className="text-xs text-gray-600 mt-1">Dr. Bambang • Penelitian</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border-l-4 border-l-green-600">
              <p className="font-medium text-gray-900 text-sm">Analisa Performa Motor Biodisel</p>
              <p className="text-xs text-gray-600 mt-1">Ir. Siti • Publikasi</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border-l-4 border-l-amber-600">
              <p className="font-medium text-gray-900 text-sm">Pelatihan Pereparasian Mesin</p>
              <p className="text-xs text-gray-600 mt-1">Tim • Pengabdian</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
