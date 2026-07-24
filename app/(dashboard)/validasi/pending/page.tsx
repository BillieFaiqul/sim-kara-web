'use client'

import { useState } from 'react'
import { Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Karya {
  id: number
  judul: string
  pembuat: string
  role: 'Dosen' | 'Mahasiswa'
  nip_nim: string
  jenis: string
  tahun: number
  level: string
  status: 'submitted'
  tanggal_submit: string
}

export default function ValidasiPendingPage() {
  const [karyaList, setKaryaList] = useState<Karya[]>([
    {
      id: 2,
      judul: 'Analisa Performa Motor Biodisel',
      pembuat: 'Ir. Siti Nurhasanah',
      role: 'Dosen',
      nip_nim: '0987654321',
      jenis: 'Penelitian',
      tahun: 2024,
      level: 'Nasional',
      status: 'submitted',
      tanggal_submit: '2024-07-21',
    },
    {
      id: 5,
      judul: 'Platform E-Learning Interaktif',
      pembuat: 'Budi Santoso',
      role: 'Mahasiswa',
      nip_nim: '210411100003',
      jenis: 'Publikasi',
      tahun: 2024,
      level: 'Nasional',
      status: 'submitted',
      tanggal_submit: '2024-07-22',
    },
    {
      id: 6,
      judul: 'Sistem Otomasi Greenhouse',
      pembuat: 'Dr. Hendra Wijaya',
      role: 'Dosen',
      nip_nim: '1122334455',
      jenis: 'Pengabdian',
      tahun: 2024,
      level: 'Lokal',
      status: 'submitted',
      tanggal_submit: '2024-07-23',
    },
  ])

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedKarya, setSelectedKarya] = useState<Karya | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showApproveConfirm, setShowApproveConfirm] = useState(false)
  const [approveKaryaId, setApproveKaryaId] = useState<number | null>(null)

  const handleApproveClick = (karya: Karya) => {
    setApproveKaryaId(karya.id)
    setShowApproveConfirm(true)
  }

  const handleApproveConfirm = () => {
    if (approveKaryaId) {
      setKaryaList(karyaList.filter(k => k.id !== approveKaryaId))
      setShowApproveConfirm(false)
      setApproveKaryaId(null)
      alert('Karya disetujui! Status berubah menjadi VERIFIED')
    }
  }

  const handleRejectClick = (karya: Karya) => {
    setSelectedKarya(karya)
    setRejectReason('')
    setShowRejectModal(true)
  }

  const handleRejectSubmit = () => {
    if (!selectedKarya || !rejectReason.trim()) {
      alert('Silakan isi alasan penolakan')
      return
    }

    setKaryaList(karyaList.filter(k => k.id !== selectedKarya.id))
    setShowRejectModal(false)
    setSelectedKarya(null)
    setRejectReason('')
    alert(`Karya ditolak dengan alasan: "${rejectReason}"`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Pending Validasi
        </h1>
        <p className="text-gray-600 mt-2">Tinjau dan setujui karya yang menunggu validasi</p>
      </div>

      {/* Info Card */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-900">
            Ada <span className="font-bold">{karyaList.length}</span> karya menunggu validasi Anda
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Anda dapat menyetujui atau menolak dengan memberikan alasan jika ditolak
          </p>
        </div>
      </div>

      {/* Karya List */}
      {karyaList.length > 0 ? (
        <div className="space-y-4">
          {karyaList.map((karya, index) => (
            <div key={karya.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-l-yellow-500 hover:shadow-lg transition">
              {/* Number Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  #{index + 1}
                </span>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Column 1: Judul & Pembuat */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                    {karya.judul}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Pembuat</p>
                      <p className="font-medium text-gray-900">{karya.pembuat}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">NIP/NIM</p>
                      <p className="font-medium text-gray-900">{karya.nip_nim}</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Detail Karya */}
                <div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600 text-sm">Role</p>
                      <p className="font-medium text-gray-900">{karya.role}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Jenis</p>
                      <p className="font-medium text-gray-900">{karya.jenis}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Tahun</p>
                      <p className="font-medium text-gray-900">{karya.tahun}</p>
                    </div>
                  </div>
                </div>

                {/* Column 3: Level & Tanggal */}
                <div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600 text-sm">Level Publikasi</p>
                      <div className="flex gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          karya.level === 'Internasional' ? 'bg-blue-100 text-blue-800' :
                          karya.level === 'Nasional' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {karya.level}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Tanggal Submit</p>
                      <p className="font-medium text-gray-900">{formatDate(karya.tanggal_submit)}</p>
                    </div>
                    <div>
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-wrap gap-2">
                  {/* View Detail Button */}
                  <Link href={`/dashboard/validasi/${karya.id}`}>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                      <Eye size={16} />
                      Lihat Detail
                    </button>
                  </Link>

                  {/* Approve Button */}
                  <button
                    onClick={() => handleApproveClick(karya)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                  >
                    <CheckCircle size={16} />
                    Setujui
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleRejectClick(karya)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                  >
                    <XCircle size={16} />
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
          <p className="text-lg font-medium text-gray-900">Semua Karya Tervalidasi!</p>
          <p className="text-gray-600 mt-2">Tidak ada karya yang menunggu validasi Anda saat ini.</p>
        </div>
      )}

      {/* APPROVE CONFIRMATION MODAL */}
      {showApproveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Setujui Karya?</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menyetujui karya ini? Karya akan ditampilkan di Etalase Publik.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleApproveConfirm}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Ya, Setujui
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && selectedKarya && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Tolak Karya</h2>
            </div>

            {/* Karya Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">Karya yang ditolak:</p>
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {selectedKarya.judul}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Pembuat: {selectedKarya.pembuat}
              </p>
            </div>

            {/* Reason Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Jelaskan alasan penolakan karya ini (mis: Dokumen tidak lengkap, format tidak sesuai, duplikasi, dll)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Pembuat karya akan melihat alasan ini saat mencek detail karya mereka
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!rejectReason.trim()}
              >
                Tolak Karya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}