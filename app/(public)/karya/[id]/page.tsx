'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { karyaAPI, type Karya } from '@/lib/karya-api'

export default function PublicKaryaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [karya, setKarya] = useState<Karya | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadKarya()
  }, [id])

  const loadKarya = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await karyaAPI.getById(parseInt(id))

      // Only allow viewing verified karya in public page
      if (response.data.status !== 'verified') {
        setError('Karya ini tidak tersedia untuk umum')
        setKarya(null)
      } else {
        setKarya(response.data)
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat detail karya')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/karya"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Kembali ke Etalase Karya
          </Link>
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
          <Link
            href="/karya"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Kembali ke Etalase Karya
          </Link>
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
        <Link
          href="/karya"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Kembali ke Etalase Karya
        </Link>

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
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ✓ Verified
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
                <p className="text-sm text-gray-600 mt-1 capitalize">{karya.user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tahun</p>
                <p className="text-lg font-semibold text-gray-900">{karya.tahun}</p>
                {karya.tanggal_submit && (
                  <p className="text-sm text-gray-600 mt-1">Diverifikasi: {new Date(karya.tanggal_submit).toLocaleDateString('id-ID')}</p>
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

          {/* Login Prompt for Download */}
          {karya.file_path && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                Silakan <Link href="/login" className="font-semibold underline hover:no-underline">login</Link> untuk mendownload file pendukung
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p>ID: {karya.id}</p>
            <p>Dipublikasikan: {new Date(karya.created_at).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
