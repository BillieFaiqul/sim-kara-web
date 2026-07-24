import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

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

export interface Karya {
  id: number
  user_id: number
  judul: string
  jenis: string
  level: string
  tahun: number
  deskripsi?: string
  file_path?: string
  file_pendukung_path?: string
  pencapaian?: string
  status: 'draft' | 'submitted' | 'verified' | 'rejected'
  alasan_reject?: string
  tanggal_submit?: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

export interface PaginatedResponse {
  success: boolean
  data: Karya[]
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}

export interface StatsResponse {
  success: boolean
  stats: Record<string, number>
  chart_data: Array<{ name: string; value: number }>
}

class KaryaAPI {
  getAll(params: {
    search?: string
    status?: string
    jenis?: string
    tahun?: string
    page?: number
  } = {}): Promise<PaginatedResponse> {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.status) query.append('status', params.status)
    if (params.jenis) query.append('jenis', params.jenis)
    if (params.tahun) query.append('tahun', params.tahun)
    if (params.page) query.append('page', params.page.toString())

    return api.get(`/karya?${query.toString()}`).then((res) => res.data)
  }

  getByUser(params: {
    search?: string
    status?: string
    page?: number
  } = {}): Promise<PaginatedResponse> {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.status) query.append('status', params.status)
    if (params.page) query.append('page', params.page.toString())

    return api.get(`/karya-saya?${query.toString()}`).then((res) => res.data)
  }

  getById(id: number): Promise<{ success: boolean; data: Karya }> {
    return api.get(`/karya/${id}`).then((res) => res.data)
  }

  create(data: {
    judul: string
    jenis: string
    level: string
    tahun: number
    deskripsi?: string
    file_path?: string
  }): Promise<{ success: boolean; message: string; data: Karya }> {
    return api.post('/karya', data).then((res) => res.data)
  }

  update(
    id: number,
    data: Partial<{
      judul: string
      jenis: string
      level: string
      tahun: number
      deskripsi: string
      file_path: string
    }>
  ): Promise<{ success: boolean; message: string; data: Karya }> {
    return api.put(`/karya/${id}`, data).then((res) => res.data)
  }

  submit(id: number): Promise<{ success: boolean; message: string; data: Karya }> {
    return api.post(`/karya/${id}/submit`, {}).then((res) => res.data)
  }

  delete(id: number): Promise<{ success: boolean; message: string }> {
    return api.delete(`/karya/${id}`).then((res) => res.data)
  }

  getStats(): Promise<StatsResponse> {
    return api.get('/karya-stats').then((res) => res.data)
  }

  uploadFile(formData: FormData): Promise<{ file_path: string; url: string }> {
    return api.post('/karya/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data)
  }

  createWithPath(data: {
    judul: string
    jenis: string
    level: string
    tahun: number
    deskripsi?: string
    pencapaian?: string
    file_path: string
    file_pendukung_path?: string | null
  }): Promise<{ success: boolean; message: string; data: Karya }> {
    return api.post('/karya', data).then((res) => res.data)
  }

  download(id: number): Promise<Blob> {
    return api.get(`/karya/${id}/download`, {
      responseType: 'blob',
    }).then((res) => res.data)
  }
}

export const karyaAPI = new KaryaAPI()
export default karyaAPI
