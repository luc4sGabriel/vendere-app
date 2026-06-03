import { OrderRepository } from '../../domain/order/order.repository'
import { PaginationParams } from '../../shared/types/pagination.types'

export class ListOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(userId: string, params: PaginationParams) {
    return this.orderRepository.findAll(userId, params)
  }
}