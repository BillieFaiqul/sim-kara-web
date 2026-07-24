'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { karyaAPI, type Karya } from '@/lib/karya-api'
import { Eye } from 'lucide-react'

export default function KaryaPage() {
  const [karya, setKarya] = useState<Karya[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('semua')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 12
  const categories = ['semua', 'Publikasi', 'Penelitian', 'Pengabdian', 'HKI', 'Prestasi', 'Artikel']

  // Fetch karya - hanya verified
  useEffect(() => {
    const fetchKarya = async () => {
      setLoading(true)
      try {
        const data = await karyaAPI.getAll({
          search: searchTerm || undefined,
          jenis: selectedCategory !== 'semua' ? selectedCategory : undefined,
          status: 'verified', // Hanya tampilkan karya verified
        })
        setKarya(data.data || [])
        setError(null)
      } catch (err: any) {
        console.error('Error:', err)
        setError('Gagal memuat data karya')
        setKarya([])
      } finally {
        setLoading(false)
      }
    }

    fetchKarya()
  }, [searchTerm, selectedCategory])

  // Filter (done di backend)
  let filtered = karya

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
                <Link key={k.id} href={`/karya/${k.id}`}>
                  <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer h-full border-l-4 border-l-blue-600">
                    {/* Title */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-blue-600 text-sm mb-2">{k.jenis}</h4>
                      <h5 className="font-semibold text-gray-900 text-base line-clamp-2 mb-2">
                        {k.judul}
                      </h5>
                      <p className="text-sm text-gray-600 line-clamp-2">{k.deskripsi}</p>
                    </div>

                    {/* Author & Meta */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-900">{k.user?.name}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                        <span>{k.level}</span>
                        <span>{k.tahun}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        k.status === 'verified' ? 'bg-green-100 text-green-800' :
                        k.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                        k.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {k.status === 'verified' ? '✓ Verified' : k.status}
                      </span>
                    </div>
                  </div>
                </Link>
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
