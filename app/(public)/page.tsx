'use client'

import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export default function Home() {
  // Mock data for recent karya
  const recentKarya = [
    {
      id: 1,
      judul: 'Optimalisasi Desain Rangka Sepeda Listrik',
      kategori: 'Penelitian',
      penulis: 'Dr. Bambang Suryanto',
      tahun: 2024,
      icon: '🔬',
    },
    {
      id: 2,
      judul: 'Analisa Performa Motor Biodisel',
      kategori: 'Publikasi',
      penulis: 'Ir. Siti Nurhasanah',
      tahun: 2024,
      icon: '📝',
    },
    {
      id: 3,
      judul: 'Pelatihan Pereparasian Mesin untuk Masyarakat',
      kategori: 'Pengabdian',
      penulis: 'Tim Pengabdian',
      tahun: 2024,
      icon: '🤝',
    },
  ]

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-4xl font-bold text-blue-600 mb-2">128</p>
              <p className="text-gray-600 font-medium">Publikasi</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-4xl font-bold text-green-600 mb-2">86</p>
              <p className="text-gray-600 font-medium">Penelitian</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-4xl font-bold text-amber-600 mb-2">42</p>
              <p className="text-gray-600 font-medium">Pengabdian</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-4xl font-bold text-red-600 mb-2">35</p>
              <p className="text-gray-600 font-medium">Prestasi</p>
            </div>
          </div>

          {/* Chart - Smaller */}
          <div className="bg-gray-50 p-8 rounded-lg max-w-3xl mx-auto">
            <h4 className="text-xl font-bold mb-6 text-center text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Distribusi Karya per Kategori
            </h4>
            <svg viewBox="0 0 400 250" className="w-full h-auto">
              {/* Axes */}
              <line x1="50" y1="200" x2="380" y2="200" stroke="#d1d5db" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="200" stroke="#d1d5db" strokeWidth="2" />

              {/* Bars */}
              <rect x="70" y="100" width="35" height="100" fill="#3B82F6" />
              <text x="87.5" y="220" textAnchor="middle" fontSize="11" fill="#4b5563">Publikasi</text>
              <text x="87.5" y="90" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1f2937">128</text>

              <rect x="125" y="128" width="35" height="72" fill="#10B981" />
              <text x="142.5" y="220" textAnchor="middle" fontSize="11" fill="#4b5563">Penelitian</text>
              <text x="142.5" y="118" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1f2937">86</text>

              <rect x="180" y="165" width="35" height="35" fill="#F59E0B" />
              <text x="197.5" y="220" textAnchor="middle" fontSize="11" fill="#4b5563">Pengabdian</text>
              <text x="197.5" y="155" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1f2937">42</text>

              <rect x="235" y="172" width="35" height="28" fill="#EF4444" />
              <text x="252.5" y="220" textAnchor="middle" fontSize="11" fill="#4b5563">Prestasi</text>
              <text x="252.5" y="162" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1f2937">35</text>

              <rect x="290" y="186" width="35" height="14" fill="#8B5CF6" />
              <text x="307.5" y="220" textAnchor="middle" fontSize="11" fill="#4b5563">HKI</text>
              <text x="307.5" y="176" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1f2937">20</text>
            </svg>
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
            {recentKarya.map((karya) => (
              <Link key={karya.id} href={`/karya/${karya.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer h-full hover:border-b-4 hover:border-b-blue-600">
                  {/* Icon & Title */}
                  <div className="flex gap-3 mb-4">
                    <span className="text-3xl">{karya.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-600 text-sm mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {karya.kategori}
                      </h4>
                      <h5 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {karya.judul}
                      </h5>
                    </div>
                  </div>

                  {/* Author & Year */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-1">{karya.penulis}</p>
                    <p className="text-sm font-medium text-gray-500">{karya.tahun}</p>
                  </div>
                </div>
              </Link>
            ))}
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
