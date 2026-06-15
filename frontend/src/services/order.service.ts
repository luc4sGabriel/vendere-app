import { api } from '@/lib/api'
import { Order, PaginatedResponse } from '@/types'

interface CreateOrderItem {
  productId: string
  quantity: number
}

export const orderService = {
  async create(items: CreateOrderItem[]) {
    const { data } = await api.post<Order>('/orders', { items })
    return data
  },

  async list(page = 1, limit = 10) {
    const { data } = await api.get<PaginatedResponse<Order>>('/orders', {
      params: { page, limit }
    })
    return data
  },

  async getById(id: string) {
    const { data } = await api.get<Order>(`/orders/${id}`)
    return data
  }
}