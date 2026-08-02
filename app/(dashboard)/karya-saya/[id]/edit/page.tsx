'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Upload, ArrowLeft, Loader } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { karyaAPI, type Karya } from '@/lib/karya-api'
import { ConfirmModal } from '@/components/ConfirmModal'

interface FormData {
  judul: string
  jenis: string
  tahun: number
  level: string
  pencapaian: string
  deskripsi: string
  nama?: string
  nip_nim?: string
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

export default function EditKaryaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [karya, setKarya] = useState<Karya | null>(null)

  const [formData, setFormData] = useState<FormData>({
    judul: '',
    jenis: 'Publikasi',
    tahun: new Date().getFullYear(),
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

  useEffect(() => {
    loadKarya()
  }, [id])

  const loadKarya = async () => {
    try {
      setLoading(true)
      const response = await karyaAPI.getById(parseInt(id))
      const data = response.data

      if (data.status !== 'draft' && data.status !== 'rejected') {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Error',
          message: 'Hanya karya dengan status draft atau rejected yang bisa diedit',
        })
        return
      }

      setKarya(data)
      setFormData({
        judul: data.judul,
        jenis: data.jenis,
        tahun: data.tahun,
        level: data.level,
        pencapaian: data.pencapaian || '',
        deskripsi: data.deskripsi || '',
        nama: data.nama || '',
        nip_nim: data.nip_nim || '',
      })
      setUploadedFilePath(data.file_path || '')
      setUploadedPendukungPath(data.file_pendukung_path || '')
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message || 'Gagal memuat karya',
      })
    } finally {
      setLoading(false)
    }
  }

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

    try {
      setUploading(true)

      // Upload File Karya jika ada file baru
      if (fileKaryaInput && fileKaryaInput.files && fileKaryaInput.files.length > 0) {
        const formDataKarya = new FormData()
        formDataKarya.append('file', fileKaryaInput.files[0])
        const responseKarya = await karyaAPI.uploadFile(formDataKarya)
        setUploadedFilePath(responseKarya.file_path)
      }

      // Upload File Pendukung jika ada file baru
      if (filePendukungInput && filePendukungInput.files && filePendukungInput.files.length > 0) {
        const formDataPendukung = new FormData()
        formDataPendukung.append('file', filePendukungInput.files[0])
        const responsePendukung = await karyaAPI.uploadFile(formDataPendukung)
        setUploadedPendukungPath(responsePendukung.file_path)
      }

      setUploading(false)
      return true
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Gagal upload file: ' + (err?.response?.data?.message || err.message),
      })
      setUploading(false)
      return false
    }
  }

  const validateStep = () => {
    if (step === 1) {
      if (!formData.jenis || !formData.judul || !formData.tahun || !formData.level || !formData.pencapaian) {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Error',
          message: 'Silakan isi semua field yang wajib',
        })
        return false
      }
      return true
    }
    return true
  }

  const handleNext = async () => {
    if (!validateStep()) return

    if (step === 2) {
      const uploaded = await uploadFileToServer()
      if (!uploaded) return
    }

    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!karya) return

    try {
      setActionLoading(true)

      const submitData: any = {
        judul: formData.judul,
        jenis: formData.jenis,
        level: formData.level,
        pencapaian: formData.pencapaian,
        tahun: formData.tahun,
        deskripsi: formData.deskripsi,
        nama: formData.nama,
        nip_nim: formData.nip_nim,
        file_path: uploadedFilePath || undefined,
        file_pendukung_path: uploadedPendukungPath || undefined,
      }

      // Jika karya di-reject, reset ke draft saat diedit
      if (karya.status === 'rejected') {
        submitData.status = 'draft'
      }

      await karyaAPI.update(karya.id, submitData)
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: karya.status === 'rejected'
          ? 'Karya berhasil diupdate dan kembali ke status Draft. Silakan submit kembali untuk validasi.'
          : 'Karya berhasil diupdate',
      })
      setTimeout(() => router.push('/karya-saya'), 1500)
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message || 'Gagal mengupdate karya',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const getPencapaianOptions = () => {
    return pencapaianConfig[formData.jenis] || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Edit Karya
          </h1>
          <p className="text-gray-800 mb-8">Update karya Anda</p>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
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

          {/* STEP 1: Data Karya */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Jenis Karya *</label>
                  <select
                    name="jenis"
                    value={formData.jenis}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  >
                    {jenisOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Nama Pembuat</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Nama penulis/pembuat karya"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">NIP/NIM</label>
                  <input
                    type="text"
                    name="nip_nim"
                    value={formData.nip_nim}
                    onChange={handleInputChange}
                    placeholder="NIP atau NIM penulis"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  >
                    <option value="">Pilih level...</option>
                    {levelOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Pencapaian *</label>
                  <select
                    name="pencapaian"
                    value={formData.pencapaian}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  >
                    <option value="">Pilih pencapaian...</option>
                    {getPencapaianOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Upload File */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-4">File Karya (Ganti file?)</label>
                {uploadedFilePath && (
                  <p className="text-sm text-gray-600 mb-2">File saat ini: {uploadedFilePath.split('/').pop()}</p>
                )}
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
                      {files.file_karya ? files.file_karya.name : 'Klik untuk ganti file'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-4">File Pendukung (Opsional - Ganti file?)</label>
                {uploadedPendukungPath && (
                  <p className="text-sm text-gray-600 mb-2">File saat ini: {uploadedPendukungPath.split('/').pop()}</p>
                )}
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
                      {files.file_pendukung ? files.file_pendukung.name : 'Klik untuk ganti file'}
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
                  <p className="text-sm text-gray-800">Judul</p>
                  <p className="font-semibold text-gray-900">{formData.judul}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-800">Nama Pembuat</p>
                    <p className="font-semibold text-gray-900">{formData.nama || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">NIP/NIM</p>
                    <p className="font-semibold text-gray-900">{formData.nip_nim || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-800">Level</p>
                    <p className="font-semibold text-gray-900">{formData.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Pencapaian</p>
                    <p className="font-semibold text-gray-900">{formData.pencapaian}</p>
                  </div>
                </div>

                {formData.deskripsi && (
                  <div>
                    <p className="text-sm text-gray-800">Deskripsi</p>
                    <p className="font-semibold text-gray-900">{formData.deskripsi}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                  <p>File Karya: {uploadedFilePath ? '✓ Ada' : '✗ Belum'}</p>
                  <p>File Pendukung: {uploadedPendukungPath ? '✓ Ada' : '○ Opsional'}</p>
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
                } else {
                  router.back()
                }
              }}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
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
                disabled={actionLoading}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {actionLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            )}
          </div>
        </div>

        {/* Modal */}
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
