'use client'

import { useState, useEffect } from 'react'
import { Eye, Trash2, Search, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { karyaAPI, type Karya } from '@/lib/karya-api'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function SemuaKaryaPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('semua')
  const [karyaList, setKaryaList] = useState<Karya[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'confirm' | 'success' | 'error'
    title: string
    message: string
    action?: () => void
    destructive?: boolean
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    destructive: false,
  })

  useEffect(() => {
    loadKarya()
  }, [search, filter])

  const loadKarya = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await karyaAPI.getAll({
        search: search || undefined,
        status: filter !== 'semua' ? filter : undefined,
      })
      setKaryaList(response.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat data karya')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Role-based filter options
  const getFilterOptions = () => {
    if (user?.role === 'admin') {
      return [
        { value: 'semua', label: 'Semua' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'verified', label: 'Verified' },
        { value: 'rejected', label: 'Rejected' },
      ]
    } else if (user?.role === 'dosen') {
      return [
        { value: 'semua', label: 'Semua' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'verified', label: 'Verified' },
        { value: 'rejected', label: 'Rejected' },
      ]
    } else {
      // mahasiswa
      return [
        { value: 'semua', label: 'Semua' },
        { value: 'verified', label: 'Verified' },
        { value: 'rejected', label: 'Rejected' },
      ]
    }
  }

  const filterOptions = getFilterOptions()

  const statusColor: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  const statusLabel: Record<string, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    verified: 'Verified',
    rejected: 'Rejected',
  }

  const confirmDeleteKarya = (id: number) => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Hapus Karya?',
      message: 'Apakah Anda yakin ingin menghapus karya ini? Tindakan ini tidak dapat dibatalkan.',
      destructive: true,
      action: () => handleDelete(id),
    })
  }

  const handleDelete = async (id: number) => {
    try {
      setActionLoading(true)
      await karyaAPI.delete(id)
      setKaryaList(karyaList.filter(k => k.id !== id))
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: 'Karya berhasil dihapus',
        destructive: false,
      })
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message || 'Gagal menghapus karya',
        destructive: false,
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Check if user can delete (only admin, only verified/rejected)
  const canDelete = (karya: Karya) => {
    return user?.role === 'admin' && (karya.status === 'verified' || karya.status === 'rejected')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Semua Karya
        </h1>
        <p className="text-gray-600 mt-2">Tampilkan semua karya dari dosen dan mahasiswa</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-2">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Search & Filter */}
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
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="text-sm text-gray-600">
          Total: <span className="font-bold text-gray-900">{loading ? '...' : karyaList.length}</span> karya
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Level</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {karyaList.map(karya => (
                  <tr key={karya.id} className="hover:bg-gray-50 transition">
                    {/* Judul + Tahun */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-2">{karya.judul}</p>
                        <p className="text-xs text-gray-500 mt-1">{karya.tahun}</p>
                      </div>
                    </td>

                    {/* Pembuat + NIP/NIM */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{karya.nama || karya.user?.name}</p>
                        <p className="text-xs text-gray-500">
                          {karya.nip_nim || karya.user?.role}
                        </p>
                      </div>
                    </td>

                    {/* Jenis */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{karya.jenis}</span>
                    </td>

                    {/* Level */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{karya.level}</span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColor[karya.status]
                        }`}
                      >
                        {statusLabel[karya.status]}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* View Detail */}
                        <Link href={`/semua-karya/${karya.id}`}>
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                        </Link>

                        {/* Delete - Only for admin, only verified/rejected */}
                        {canDelete(karya) && (
                          <button
                            onClick={() => confirmDeleteKarya(karya.id)}
                            disabled={actionLoading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada karya yang sesuai</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modal.isOpen}
        type={modal.type as any}
        title={modal.title}
        message={modal.message}
        confirmText={modal.type === 'confirm' ? 'Hapus' : 'OK'}
        cancelText={modal.type === 'error' || modal.type === 'success' ? 'Tutup' : 'Batal'}
        destructive={modal.destructive}
        loading={actionLoading}
        onConfirm={() => {
          if (modal.action) {
            modal.action()
          } else {
            setModal({ ...modal, isOpen: false })
          }
        }}
        onCancel={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}