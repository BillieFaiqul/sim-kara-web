'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Eye, X, AlertCircle } from 'lucide-react'
import { karyaAPI, type Karya } from '@/lib/karya-api'

export default function DetailKaryaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [karya, setKarya] = useState<Karya | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFileViewer, setShowFileViewer] = useState(false)
  const [fileError, setFileError] = useState('')

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !karya) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{karya.judul}</h1>
                <div className="flex items-center gap-4 flex-wrap">
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
            </div>
          </div>

          {/* Author Info */}
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pembuat</p>
                <p className="text-lg font-semibold text-gray-900">{karya.user?.name}</p>
                <p className="text-sm text-gray-600 mt-1">{karya.user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tahun</p>
                <p className="text-lg font-semibold text-gray-900">{karya.tahun}</p>
                {karya.tanggal_submit && (
                  <p className="text-sm text-gray-600 mt-1">Disubmit: {new Date(karya.tanggal_submit).toLocaleDateString('id-ID')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {karya.deskripsi && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{karya.deskripsi}</p>
            </div>
          )}

          {/* Rejection Reason */}
          {karya.status === 'rejected' && karya.alasan_reject && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Alasan Penolakan</h3>
              <p className="text-red-700">{karya.alasan_reject}</p>
            </div>
          )}

          {/* Files Section */}
          {(karya.file_path) && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">File Pendukung</h2>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-medium text-gray-900">File Karya</p>
                    <p className="text-sm text-gray-600">{karya.file_path.split('/').pop()}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => setShowFileViewer(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      title="Lihat file di web"
                    >
                      <Eye size={18} />
                      Lihat
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => {
                        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
                        if (!token) {
                          alert('Silakan login terlebih dahulu untuk mendownload file')
                          return
                        }
                        window.location.href = `http://localhost:8000/api/karya/${karya.id}/download`
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      title="Download file"
                    >
                      <Download size={18} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* File Viewer Modal */}
          {showFileViewer && karya.file_path && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {karya.file_path.split('/').pop()}
                  </h3>
                  <button
                    onClick={() => {
                      setShowFileViewer(false)
                      setFileError('')
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* File Content */}
                <div className="flex-1 overflow-auto bg-gray-50 p-4">
                  {fileError ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <AlertCircle className="text-red-500 mb-2" size={48} />
                      <p className="text-red-600 text-center">{fileError}</p>
                      <button
                        onClick={() => {
                          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
                          if (token) {
                            window.location.href = `http://localhost:8000/api/karya/${karya.id}/download`
                          }
                        }}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Download File
                      </button>
                    </div>
                  ) : (
                    <FileViewer
                      filePath={karya.file_path}
                      fileName={karya.file_path.split('/').pop() || ''}
                      onError={setFileError}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p>ID: {karya.id}</p>
            <p>Dibuat: {new Date(karya.created_at).toLocaleDateString('id-ID')}</p>
            <p>Diupdate: {new Date(karya.updated_at).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FileViewerProps {
  filePath: string
  fileName: string
  onError: (error: string) => void
}

function FileViewer({ filePath, fileName, onError }: FileViewerProps) {
  const [loading, setLoading] = useState(true)

  const getFileType = () => {
    const ext = fileName.toLowerCase().split('.').pop() || ''
    if (['pdf'].includes(ext)) return 'pdf'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
    if (['txt', 'md', 'log'].includes(ext)) return 'text'
    return 'other'
  }

  const fileType = getFileType()
  const fileUrl = `http://localhost:8000/storage/${filePath}`

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
  }

  switch (fileType) {
    case 'pdf':
      return (
        <iframe
          src={`${fileUrl}#toolbar=0`}
          className="w-full h-full"
          onError={() => onError('Tidak bisa membuka file PDF di browser. Silakan download untuk membukanya.')}
        />
      )

    case 'image':
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain"
            onError={() => onError('Tidak bisa memuat gambar. File mungkin tidak ada atau format tidak didukung.')}
          />
        </div>
      )

    case 'text':
      return (
        <div className="w-full h-full">
          <TextFileViewer fileUrl={fileUrl} onError={onError} />
        </div>
      )

    default:
      onError(`Format file tidak didukung untuk viewing (.${fileName.split('.').pop()}). Silakan download untuk membukanya.`)
      return null
  }
}

interface TextFileViewerProps {
  fileUrl: string
  onError: (error: string) => void
}

function TextFileViewer({ fileUrl, onError }: TextFileViewerProps) {
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch(fileUrl)
      .then((res) => res.text())
      .then(setContent)
      .catch(() => onError('Tidak bisa membaca file teks'))
  }, [fileUrl, onError])

  return (
    <pre className="bg-white p-4 rounded overflow-auto h-full text-xs text-gray-800 font-mono">
      {content}
    </pre>
  )
}
