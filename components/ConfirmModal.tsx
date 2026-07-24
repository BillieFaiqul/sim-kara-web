'use client'

import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  type?: 'confirm' | 'success' | 'error' | 'info'
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  destructive?: boolean
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  type = 'confirm',
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  loading = false,
  destructive = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  const iconColor = {
    confirm: 'text-blue-600',
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }

  const confirmButtonColor = {
    confirm: destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={48} className={iconColor[type]} />
      case 'error':
        return <AlertCircle size={48} className={iconColor[type]} />
      case 'info':
        return <Info size={48} className={iconColor[type]} />
      default:
        return <AlertCircle size={48} className={iconColor[type]} />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Icon & Message */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">{getIcon()}</div>
          <p className="text-gray-600 text-center text-sm">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition disabled:opacity-50 font-medium ${confirmButtonColor[type]}`}
          >
            {loading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
