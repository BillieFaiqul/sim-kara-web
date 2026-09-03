'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle, Loader, Download } from 'lucide-react'
import { karyaAPI, type Karya } from '@/lib/karya-api'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function DetailKaryaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [karya, setKarya] = useState<Karya | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal states
  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'error' | 'success'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  })

  useEffect(() => {
    loadKarya()
  }, [id])

  const loadKarya = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await karyaAPI.getById(parseInt(id))
      setKarya(response.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat detail karya')
      console.error('Error:', err)
    } finally {
      setLoading(false)
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

  const handleDownload = (fileType: 'karya' | 'pendukung') => {
    if (!karya) return

    const filePath = fileType === 'karya' ? karya.file_path : karya.file_pendukung_path
    if (!filePath) return

    const fileName = filePath.split('/').pop() || 'file'
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    if (!token) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Login Diperlukan',
        message: 'Silakan login terlebih dahulu untuk mendownload file',
      })
      return
    }

    // Download file langsung dari storage
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sim-kara-backend.onrender.com/api'
    const baseUrl = apiUrl.replace('/api', '')
    const downloadUrl = filePath.startsWith('http') ? filePath : `${baseUrl}/storage/${filePath}`
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="animate-spin text-blue-600" />
            <p className="ml-3 text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !karya) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex gap-3">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p>{error || 'Karya tidak ditemukan'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{karya.judul}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {karya.jenis}
                  </span>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {karya.level}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColor[karya.status]}`}>
                    {statusLabel[karya.status]}
                  </span>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Jenis</p>
                  <p className="font-semibold text-gray-900">{karya.jenis}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="font-semibold text-gray-900">{karya.level}</p>
                </div>

                {karya.pencapaian && (
                  <div>
                    <p className="text-sm text-gray-600">Pencapaian</p>
                    <p className="font-semibold text-gray-900">{karya.pencapaian}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Tahun</p>
                  <p className="font-semibold text-gray-900">{karya.tahun}</p>
                </div>

                {karya.nama && (
                  <div>
                    <p className="text-sm text-gray-600">Pembuat</p>
                    <p className="font-semibold text-gray-900">{karya.nama}</p>
                  </div>
                )}

                {karya.nip_nim && (
                  <div>
                    <p className="text-sm text-gray-600">NIP/NIM</p>
                    <p className="font-semibold text-gray-900">{karya.nip_nim}</p>
                  </div>
                )}

                {karya.deskripsi && (
                  <div>
                    <p className="text-sm text-gray-600">Deskripsi</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{karya.deskripsi}</p>
                  </div>
                )}

                {karya.status === 'rejected' && karya.alasan_reject && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm font-semibold text-red-800 mb-1">Alasan Penolakan</p>
                    <p className="text-sm text-red-700">{karya.alasan_reject}</p>
                  </div>
                )}
              </div>

              <hr className="border-gray-200" />

              {/* Metadata */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>ID: {karya.id}</p>
                <p>Dibuat: {new Date(karya.created_at).toLocaleDateString('id-ID')}</p>
                <p>Diupdate: {new Date(karya.updated_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* Right Side: File Preview */}
          <div className="lg:col-span-2 space-y-4">
            {/* File Karya */}
            {karya.file_path && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-blue-600 text-white px-4 py-3 font-semibold flex items-center justify-between">
                  <span>📄 File Karya</span>
                  <button
                    onClick={() => handleDownload('karya')}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded transition text-sm"
                    title="Download File Karya"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
                <div className="h-96 overflow-auto bg-gray-50">
                  <FilePreview filePath={karya.file_path} fileName={karya.file_path.split('/').pop() || ''} />
                </div>
              </div>
            )}

            {/* File Pendukung */}
            {karya.file_pendukung_path && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-green-600 text-white px-4 py-3 font-semibold flex items-center justify-between">
                  <span>📎 File Pendukung</span>
                  <button
                    onClick={() => handleDownload('pendukung')}
                    className="flex items-center gap-2 px-3 py-1 bg-green-700 hover:bg-green-800 rounded transition text-sm"
                    title="Download File Pendukung"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
                <div className="h-96 overflow-auto bg-gray-50">
                  <FilePreview filePath={karya.file_pendukung_path} fileName={karya.file_pendukung_path.split('/').pop() || ''} />
                </div>
              </div>
            )}

            {!karya.file_path && !karya.file_pendukung_path && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Tidak ada file yang diupload</p>
              </div>
            )}
          </div>
        </div>

        {/* Alert Modal */}
        <ConfirmModal
          isOpen={modal.isOpen}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          confirmText="OK"
          cancelText="Tutup"
          onConfirm={() => setModal({ ...modal, isOpen: false })}
          onCancel={() => setModal({ ...modal, isOpen: false })}
        />
      </div>
    </div>
  )
}

interface FilePreviewProps {
  filePath: string
  fileName: string
}

function FilePreview({ filePath, fileName }: FilePreviewProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getFileType = () => {
    const ext = fileName.toLowerCase().split('.').pop() || ''
    if (['pdf'].includes(ext)) return 'pdf'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image'
    if (['txt', 'md', 'log'].includes(ext)) return 'text'
    return 'other'
  }

  const fileType = getFileType()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sim-kara-backend.onrender.com/api'
  const fileUrl = filePath.startsWith('http') ? filePath : `${apiUrl.replace('/api', '')}/storage/${filePath}`

  useEffect(() => {
    setLoading(false)
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-2" size={48} />
          <p className="text-red-600 text-sm mb-2">{error}</p>
          <a
            href={fileUrl}
            download
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Download file
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size={24} className="animate-spin text-blue-600" />
      </div>
    )
  }

  if (fileType === 'pdf') {
    return (
      <iframe
        src={`${fileUrl}#toolbar=0`}
        className="w-full h-full"
        onError={() => setError('Tidak bisa membuka PDF. Coba download.')}
      />
    )
  }

  if (fileType === 'image') {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-full object-contain"
          onError={() => setError('Tidak bisa membuka gambar')}
        />
      </div>
    )
  }

  if (fileType === 'text') {
    return <TextPreview fileUrl={fileUrl} fileName={fileName} onError={setError} />
  }

  return (
    <div className="flex items-center justify-center h-full p-6">
      <p className="text-gray-500">Format file tidak bisa dipreview</p>
    </div>
  )
}

interface TextPreviewProps {
  fileUrl: string
  fileName: string
  onError: (msg: string) => void
}

function TextPreview({ fileUrl, fileName, onError }: TextPreviewProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(fileUrl)
      .then((res) => res.text())
      .then(setContent)
      .catch(() => onError('Tidak bisa membaca file'))
      .finally(() => setLoading(false))
  }, [fileUrl, onError])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size={24} className="animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <pre className="p-4 text-xs text-gray-800 font-mono whitespace-pre-wrap break-words">
      {content}
    </pre>
  )
}
