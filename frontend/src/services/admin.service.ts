import { api } from '@/lib/api'
import { Product, Category, Order, PaginatedResponse } from '@/types'

interface CreateProductData {
  name: string
  description?: string
  price: number
  stock: number
  imageUrl?: string
  categoryId: string
}

export const adminService = {
  async listProducts(page = 1, limit = 10) {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', {
      params: { page, limit }
    })
    return data
  },

  async createProduct(data: CreateProductData) {
    const res = await api.post<Product>('/products', data)
    return res.data
  },

  async updateProduct(id: string, data: Partial<CreateProductData>) {
    const res = await api.put<Product>(`/products/${id}`, data)
    return res.data
  },

  async deleteProduct(id: string) {
    await api.delete(`/products/${id}`)
  },

  async listCategories() {
    const { data } = await api.get<Category[]>('/categories')
    return data
  },

  async createCategory(name: string) {
    const { data } = await api.post<Category>('/categories', { name })
    return data
  },

  async deleteCategory(id: string) {
    await api.delete(`/categories/${id}`)
  },

  async listOrders(page = 1, limit = 10) {
    const { data } = await api.get<PaginatedResponse<Order>>('/orders/all', {
      params: { page, limit }
    })
    return data
  },

  async updateOrderStatus(id: string, status: string) {
    const { data } = await api.patch<Order>(`/orders/${id}/status`, { status })
    return data
  }
}