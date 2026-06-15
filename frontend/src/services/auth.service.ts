import { api } from '@/lib/api'
import { AuthResponse } from '@/types'

export const authService = {
  async register(name: string, email: string, password: string) {
    const { data } = await api.post<Omit<AuthResponse, 'accessToken' | 'refreshToken'>>('/users/register', {
      name, email, password
    })
    return data
  },

  async login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/users/login', {
      email, password
    })
    return data
  },

  async logout() {
    await api.post('/users/logout')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}