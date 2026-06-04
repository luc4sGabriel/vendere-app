import { OrderRepository } from '../../domain/order/order.repository'
import { PaginationParams } from '../../shared/types/pagination.types'
import { logger } from '../../shared/config/logger'

export class ListOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(userId: string, params: PaginationParams) {
    const result = await this.orderRepository.findAll(userId, params)

    logger.info({ userId, total: result.meta.total, page: result.meta.page }, 'Orders listed')

    return result
  }
}
