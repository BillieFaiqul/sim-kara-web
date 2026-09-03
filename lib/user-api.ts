import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sim-kara-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token expired (401 response)
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        localStorage.setItem('auth_message', 'Sesi Anda telah berakhir. Silakan login kembali.')
        // Redirect ke login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export interface User {
  id: number
  name: string
  email: string
  nip_nim: string
  role: 'admin' | 'dosen' | 'mahasiswa'
  is_active: boolean
  created_at: string
}

export interface UserCreateRequest {
  name: string
  email: string
  nip_nim: string
  password: string
  role: 'admin' | 'dosen' | 'mahasiswa'
  is_active?: boolean
}

export interface UserUpdateRequest {
  name?: string
  email?: string
  nip_nim?: string
  role?: 'admin' | 'dosen' | 'mahasiswa'
  is_active?: boolean
  password?: string
}

export interface UserResponse {
  success: boolean
  data: User[]
}

export interface UserDetailResponse {
  success: boolean
  data: User
}

class UserAPI {
  getAll(params: {
    search?: string
    role?: string
  } = {}): Promise<UserResponse> {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.role && params.role !== 'semua') query.append('role', params.role)

    return api.get(`/users?${query.toString()}`).then((res) => res.data)
  }

  getById(id: number): Promise<UserDetailResponse> {
    return api.get(`/users/${id}`).then((res) => res.data)
  }

  create(data: UserCreateRequest): Promise<{ success: boolean; message: string; data: User }> {
    return api.post('/users', data).then((res) => res.data)
  }

  update(
    id: number,
    data: UserUpdateRequest
  ): Promise<{ success: boolean; message: string; data: User }> {
    return api.put(`/users/${id}`, data).then((res) => res.data)
  }

  delete(id: number): Promise<{ success: boolean; message: string }> {
    return api.delete(`/users/${id}`).then((res) => res.data)
  }
}

export const userAPI = new UserAPI()
export default userAPI
