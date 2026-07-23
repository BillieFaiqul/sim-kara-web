import api from './api'

export interface Karya {
  id: number
  judul: string
  kategori: string
  penulis: string
  tahun: number
  deskripsi?: string
}

// Get karya list
export async function getKarya(params?: {
  page?: number
  kategori?: string
  search?: string
}) {
  try {
    const response = await api.get('/public/karya', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching karya:', error)
    throw error
  }
}

// Get karya detail
export async function getKaryaById(id: number) {
  try {
    const response = await api.get(`/public/karya/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching karya detail:', error)
    throw error
  }
}