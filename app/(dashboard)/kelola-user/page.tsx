'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Search, X } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  nip_nim: string
  role: 'admin' | 'dosen' | 'mahasiswa'
  is_active: boolean
  created_at: string
}

interface FormData {
  name: string
  email: string
  nip_nim: string
  role: 'admin' | 'dosen' | 'mahasiswa'
  password?: string
  is_active: boolean
}

export default function KolaUserPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'semua' | 'admin' | 'dosen' | 'mahasiswa'>('semua')
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Admin Prodi',
      email: 'admin@unesa.ac.id',
      nip_nim: '1234567890',
      role: 'admin',
      is_active: true,
      created_at: '2024-01-15',
    },
    {
      id: 2,
      name: 'Dr. Bambang Suryanto',
      email: 'bambang@unesa.ac.id',
      nip_nim: '1234567890',
      role: 'dosen',
      is_active: true,
      created_at: '2024-02-10',
    },
    {
      id: 3,
      name: 'Ir. Siti Nurhasanah',
      email: 'siti@unesa.ac.id',
      nip_nim: '0987654321',
      role: 'dosen',
      is_active: true,
      created_at: '2024-02-12',
    },
    {
      id: 4,
      name: 'Rina Wijaya',
      email: 'rina@unesa.ac.id',
      nip_nim: '210411100001',
      role: 'mahasiswa',
      is_active: true,
      created_at: '2024-03-05',
    },
    {
      id: 5,
      name: 'Ahmad Hidayat',
      email: 'ahmad@unesa.ac.id',
      nip_nim: '210411100002',
      role: 'mahasiswa',
      is_active: false,
      created_at: '2024-03-06',
    },
  ])

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    nip_nim: '',
    role: 'mahasiswa',
    password: '',
    is_active: true,
  })

  // Filter & Search
  const filtered = users.filter(user => {
    const matchFilter = filter === 'semua' || user.role === filter
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.nip_nim.includes(search)
    return matchFilter && matchSearch
  })

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
    setShowAddModal(true)
  }

  const handleAddSubmit = () => {
    if (!formData.name || !formData.email || !formData.nip_nim || !formData.password) {
      alert('Semua field harus diisi')
      return
    }

    const newUser: User = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...formData,
      password: undefined as any,
      created_at: new Date().toISOString().split('T')[0],
    }

    setUsers([...users, newUser])
    setShowAddModal(false)
    alert('User berhasil ditambahkan')
  }

  // Handle Edit
  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      nip_nim: user.nip_nim,
      role: user.role,
      is_active: user.is_active,
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = () => {
    if (!formData.name || !formData.email || !formData.nip_nim) {
      alert('Semua field harus diisi')
      return
    }

    setUsers(
      users.map(u =>
        u.id === selectedUser?.id
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              nip_nim: formData.nip_nim,
              role: formData.role,
              is_active: formData.is_active,
            }
          : u
      )
    )
    setShowEditModal(false)
    alert('User berhasil diupdate')
  }

  // Handle Delete
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    setUsers(users.filter(u => u.id !== selectedUser?.id))
    setShowDeleteConfirm(false)
    alert('User berhasil dihapus')
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
              {filtered.map(user => (
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
                      >
                        <Edit size={18} />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada user yang sesuai</p>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* NIP/NIM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP/NIM *</label>
                <input
                  type="text"
                  value={formData.nip_nim}
                  onChange={(e) => setFormData({ ...formData, nip_nim: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleAddSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* NIP/NIM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP/NIM *</label>
                <input
                  type="text"
                  value={formData.nip_nim}
                  onChange={(e) => setFormData({ ...formData, nip_nim: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                  <option value="admin">Admin</option>
                </select>
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleEditSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
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