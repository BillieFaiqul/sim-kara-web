'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, X, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react'
import { userAPI, User } from '@/lib/user-api'

interface FormData {
  name: string
  email: string
  nip_nim: string
  role: 'admin' | 'dosen' | 'mahasiswa'
  password?: string
  is_active: boolean
}

interface FormErrors {
  [key: string]: string[]
}

export default function KolaUserPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'semua' | 'admin' | 'dosen' | 'mahasiswa'>('semua')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showAddPassword, setShowAddPassword] = useState(false)
  const [showChangePasswordNew, setShowChangePasswordNew] = useState(false)
  const [showChangePasswordConfirm, setShowChangePasswordConfirm] = useState(false)

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    nip_nim: '',
    role: 'mahasiswa',
    password: '',
    is_active: true,
  })

  // Fetch users
  useEffect(() => {
    fetchUsers()
  }, [search, filter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await userAPI.getAll({
        search: search || undefined,
        role: filter === 'semua' ? undefined : filter,
      })
      setUsers(response.data)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengambil data user'
      setError(message)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }


  // Handle Add
  const handleAddClick = () => {
    setFormData({
      name: '',
      email: '',
      nip_nim: '',
      role: 'mahasiswa',
      password: '',
      is_active: true,
    })
    setError(null)
    setFormErrors({})
    setShowAddPassword(false)
    setShowAddModal(true)
  }

  const handleAddSubmit = async () => {
    if (!formData.name || !formData.email || !formData.nip_nim || !formData.password) {
      setError('Semua field harus diisi')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      setFormErrors({})
      await userAPI.create({
        name: formData.name,
        email: formData.email,
        nip_nim: formData.nip_nim,
        password: formData.password,
        role: formData.role,
        is_active: formData.is_active,
      })
      setShowAddModal(false)
      setError(null)
      setFormErrors({})
      await fetchUsers()
    } catch (err: any) {
      const errorData = err.response?.data
      if (errorData?.errors) {
        setFormErrors(errorData.errors)
        const firstError = Object.values(errorData.errors)[0]
        setError(Array.isArray(firstError) ? firstError[0] : 'Gagal menambahkan user')
      } else {
        const message = errorData?.message || 'Gagal menambahkan user'
        setError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Edit
  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      nip_nim: user.nip_nim,
      role: user.role,
      password: '',
      is_active: user.is_active,
    })
    setError(null)
    setFormErrors({})
    setShowEditModal(true)
  }

  const handleEditSubmit = async () => {
    if (!formData.name || !formData.email || !formData.nip_nim) {
      setError('Semua field harus diisi')
      return
    }

    if (!selectedUser) return

    try {
      setSubmitting(true)
      setError(null)
      setFormErrors({})
      await userAPI.update(selectedUser.id, {
        name: formData.name,
        email: formData.email,
        nip_nim: formData.nip_nim,
        role: formData.role,
        is_active: formData.is_active,
      })
      setShowEditModal(false)
      setError(null)
      setFormErrors({})
      await fetchUsers()
    } catch (err: any) {
      const errorData = err.response?.data
      if (errorData?.errors) {
        setFormErrors(errorData.errors)
        const firstError = Object.values(errorData.errors)[0]
        setError(Array.isArray(firstError) ? firstError[0] : 'Gagal mengupdate user')
      } else {
        const message = errorData?.message || 'Gagal mengupdate user'
        setError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return

    try {
      setSubmitting(true)
      await userAPI.delete(selectedUser.id)
      setShowDeleteConfirm(false)
      setError(null)
      await fetchUsers()
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menghapus user'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangePasswordClick = (user: User) => {
    setSelectedUser(user)
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
    setFormErrors({})
    setShowChangePasswordNew(false)
    setShowChangePasswordConfirm(false)
    setShowChangePasswordModal(true)
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Password dan konfirmasi password harus diisi')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok')
      return
    }

    if (newPassword.length < 8) {
      setError('Password minimal 8 karakter')
      return
    }

    if (!selectedUser) return

    try {
      setSubmitting(true)
      setError(null)
      setFormErrors({})
      await userAPI.update(selectedUser.id, {
        password: newPassword,
      })
      setShowChangePasswordModal(false)
      setNewPassword('')
      setConfirmPassword('')
      setError(null)
      await fetchUsers()
    } catch (err: any) {
      const errorData = err.response?.data
      if (errorData?.errors) {
        setFormErrors(errorData.errors)
        const firstError = Object.values(errorData.errors)[0]
        setError(Array.isArray(firstError) ? firstError[0] : 'Gagal mengubah password')
      } else {
        const message = errorData?.message || 'Gagal mengubah password'
        setError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const roleLabel = {
    admin: { label: 'Admin', color: 'bg-purple-100 text-purple-800' },
    dosen: { label: 'Dosen', color: 'bg-blue-100 text-blue-800' },
    mahasiswa: { label: 'Mahasiswa', color: 'bg-green-100 text-green-800' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Kelola User
          </h1>
          <p className="text-gray-600 mt-2">Kelola semua pengguna sistem</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={20} />
          Tambah User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama, email, atau NIP/NIM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['semua', 'admin', 'dosen', 'mahasiswa'].map(role => (
            <button
              key={role}
              onClick={() => setFilter(role as any)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                filter === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role === 'semua' ? 'Semua' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader className="animate-spin text-blue-600" size={32} />
              <p className="text-gray-600">Memuat data user...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">NIP/NIM</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{user.nip_nim}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleLabel[user.role].color}`}>
                      {roleLabel[user.role].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {/* Edit */}
                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="Edit user"
                      >
                        <Edit size={18} />
                      </button>
                      {/* Change Password */}
                      <button
                        onClick={() => handleChangePasswordClick(user)}
                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Ubah password"
                      >
                        Ubah Password
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus user"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada user yang sesuai</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Tambah User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    formErrors.name ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name[0]}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    formErrors.email ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="nama@email.com"
                />
                {formErrors.email && <p className="text-sm text-red-600 mt-1">{formErrors.email[0]}</p>}
              </div>

              {/* NIP/NIM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP/NIM *</label>
                <input
                  type="text"
                  value={formData.nip_nim || ''}
                  onChange={(e) => setFormData({ ...formData, nip_nim: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    formErrors.nip_nim ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Nomor Induk Pegawai/Mahasiswa"
                />
                {formErrors.nip_nim && <p className="text-sm text-red-600 mt-1">{formErrors.nip_nim[0]}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role || 'mahasiswa'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    formErrors.role ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                  <option value="admin">Admin</option>
                </select>
                {formErrors.role && <p className="text-sm text-red-600 mt-1">{formErrors.role[0]}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 pr-10 ${
                      formErrors.password ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                    }`}
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showAddPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formErrors.password && <p className="text-sm text-red-600 mt-1">{formErrors.password[0]}</p>}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Aktifkan User
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Menambah...
                  </>
                ) : (
                  'Tambah'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    formErrors.name ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name[0]}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    formErrors.email ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="nama@email.com"
                />
                {formErrors.email && <p className="text-sm text-red-600 mt-1">{formErrors.email[0]}</p>}
              </div>

              {/* NIP/NIM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP/NIM *</label>
                <input
                  type="text"
                  value={formData.nip_nim || ''}
                  onChange={(e) => setFormData({ ...formData, nip_nim: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    formErrors.nip_nim ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Nomor Induk Pegawai/Mahasiswa"
                />
                {formErrors.nip_nim && <p className="text-sm text-red-600 mt-1">{formErrors.nip_nim[0]}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role || 'mahasiswa'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    formErrors.role ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                  }`}
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                  <option value="admin">Admin</option>
                </select>
                {formErrors.role && <p className="text-sm text-red-600 mt-1">{formErrors.role[0]}</p>}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="edit_is_active" className="text-sm text-gray-700">
                  Aktifkan User
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Mengupdate...
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Hapus User?</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus user <strong>{selectedUser.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  'Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showChangePasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Ubah Password</h2>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">Mengubah password untuk: <strong>{selectedUser.name}</strong></p>

            <div className="space-y-4">
              {/* Password Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru *</label>
                <div className="relative">
                  <input
                    type={showChangePasswordNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 pr-10 ${
                      formErrors.password ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                    }`}
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordNew(!showChangePasswordNew)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showChangePasswordNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formErrors.password && <p className="text-sm text-red-600 mt-1">{formErrors.password[0]}</p>}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password *</label>
                <div className="relative">
                  <input
                    type={showChangePasswordConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 pr-10"
                    placeholder="Ulangi password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordConfirm(!showChangePasswordConfirm)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showChangePasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowChangePasswordModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleChangePassword}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Mengubah...
                  </>
                ) : (
                  'Ubah Password'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}