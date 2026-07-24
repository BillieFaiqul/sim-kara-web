'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, ChevronRight, ChevronLeft, X, Upload } from 'lucide-react'
import Link from 'next/link'

interface Karya {
  id: number
  judul: string
  nama_jurnal: string
  tahun: number
  level: string
  jenis: string
  status: 'draft' | 'submitted' | 'verified' | 'rejected'
  tanggal_submit?: string
  alasan_reject?: string
  file_jurnal?: string
  file_pendukung?: string
}

interface FormData {
  jenis_karya: string
  judul: string
  nama_jurnal: string
  judul_publikasi: string
  volume: string
  nomor_halaman: string
  tahun: number
  penerbit: string
  level_publikasi: string
  doi_link: string
  deskripsi: string
}

export default function KaryaSayaPage() {
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState<FormData>({
    jenis_karya: 'publikasi',
    judul: '',
    nama_jurnal: '',
    judul_publikasi: '',
    volume: '',
    nomor_halaman: '',
    tahun: new Date().getFullYear(),
    penerbit: '',
    level_publikasi: 'nasional',
    doi_link: '',
    deskripsi: '',
  })

  const [files, setFiles] = useState({
    file_jurnal: null as File | null,
    file_pendukung: null as File | null,
  })

  const [karyaList, setKaryaList] = useState<Karya[]>([
    {
      id: 1,
      judul: 'Optimalisasi Desain Rangka Sepeda Listrik',
      nama_jurnal: 'Jurnal Teknik Mesin',
      tahun: 2024,
      level: 'Internasional',
      jenis: 'Publikasi',
      status: 'verified',
      tanggal_submit: '2024-07-20',
    },
    {
      id: 2,
      judul: 'Sistem Manajemen Gudang Otomatis',
      nama_jurnal: 'Proceeding UNESA',
      tahun: 2024,
      level: 'Lokal',
      jenis: 'Publikasi',
      status: 'draft',
    },
    {
      id: 3,
      judul: 'Sensor Suhu Berbasis IoT',
      nama_jurnal: 'Jurnal Penelitian',
      tahun: 2024,
      level: 'Nasional',
      jenis: 'Penelitian',
      status: 'rejected',
      tanggal_submit: '2024-07-18',
      alasan_reject: 'Dokumen tidak lengkap, silakan tambahkan sertifikat penelitian',
    },
  ])

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const jenisKaryaOptions = [
    { value: 'publikasi', label: 'Publikasi' },
    { value: 'penelitian', label: 'Penelitian' },
    { value: 'pengabdian', label: 'Pengabdian' },
    { value: 'buku', label: 'Buku' },
    { value: 'hki', label: 'HKI' },
    { value: 'prestasi', label: 'Prestasi' },
  ]

  const levelOptions = [
    { value: 'nasional', label: 'Nasional' },
    { value: 'lokal', label: 'Lokal' },
    { value: 'internasional', label: 'Internasional' },
  ]

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target
    if (fileList && fileList[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: fileList[0],
      }))
    }
  }

  const handleAddKarya = () => {
    if (step === 1) {
      if (!formData.judul || !formData.nama_jurnal) {
        alert('Silakan isi judul dan nama jurnal')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!files.file_jurnal) {
        alert('Silakan upload file jurnal')
        return
      }
      setStep(3)
    } else if (step === 3) {
      const newKarya: Karya = {
        id: Math.max(...karyaList.map(k => k.id), 0) + 1,
        judul: formData.judul,
        nama_jurnal: formData.nama_jurnal,
        tahun: formData.tahun,
        level: formData.level_publikasi,
        jenis: formData.jenis_karya,
        status: 'draft',
      }
      setKaryaList([...karyaList, newKarya])
      resetForm()
      setShowForm(false)
      alert('Karya berhasil ditambahkan')
    }
  }

  const handleEditKarya = (id: number) => {
    const karya = karyaList.find(k => k.id === id)
    if (karya && (karya.status === 'draft' || karya.status === 'rejected')) {
      setEditingId(id)
      setFormData({
        ...formData,
        judul: karya.judul,
        nama_jurnal: karya.nama_jurnal,
        tahun: karya.tahun,
        level_publikasi: karya.level.toLowerCase(),
        jenis_karya: karya.jenis.toLowerCase(),
      })
      setShowForm(true)
      setStep(1)
    }
  }

  const handleDeleteClick = (id: number) => {
    setDeleteId(id)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    setKaryaList(karyaList.filter(k => k.id !== deleteId))
    setShowDeleteConfirm(false)
    alert('Karya berhasil dihapus')
  }

  const handleSubmitKarya = (id: number) => {
    setKaryaList(
      karyaList.map(k =>
        k.id === id
          ? { ...k, status: 'submitted' as const, tanggal_submit: new Date().toISOString().split('T')[0] }
          : k
      )
    )
    alert('Karya berhasil disubmit untuk validasi')
  }

  const resetForm = () => {
    setFormData({
      jenis_karya: 'publikasi',
      judul: '',
      nama_jurnal: '',
      judul_publikasi: '',
      volume: '',
      nomor_halaman: '',
      tahun: new Date().getFullYear(),
      penerbit: '',
      level_publikasi: 'nasional',
      doi_link: '',
      deskripsi: '',
    })
    setFiles({
      file_jurnal: null,
      file_pendukung: null,
    })
    setStep(1)
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Karya Saya
          </h1>
          <p className="text-gray-600 mt-2">Kelola karya penelitian, publikasi, atau pengabdian Anda</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={20} />
            Tambah Karya
          </button>
        )}
      </div>

      {/* Form Card */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition ${
                    s <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {s === 1 && 'Data Karya'}
                    {s === 2 && 'Unggah Dokumen'}
                    {s === 3 && 'Konfirmasi'}
                  </p>
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition ${
                      s < step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: Data Karya */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Informasi Publikasi</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Karya *</label>
                <select
                  name="jenis_karya"
                  value={formData.jenis_karya}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {jenisKaryaOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul Karya *</label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Jurnal *</label>
                  <input
                    type="text"
                    name="nama_jurnal"
                    value={formData.nama_jurnal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level Publikasi *</label>
                  <select
                    name="level_publikasi"
                    value={formData.level_publikasi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {levelOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tahun *</label>
                  <select
                    name="tahun"
                    value={formData.tahun}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Penerbit</label>
                  <input
                    type="text"
                    name="penerbit"
                    value={formData.penerbit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DOI / Link</label>
                <input
                  type="url"
                  name="doi_link"
                  value={formData.doi_link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Upload Dokumen */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Unggah Dokumen</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Upload Jurnal / Sertifikat *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition cursor-pointer">
                  <input
                    type="file"
                    name="file_jurnal"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file_jurnal"
                  />
                  <label htmlFor="file_jurnal" className="cursor-pointer">
                    <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-medium text-gray-700">
                      {files.file_jurnal ? files.file_jurnal.name : 'Klik atau drag file ke sini'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">File Pendukung (Opsional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition cursor-pointer">
                  <input
                    type="file"
                    name="file_pendukung"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file_pendukung"
                  />
                  <label htmlFor="file_pendukung" className="cursor-pointer">
                    <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-medium text-gray-700">
                      {files.file_pendukung ? files.file_pendukung.name : 'Klik atau drag file ke sini'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Konfirmasi */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Konfirmasi Data</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Jenis Karya:</span>
                  <span className="text-gray-900">{formData.jenis_karya}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Judul:</span>
                  <span className="text-gray-900 line-clamp-2">{formData.judul}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Nama Jurnal:</span>
                  <span className="text-gray-900">{formData.nama_jurnal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Level:</span>
                  <span className="text-gray-900">{formData.level_publikasi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">File Jurnal:</span>
                  <span className="text-gray-900">{files.file_jurnal?.name || 'Belum upload'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 border-t pt-4">
            <button
              onClick={() => {
                if (step > 1) setStep(step - 1)
                else {
                  resetForm()
                  setShowForm(false)
                }
              }}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <ChevronLeft size={20} />
              {step === 1 ? 'Batal' : 'Sebelumnya'}
            </button>

            {step < 3 ? (
              <button
                onClick={handleAddKarya}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Lanjut
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleAddKarya}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Simpan & Lanjut
              </button>
            )}
          </div>
        </div>
      )}

      {/* Karya List */}
      {!showForm && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Judul</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jenis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Level</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {karyaList.map(karya => (
                  <tr key={karya.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-2">{karya.judul}</p>
                        <p className="text-xs text-gray-500 mt-1">{karya.nama_jurnal}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{karya.jenis}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 capitalize">{karya.level}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[karya.status]}`}>
                        {statusLabel[karya.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* View Detail */}
                        <Link href={`/dashboard/karya-saya/${karya.id}`}>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Eye size={18} />
                          </button>
                        </Link>

                        {/* Edit (hanya draft & rejected) */}
                        {(karya.status === 'draft' || karya.status === 'rejected') && (
                          <button
                            onClick={() => handleEditKarya(karya.id)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          >
                            <Edit size={18} />
                          </button>
                        )}

                        {/* Delete (hanya draft) */}
                        {karya.status === 'draft' && (
                          <button
                            onClick={() => handleDeleteClick(karya.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}

                        {/* Submit (hanya draft & rejected) */}
                        {(karya.status === 'draft' || karya.status === 'rejected') && (
                          <button
                            onClick={() => handleSubmitKarya(karya.id)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {karyaList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada karya</p>
            </div>
          )}
        </div>
      )}

      {/* Reject Reason Display (jika ada) */}
      {!showForm && karyaList.some(k => k.status === 'rejected' && k.alasan_reject) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-bold text-red-900 mb-3">Karya Ditolak</h3>
          {karyaList
            .filter(k => k.status === 'rejected' && k.alasan_reject)
            .map(k => (
              <div key={k.id} className="text-sm text-red-800 mb-2">
                <p><strong>{k.judul}</strong></p>
                <p>Alasan: {k.alasan_reject}</p>
              </div>
            ))}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hapus Karya?</h2>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus karya ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}