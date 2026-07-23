'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getKarya, Karya } from '@/lib/karya'
import KaryaCard from '@/components/KaryaCard'

export default function KaryaPage() {
  const [karya, setKarya] = useState<Karya[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('semua')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 12
  const categories = ['semua', 'Publikasi', 'Penelitian', 'Pengabdian', 'Buku', 'HKI', 'Prestasi', 'Artikel']

  // Fetch karya
  useEffect(() => {
    const fetchKarya = async () => {
      setLoading(true)
      try {
        const data = await getKarya()
        setKarya(data.data || mockData)
      } catch (err) {
        console.error('Error:', err)
        setError('Gagal memuat data karya')
        setKarya(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchKarya()
  }, [])

  // Filter & Search
  let filtered = karya

  if (selectedCategory !== 'semua') {
    filtered = filtered.filter((k) => k.kategori === selectedCategory)
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (k) =>
        k.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.penulis.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedKarya = filtered.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Etalase Karya</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Ditemukan {filtered.length} karya
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            ⚠️ {error} (Menampilkan data sample)
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {/* Karya Grid */}
        {!loading && paginatedKarya.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedKarya.map((k) => (
                <KaryaCard key={k.id} karya={k} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && paginatedKarya.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada karya yang cocok dengan pencarian Anda</p>
          </div>
        )}
      </main>
    </div>
  )
}

// Mock data (untuk development sebelum API siap)
const mockData: Karya[] = [
  {
    id: 1,
    judul: 'Optimalisasi Desain Rangka Sepeda Listrik',
    kategori: 'Penelitian',
    penulis: 'Dr. Bambang Suryanto',
    tahun: 2024,
    deskripsi: 'Penelitian tentang optimalisasi desain rangka sepeda listrik menggunakan CFD',
  },
  {
    id: 2,
    judul: 'Analisa Performa Motor Biodisel',
    kategori: 'Publikasi',
    penulis: 'Ir. Siti Nurhasanah',
    tahun: 2024,
    deskripsi: 'Publikasi di jurnal internasional tentang performa motor biodisel',
  },
  {
    id: 3,
    judul: 'Pelatihan Pereparasian Mesin untuk Masyarakat',
    kategori: 'Pengabdian',
    penulis: 'Tim Pengabdian',
    tahun: 2024,
    deskripsi: 'Program pelatihan gratis untuk masyarakat desa',
  },
  {
    id: 4,
    judul: 'Buku Ajar Elemen Mesin',
    kategori: 'Buku',
    penulis: 'Prof. Budi Santoso',
    tahun: 2023,
    deskripsi: 'Buku ajar komprehensif tentang elemen mesin',
  },
  {
    id: 5,
    judul: 'Patent: Sistem Pendingin Motor Efisien',
    kategori: 'HKI',
    penulis: 'Dr. Adi Firmansyah',
    tahun: 2023,
    deskripsi: 'Paten sistem pendingin motor yang lebih efisien',
  },
  {
    id: 6,
    judul: 'Juara Kompetisi Robot ASEAN 2024',
    kategori: 'Prestasi',
    penulis: 'Tim Robotik',
    tahun: 2024,
    deskripsi: 'Mahasiswa meraih juara 1 di kompetisi robot ASEAN',
  },
]
