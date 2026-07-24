'use client'

import { useState } from 'react'
import { Eye, CheckCircle, XCircle, Filter } from 'lucide-react'
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
  status: 'verified' | 'rejected'
  tanggal_submit: string
  tanggal_validasi: string
  alasan_reject?: string
}

export default function RiwayatValidasiPage() {
  const [filter, setFilter] = useState<'semua' | 'approved' | 'rejected'>('semua')
  const [karyaList] = useState<Karya[]>([
    {
      id: 1,
      judul: 'Optimalisasi Desain Rangka Sepeda Listrik',
      pembuat: 'Dr. Bambang Suryanto',
      role: 'Dosen',
      nip_nim: '1234567890',
      jenis: 'Publikasi',
      tahun: 2024,
      level: 'Internasional',
      status: 'verified',
      tanggal_submit: '2024-07-20',
      tanggal_validasi: '2024-07-20',
    },
    {
      id: 4,
      judul: 'Sensor Suhu Berbasis IoT',
      pembuat: 'Ahmad Hidayat',
      role: 'Mahasiswa',
      nip_nim: '210411100002',
      jenis: 'Penelitian',
      tahun: 2023,
      level: 'Nasional',
      status: 'rejected',
      tanggal_submit: '2024-07-18',
      tanggal_validasi: '2024-07-19',
      alasan_reject: 'Dokumen tidak lengkap, silakan tambahkan sertifikat penelitian',
    },
    {
      id: 3,
      judul: 'Sistem Manajemen Gudang Otomatis',
      pembuat: 'Rina Wijaya',
      role: 'Mahasiswa',
      nip_nim: '210411100001',
      jenis: 'Publikasi',
      tahun: 2024,
      level: 'Lokal',
      status: 'verified',
      tanggal_submit: '2024-07-19',
      tanggal_validasi: '2024-07-21',
    },
  ])

  const filterOptions = [
    { value: 'semua' as const, label: 'Semua', count: karyaList.length },
    { value: 'approved' as const, label: 'Disetujui', count: karyaList.filter(k => k.status === 'verified').length },
    { value: 'rejected' as const, label: 'Ditolak', count: karyaList.filter(k => k.status === 'rejected').length },
  ]

  const filtered = filter === 'semua' 
    ? karyaList
    : filter === 'approved'
    ? karyaList.filter(k => k.status === 'verified')
    : karyaList.filter(k => k.status === 'rejected')

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
          Riwayat Validasi
        </h1>
        <p className="text-gray-600 mt-2">Lihat histori validasi karya yang telah disetujui atau ditolak</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-2 flex-wrap">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              filter === opt.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter size={16} />
            {opt.label}
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              filter === opt.value
                ? 'bg-white bg-opacity-20'
                : 'bg-gray-300 text-gray-900'
            }`}>
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      {/* Karya List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(karya => (
            <div 
              key={karya.id} 
              className={`bg-white rounded-lg shadow p-6 border-l-4 hover:shadow-lg transition ${
                karya.status === 'verified' 
                  ? 'border-l-green-500' 
                  : 'border-l-red-500'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <div className="flex items-center gap-2">
                  {karya.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      <CheckCircle size={16} />
                      Disetujui
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      <XCircle size={16} />
                      Ditolak
                    </span>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pr-40">
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

                {/* Column 3: Tanggal */}
                <div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600 text-sm">Level Publikasi</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                        karya.level === 'Internasional' ? 'bg-blue-100 text-blue-800' :
                        karya.level === 'Nasional' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {karya.level}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Tanggal Submit</p>
                      <p className="font-medium text-gray-900">{formatDate(karya.tanggal_submit)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Tanggal Validasi</p>
                      <p className="font-medium text-gray-900">{formatDate(karya.tanggal_validasi)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reject Reason (jika ditolak) */}
              {karya.status === 'rejected' && karya.alasan_reject && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-red-900 mb-1">Alasan Penolakan:</p>
                  <p className="text-sm text-red-800">{karya.alasan_reject}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="border-t border-gray-200 pt-4">
                <Link href={`/dashboard/validasi/riwayat/${karya.id}`}>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                    <Eye size={16} />
                    Lihat Detail
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Filter size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900">Tidak Ada Data</p>
          <p className="text-gray-600 mt-2">Belum ada karya yang divalidasi dengan filter ini</p>
        </div>
      )}
    </div>
  )
}