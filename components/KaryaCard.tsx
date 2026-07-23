import Link from 'next/link'
import { Karya } from '@/lib/karya'

const categoryIcons: Record<string, string> = {
  Publikasi: '📝',
  Penelitian: '🔬',
  Pengabdian: '🤝',
  Buku: '📚',
  HKI: '⚖️',
  Prestasi: '🏆',
  Artikel: '📰',
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  Publikasi: { bg: 'from-red-400 to-red-600', border: 'border-l-4 border-l-red-600', text: 'text-red-600' },
  Penelitian: { bg: 'from-green-400 to-green-600', border: 'border-l-4 border-l-green-600', text: 'text-green-600' },
  Pengabdian: { bg: 'from-amber-400 to-amber-600', border: 'border-l-4 border-l-amber-600', text: 'text-amber-600' },
  Buku: { bg: 'from-purple-400 to-purple-600', border: 'border-l-4 border-l-purple-600', text: 'text-purple-600' },
  HKI: { bg: 'from-orange-400 to-orange-600', border: 'border-l-4 border-l-orange-600', text: 'text-orange-600' },
  Prestasi: { bg: 'from-yellow-400 to-yellow-600', border: 'border-l-4 border-l-yellow-600', text: 'text-yellow-600' },
  Artikel: { bg: 'from-blue-400 to-blue-600', border: 'border-l-4 border-l-blue-600', text: 'text-blue-600' },
}

interface KaryaCardProps {
  karya: Karya
}

export default function KaryaCard({ karya }: KaryaCardProps) {
  const icon = categoryIcons[karya.kategori] || '📄'
  const colors = categoryColors[karya.kategori] || { bg: 'from-blue-400 to-blue-600', border: 'border-l-4 border-l-blue-600', text: 'text-blue-600' }

  return (
    <Link href={`/karya/${karya.id}`}>
      <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:scale-105 ${colors.border}`}>
        {/* Thumbnail with Gradient */}
        <div className={`aspect-video bg-gradient-to-br ${colors.bg} flex items-center justify-center text-6xl relative overflow-hidden`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Icon */}
          <span className="relative z-10 drop-shadow-lg">{icon}</span>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category Badge */}
          <span className={`inline-block ${colors.text} bg-opacity-10 text-xs font-bold px-3 py-1 rounded-full mb-3 bg-gray-100`}>
            {karya.kategori}
          </span>
          
          {/* Title */}
          <h3 className="font-bold text-gray-900 text-base mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
            {karya.judul}
          </h3>
          
          {/* Divider */}
          <div className="border-t border-gray-100 pt-3">
            {/* Author */}
            <p className="text-gray-700 text-sm font-medium mb-1">{karya.penulis}</p>
            
            {/* Year */}
            <p className="text-gray-500 text-xs">📅 {karya.tahun}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}