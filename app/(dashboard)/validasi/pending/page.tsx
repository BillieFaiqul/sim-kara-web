'use client'

import { useState, useEffect } from 'react'
import { Eye, CheckCircle, XCircle, Search, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { karyaAPI, type Karya } from '@/lib/karya-api'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function ValidasiPendingPage() {
  const [karyaList, setKaryaList] = useState<Karya[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')

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

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    karyaId: null as number | null,
    reason: '',
  })

  useEffect(() => {
    loadKarya()
  }, [search])

  const loadKarya = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await karyaAPI.getAll({
        status: 'submitted',
        search: search || undefined,
      })
      setKaryaList(response.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat data karya')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const confirmApprove = (karya: Karya) => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Setujui Karya?',
      message: `Apakah Anda yakin ingin menyetujui karya "${karya.judul}"? Karya akan ditampilkan di Etalase Publik.`,
      action: () => handleApprove(karya.id),
    })
  }

  const handleApprove = async (karyaId: number) => {
    try {
      setActionLoading(true)
      await karyaAPI.approve(karyaId)
      setKaryaList(karyaList.filter(k => k.id !== karyaId))
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: 'Karya berhasil disetujui dan ditampilkan di Etalase Publik',
        destructive: false,
      })
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message || 'Gagal menyetujui karya',
        destructive: false,
      })
    } finally {
      setActionLoading(false)
    }
  }

  const openRejectModal = (karyaId: number) => {
    setRejectModal({
      isOpen: true,
      karyaId,
      reason: '',
    })
  }

  const handleReject = async () => {
    if (!rejectModal.karyaId || !rejectModal.reason.trim()) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Silakan isi alasan penolakan',
        destructive: false,
      })
      return
    }

    try {
      setActionLoading(true)
      await karyaAPI.reject(rejectModal.karyaId, rejectModal.reason)
      setKaryaList(karyaList.filter(k => k.id !== rejectModal.karyaId))
      setRejectModal({
        isOpen: false,
        karyaId: null,
        reason: '',
      })
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: 'Karya berhasil ditolak',
        destructive: false,
      })
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message || 'Gagal menolak karya',
        destructive: false,
      })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Pending Validasi
        </h1>
        <p className="text-gray-600 mt-2">Tinjau dan validasi karya yang menunggu persetujuan</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-2">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Info Card */}
      {karyaList.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">
              Ada <span className="font-bold">{karyaList.length}</span> karya menunggu validasi Anda
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Silakan periksa detail dan berikan keputusan setuju atau tolak
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
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
                      <span className="text-sm text-gray-700">{karya.level}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{karya.tahun}</span>
                    </td>

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

                        {/* Approve */}
                        <button
                          onClick={() => confirmApprove(karya)}
                          disabled={actionLoading}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                          title="Setujui"
                        >
                          <CheckCircle size={18} />
                        </button>

                        {/* Reject */}
                        <button
                          onClick={() => openRejectModal(karya.id)}
                          disabled={actionLoading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Tolak"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
            <p className="text-lg font-medium text-gray-900">Semua Karya Tervalidasi!</p>
            <p className="text-gray-600 mt-2">Tidak ada karya yang menunggu validasi Anda saat ini.</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modal.isOpen}
        type={modal.type as any}
        title={modal.title}
        message={modal.message}
        confirmText={modal.type === 'confirm' ? 'Ya, Setujui' : 'OK'}
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

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tolak Karya</h2>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Karya yang ditolak:</p>
              <p className="text-sm font-medium text-gray-900">
                {karyaList.find(k => k.id === rejectModal.karyaId)?.judul}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                placeholder="Jelaskan alasan penolakan karya ini..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-black resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectModal.reason.trim() || actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
              >
                {actionLoading ? 'Loading...' : 'Tolak Karya'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
