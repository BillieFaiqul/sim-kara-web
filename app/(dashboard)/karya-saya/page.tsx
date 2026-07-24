'use client'

import { useState, useEffect } from 'react'
import { Plus, Eye, Edit2, Trash2, Send, AlertCircle, Loader } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { karyaAPI, type Karya } from '@/lib/karya-api'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function KaryaSayaPage() {
  const { user } = useAuth()
  const [karyaList, setKaryaList] = useState<Karya[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'confirm'
    title: string
    message: string
    action?: () => void
    destructive?: boolean
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  })

  useEffect(() => {
    loadKarya()
  }, [])

  const loadKarya = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await karyaAPI.getByUser()
      setKaryaList(response.data || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat karya Anda')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
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
    setActionLoading(true)
    try {
      await karyaAPI.delete(id)
      setKaryaList(karyaList.filter(k => k.id !== id))
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: 'Karya berhasil dihapus',
      })
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message || 'Gagal menghapus karya',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmit = async (id: number) => {
    setActionLoading(true)
    try {
      await karyaAPI.submit(id)
      loadKarya()
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: 'Karya berhasil disubmit untuk validasi',
      })
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message || 'Gagal submit karya',
      })
    } finally {
      setActionLoading(false)
    }
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Karya Saya
          </h1>
          <p className="text-gray-600 mt-2">Kelola semua karya yang Anda buat</p>
        </div>
        <Link href="/karya-saya/tambah">
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            <Plus size={20} />
            Tambah Karya
          </button>
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-2">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="animate-spin text-blue-600" />
            <p className="ml-3 text-gray-500">Memuat karya Anda...</p>
          </div>
        ) : karyaList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Judul</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jenis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Level</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tahun</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {karyaList.map(karya => (
                  <tr key={karya.id} className="hover:bg-gray-50 transition">
                    {/* Judul */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 line-clamp-2">{karya.judul}</p>
                    </td>

                    {/* Jenis */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{karya.jenis}</span>
                    </td>

                    {/* Level */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{karya.level}</span>
                    </td>

                    {/* Tahun */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{karya.tahun}</span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[karya.status]}`}>
                        {statusLabel[karya.status]}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* View Detail */}
                        <Link href={`/karya-saya/${karya.id}`}>
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                        </Link>

                        {/* Edit - hanya draft & rejected */}
                        {(karya.status === 'draft' || karya.status === 'rejected') && (
                          <Link href={`/karya-saya/${karya.id}/edit`}>
                            <button
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                          </Link>
                        )}

                        {/* Delete - hanya draft */}
                        {karya.status === 'draft' && (
                          <button
                            onClick={() => confirmDeleteKarya(karya.id)}
                            disabled={actionLoading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}

                        {/* Submit - hanya draft & rejected */}
                        {(karya.status === 'draft' || karya.status === 'rejected') && (
                          <button
                            onClick={() => handleSubmit(karya.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Submit untuk validasi"
                          >
                            <Send size={18} />
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
            <p className="text-gray-500 text-lg">Anda belum membuat karya apapun</p>
            <p className="text-gray-400 mt-2">Mulai dengan klik tombol "Tambah Karya" di atas</p>
          </div>
        )}
      </div>

      {/* Rejection Alert */}
      {karyaList.some(k => k.status === 'rejected' && k.alasan_reject) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-bold text-red-900 mb-3">⚠️ Karya Ditolak</h3>
          {karyaList
            .filter(k => k.status === 'rejected' && k.alasan_reject)
            .map(k => (
              <div key={k.id} className="text-sm text-red-800 mb-3 pb-3 border-b border-red-200 last:border-b-0">
                <p className="font-semibold">{k.judul}</p>
                <p className="text-red-700 mt-1">Alasan: {k.alasan_reject}</p>
              </div>
            ))}
        </div>
      )}

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
