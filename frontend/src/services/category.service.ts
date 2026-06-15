import { api } from '@/lib/api'
import { Category } from '@/types'

export const categoryService = {
  async list() {
    const { data } = await api.get<Category[]>('/categories')
    return data
  }
}