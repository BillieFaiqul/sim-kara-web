import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface LoginRequest {
  email: string
  password: string
}

interface MenuItem {
  label: string
  href: string
  icon: string
  submenu?: MenuItem[]
}

interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: {
    id: number
    name: string
    email: string
    role: 'admin' | 'mahasiswa' | 'dosen'
  }
  menu_items?: MenuItem[]
}

interface AuthResponse {
  success: boolean
  message: string
}

interface TokenResponse {
  success: boolean
  message: string
  token: string
}

interface UserResponse {
  success: boolean
  user: {
    id: number
    name: string
    email: string
    role: 'admin' | 'mahasiswa' | 'dosen'
  }
}

class AuthAPI {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = this.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        const currentToken = this.getToken()

        // Hanya retry refresh jika:
        // 1. Status 401
        // 2. Belum pernah retry
        // 3. Ada token (jadi bukan salah password di login)
        // 4. Bukan request ke /login endpoint
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          currentToken &&
          !originalRequest.url?.includes('/login')
        ) {
          originalRequest._retry = true
          try {
            const newToken = await this.refreshToken()
            this.saveToken(newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.api(originalRequest)
          } catch (refreshError) {
            this.clearToken()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      }
    )
  }

  login(data: LoginRequest): Promise<LoginResponse> {
    return this.api.post('/login', data).then((res) => res.data)
  }

  logout(): Promise<AuthResponse> {
    return this.api.post('/logout').then((res) => res.data)
  }

  async refreshToken(): Promise<string> {
    const response = await this.api.post('/refresh')
    return response.data.token
  }

  getCurrentUser(): Promise<UserResponse> {
    return this.api.get('/user').then((res) => res.data)
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }
}

export const authAPI = new AuthAPI()
export default authAPI