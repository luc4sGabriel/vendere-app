import axios from 'axios'
import { toast } from 'sonner'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const { data } = await axios.post(`${baseURL}/users/refresh`, { refreshToken })
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }
    }

    const message = error.response?.data?.error || 'Algo deu errado. Tente novamente.'

    if (error.response?.status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)