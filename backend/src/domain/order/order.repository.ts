import { OrderEntity } from './order.entity'
import { PaginationParams, PaginatedResponse } from '../../shared/types/pagination.types'

export interface CreateOrderItemData {
  productId: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderData {
  userId: string
  total: number
  items: CreateOrderItemData[]
}

export interface OrderRepository {
  findAll(userId: string, params: PaginationParams): Promise<PaginatedResponse<OrderEntity>>
  findById(id: string): Promise<OrderEntity | null>
  create(data: CreateOrderData): Promise<OrderEntity>
  updateStatus(id: string, status: string): Promise<OrderEntity>
  findAllOrders(params: PaginationParams): Promise<PaginatedResponse<OrderEntity>>
}