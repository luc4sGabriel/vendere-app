import { OrderRepository } from '../../domain/order/order.repository'
import { PaginationParams } from '../../shared/types/pagination.types'

export class ListAllOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(params: PaginationParams) {
    return this.orderRepository.findAllOrders(params)
  }
}