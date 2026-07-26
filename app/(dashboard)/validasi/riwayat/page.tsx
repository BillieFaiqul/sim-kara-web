'use client'

import { useState, useEffect } from 'react'
import { Eye, Search, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { karyaAPI, type Karya } from '@/lib/karya-api'

export default function RiwayatValidasiPage() {
  const [karyaList, setKaryaList] = useState<Karya[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'semua' | 'verified' | 'rejected'>('semua')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadKarya()
  }, [filter, search])

  const loadKarya = async () => {
    setLoading(true)
    setError('')
    try {
      // Riwayat hanya menampilkan verified & rejected (tidak submitted atau draft)
      const statusParam = filter === 'semua' ? undefined : filter

      // Jika filter semua, fetch verified dan rejected secara terpisah
      if (filter === 'semua') {
        const verifiedRes = await karyaAPI.getAll({
          status: 'verified',
          search: search || undefined,
        })
        const rejectedRes = await karyaAPI.getAll({
          status: 'rejected',
          search: search || undefined,
        })
        setKaryaList([...verifiedRes.data, ...rejectedRes.data])
      } else {
        const response = await karyaAPI.getAll({
          status: statusParam,
          search: search || undefined,
        })
        setKaryaList(response.data)
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat data karya')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterOptions = [
    { value: 'semua' as const, label: 'Semua' },
    { value: 'verified' as const, label: 'Disetujui' },
    { value: 'rejected' as const, label: 'Ditolak' },
  ]

  const statusColor: Record<string, string> = {
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  const statusLabel: Record<string, string> = {
    verified: '✓ Disetujui',
    rejected: '✗ Ditolak',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Riwayat Validasi
        </h1>
        <p className="text-gray-600 mt-2">Lihat histori validasi karya yang telah disetujui atau ditolak</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-2">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari judul atau pembuat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
                filter === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {opt.label}
              <span className={`ml-2 text-xs font-bold ${
                filter === opt.value ? 'bg-white bg-opacity-20' : 'bg-gray-300 text-gray-900'
              } px-2 py-0.5 rounded`}>
                {loading ? '...' : karyaList.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : karyaList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Judul</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pembuat</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jenis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tahun</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {karyaList.map(karya => (
                  <tr key={karya.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 line-clamp-2">{karya.judul}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{karya.nama || karya.user?.name}</p>
                        <p className="text-xs text-gray-500">{karya.nip_nim || karya.user?.role}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{karya.jenis}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[karya.status]}`}>
                        {statusLabel[karya.status]}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{karya.tahun}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Link href={`/semua-karya/${karya.id}`}>
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada data validasi</p>
            <p className="text-gray-400 mt-2">Belum ada karya yang divalidasi dengan filter ini</p>
          </div>
        )}
      </div>

      {/* Show Reject Reason Info */}
      {karyaList.some(k => k.status === 'rejected' && k.alasan_reject) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            💡 <strong>Tips:</strong> Untuk karya yang ditolak, buka detail untuk melihat alasan penolakan.
          </p>
        </div>
      )}
    </div>
  )
}
