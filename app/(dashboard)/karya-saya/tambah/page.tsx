'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Upload, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { karyaAPI } from '@/lib/karya-api'
import { ConfirmModal } from '@/components/ConfirmModal'

interface FormData {
  jenis: string
  judul: string
  nama_jurnal: string
  tahun: number
  doi_link: string
  nama: string
  nip_nim: string
  level: string
  pencapaian: string
  deskripsi: string
}

interface LevelConfig {
  [key: string]: { value: string; label: string }[]
}

const pencapaianConfig: LevelConfig = {
  'Publikasi': [
    { value: 'Q1', label: 'Q1' },
    { value: 'Q2', label: 'Q2' },
    { value: 'Q3', label: 'Q3' },
    { value: 'Q4', label: 'Q4' },
    { value: 'Sinta 1', label: 'Sinta 1' },
    { value: 'Sinta 2', label: 'Sinta 2' },
    { value: 'Sinta 3', label: 'Sinta 3' },
    { value: 'Sinta 4', label: 'Sinta 4' },
    { value: 'Sinta 5', label: 'Sinta 5' },
    { value: 'Sinta 6', label: 'Sinta 6' },
    { value: 'Prosiding', label: 'Prosiding' },
  ],
  'Prestasi': [
    { value: 'Juara 1', label: 'Juara 1' },
    { value: 'Juara 2', label: 'Juara 2' },
    { value: 'Juara 3', label: 'Juara 3' },
    { value: 'Peserta', label: 'Peserta' },
  ],
  'Penelitian': [
    { value: 'Peneliti Utama', label: 'Peneliti Utama' },
    { value: 'Peneliti Anggota', label: 'Peneliti Anggota' },
  ],
  'Pengabdian': [
    { value: 'Nasional', label: 'Nasional' },
    { value: 'Lokal', label: 'Lokal' },
  ],
  'HKI': [
    { value: 'Paten', label: 'Paten' },
    { value: 'Hak Cipta', label: 'Hak Cipta' },
    { value: 'Merek', label: 'Merek' },
  ],
  'Artikel': [
    { value: 'Feature', label: 'Feature' },
    { value: 'Opinion', label: 'Opinion' },
    { value: 'News', label: 'News' },
  ],
}

export default function TambahKaryaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<FormData>({
    jenis: 'Publikasi',
    judul: '',
    nama_jurnal: '',
    tahun: new Date().getFullYear(),
    doi_link: '',
    nama: '',
    nip_nim: '',
    level: '',
    pencapaian: '',
    deskripsi: '',
  })

  const fileKaryaRef = useRef<HTMLInputElement>(null)
  const filePendukungRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState({
    file_karya: null as File | null,
    file_pendukung: null as File | null,
  })

  const [uploadedFilePath, setUploadedFilePath] = useState('')
  const [uploadedPendukungPath, setUploadedPendukungPath] = useState('')
  const [uploading, setUploading] = useState(false)

  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  })

  const jenisOptions = ['Publikasi', 'Prestasi', 'Penelitian', 'Pengabdian', 'HKI', 'Artikel']
  const levelOptions = ['International', 'National', 'Local']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'jenis') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        pencapaian: '',
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'tahun' ? parseInt(value) : value,
      }))
    }
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

  const uploadFileToServer = async () => {
    const fileKaryaInput = fileKaryaRef.current
    const filePendukungInput = filePendukungRef.current

    if (!fileKaryaInput || !fileKaryaInput.files || fileKaryaInput.files.length === 0) {
      setError('File Karya wajib diupload')
      return false
    }

    try {
      setUploading(true)
      setError('')

      // Upload File Karya
      const formDataKarya = new FormData()
      formDataKarya.append('file', fileKaryaInput.files[0])
      const responseKarya = await karyaAPI.uploadFile(formDataKarya)
      setUploadedFilePath(responseKarya.file_path || responseKarya.data.file_path)

      // Upload File Pendukung (jika ada)
      if (filePendukungInput && filePendukungInput.files && filePendukungInput.files.length > 0) {
        try {
          const formDataPendukung = new FormData()
          formDataPendukung.append('file', filePendukungInput.files[0])
          const responsePendukung = await karyaAPI.uploadFile(formDataPendukung)
          console.log('Pendukung response:', responsePendukung)
          const pendukungPath = responsePendukung?.file_path || responsePendukung?.data?.file_path
          if (pendukungPath) {
            setUploadedPendukungPath(pendukungPath)
            console.log('Pendukung path saved:', pendukungPath)
          }
        } catch (err: any) {
          console.error('Pendukung upload error:', err)
          // Lanjut meski pendukung gagal (file pendukung optional)
        }
      }

      setUploading(false)
      return true
    } catch (err: any) {
      setError('Gagal upload file: ' + (err?.response?.data?.message || err.message))
      setUploading(false)
      return false
    }
  }

  const validateStep = () => {
    if (step === 1) {
      if (!formData.jenis || !formData.judul || !formData.nama_jurnal || !formData.tahun || !formData.nama || !formData.nip_nim || !formData.level || !formData.pencapaian) {
        setError('Silakan isi semua field yang wajib')
        return false
      }
      setError('')
      return true
    } else if (step === 2) {
      const fileInput = fileKaryaRef.current
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        setError('File Karya wajib diupload')
        return false
      }
      setError('')
      return true
    }
    return true
  }

  const handleNext = async () => {
    if (!validateStep()) return

    // Jika di Step 2, upload file ke server dulu
    if (step === 2) {
      const uploaded = await uploadFileToServer()
      if (!uploaded) return
    }

    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!uploadedFilePath) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'File belum terupload dengan benar',
      })
      return
    }

    try {
      setLoading(true)
      setError('')

      const submitData = {
        judul: formData.judul,
        jenis: formData.jenis,
        level: formData.level,
        pencapaian: formData.pencapaian,
        tahun: formData.tahun,
        deskripsi: formData.deskripsi,
        file_path: uploadedFilePath,
        file_pendukung_path: uploadedPendukungPath || null,
      }

      console.log('Submitting data:', submitData)
      await karyaAPI.createWithPath(submitData)
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: 'Karya berhasil ditambahkan!',
      })
      setLoading(false)
      setTimeout(() => router.push('/karya-saya'), 1500)
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message || 'Gagal menambahkan karya',
      })
      console.error('Error:', err)
      setLoading(false)
    }
  }

  const getPencapaianOptions = () => {
    return pencapaianConfig[formData.jenis] || []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Tambah Karya Baru
          </h1>
          <p className="text-gray-800 mb-8">Isi form di bawah untuk menambahkan karya Anda</p>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition ${
                    s <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {s}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {s === 1 && 'Data Karya'}
                    {s === 2 && 'Upload File'}
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

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* STEP 1: Data Karya */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Row 1: Jenis & Judul */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Jenis Karya *</label>
                  <select
                    name="jenis"
                    value={formData.jenis}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black bg-white"
                  >
                    {jenisOptions.map(opt => (
                      <option key={opt} value={opt} className="text-black bg-white">{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Judul Karya *</label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
              </div>

              {/* Row 2: Nama Jurnal */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Nama Jurnal / Kegiatan *</label>
                <input
                  type="text"
                  name="nama_jurnal"
                  value={formData.nama_jurnal}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama jurnal atau kegiatan..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>

              {/* Row 3: Tahun & DOI */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Tahun *</label>
                  <select
                    name="tahun"
                    value={formData.tahun}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">DOI Link</label>
                  <input
                    type="text"
                    name="doi_link"
                    value={formData.doi_link}
                    onChange={handleInputChange}
                    placeholder="https://doi.org/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
              </div>

              {/* Row 4: Nama & NIP/NIM */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Nama *</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Nama lengkap..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">NIP / NIM *</label>
                  <input
                    type="text"
                    name="nip_nim"
                    value={formData.nip_nim}
                    onChange={handleInputChange}
                    placeholder="Masukkan NIP atau NIM..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
              </div>

              {/* Row 5: Level & Pencapaian */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black bg-white"
                  >
                    <option value="" className="text-black bg-white">Pilih level...</option>
                    {levelOptions.map(opt => (
                      <option key={opt} value={opt} className="text-black bg-white">{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Pencapaian *</label>
                  <select
                    name="pencapaian"
                    value={formData.pencapaian}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black bg-white"
                  >
                    <option value="" className="text-black bg-white">Pilih pencapaian...</option>
                    {getPencapaianOptions().map(opt => (
                      <option key={opt.value} value={opt.value} className="text-black bg-white">{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Deskripsi singkat tentang karya Anda..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Upload File */}
          {step === 2 && (
            <div className="space-y-6">
              {/* File Karya */}
              <div>
                <label className="block text-sm font-medium text-black mb-4">File Karya *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition cursor-pointer">
                  <input
                    ref={fileKaryaRef}
                    type="file"
                    name="file_karya"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file_karya"
                  />
                  <label htmlFor="file_karya" className="cursor-pointer">
                    <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-medium text-black">
                      {files.file_karya ? files.file_karya.name : 'Klik atau drag file ke sini'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                  </label>
                </div>
              </div>

              {/* File Pendukung */}
              <div>
                <label className="block text-sm font-medium text-black mb-4">File Pendukung (Opsional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition cursor-pointer">
                  <input
                    ref={filePendukungRef}
                    type="file"
                    name="file_pendukung"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file_pendukung"
                  />
                  <label htmlFor="file_pendukung" className="cursor-pointer">
                    <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-medium text-black">
                      {files.file_pendukung ? files.file_pendukung.name : 'Klik atau drag file ke sini'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (Max 10MB)</p>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Konfirmasi */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Review Data Anda</h2>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-800">Jenis Karya</p>
                    <p className="font-semibold text-gray-900">{formData.jenis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Tahun</p>
                    <p className="font-semibold text-gray-900">{formData.tahun}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-800">Judul Karya</p>
                  <p className="font-semibold text-gray-900">{formData.judul}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-800">Nama Jurnal / Kegiatan</p>
                  <p className="font-semibold text-gray-900">{formData.nama_jurnal}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-800">Nama</p>
                    <p className="font-semibold text-gray-900">{formData.nama}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">NIP / NIM</p>
                    <p className="font-semibold text-gray-900">{formData.nip_nim}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-800">Level</p>
                    <p className="font-semibold text-gray-900">{formData.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Pencapaian</p>
                    <p className="font-semibold text-gray-900">{formData.pencapaian || '-'}</p>
                  </div>
                </div>

                {formData.doi_link && (
                  <div>
                    <p className="text-sm text-gray-800">DOI Link</p>
                    <p className="font-semibold text-gray-900">{formData.doi_link}</p>
                  </div>
                )}

                {formData.deskripsi && (
                  <div>
                    <p className="text-sm text-gray-800">Deskripsi</p>
                    <p className="font-semibold text-gray-900">{formData.deskripsi}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-800">File Karya</p>
                  <p className="font-semibold text-gray-900">{files.file_karya?.name || 'Tidak ada'}</p>
                </div>

                {files.file_pendukung && (
                  <div>
                    <p className="text-sm text-gray-800">File Pendukung</p>
                    <p className="font-semibold text-gray-900">{files.file_pendukung.name}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 text-xs text-gray-600">
                  <p>File Karya Path: {uploadedFilePath ? '✓ Terupload' : '✗ Belum'}</p>
                  <p>File Pendukung Path: {uploadedPendukungPath ? '✓ Terupload' : '○ Opsional'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 border-t pt-8 mt-8">
            <button
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1)
                  setError('')
                } else {
                  router.back()
                }
              }}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition"
            >
              <ChevronLeft size={20} />
              {step === 1 ? 'Batal' : 'Sebelumnya'}
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Lanjut
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Karya'}
              </button>
            )}
          </div>
        </div>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={modal.isOpen}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          confirmText="OK"
          cancelText="Tutup"
          onConfirm={() => {
            setModal({ ...modal, isOpen: false })
            if (modal.type === 'success') {
              router.push('/karya-saya')
            }
          }}
          onCancel={() => setModal({ ...modal, isOpen: false })}
        />
      </div>
    </div>
  )
}
