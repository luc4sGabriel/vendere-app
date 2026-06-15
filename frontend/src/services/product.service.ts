import { api } from '@/lib/api'
import { Product, PaginatedResponse } from '@/types'

interface ProductFilters {
  page?: number
  limit?: number
  name?: string
  categoryId?: string
}

export const productService = {
  async list(filters: ProductFilters = {}) {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', {
      params: filters
    })
    return data
  },

  async getById(id: string) {
    const { data } = await api.get<Product>(`/products/${id}`)
    return data
  }
}