import { OrderRepository } from '../../domain/order/order.repository'
import { AppError } from '../../shared/errors/app-error'
import { ForbiddenError } from '../../shared/errors/forbidden-error'
import { logger } from '../../shared/config/logger'

export class GetOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string, userId: string, role: string) {
    const order = await this.orderRepository.findById(id)

    if (!order) {
      logger.warn({ orderId: id, userId }, 'Order not found')
      throw new AppError('Order not found', 404)
    }
    if (order.userId !== userId && role !== 'ADMIN') {
      logger.warn({ orderId: id, userId, role }, 'Access denied')
      throw new ForbiddenError()
    }

    logger.info({ orderId: id, userId }, 'Order retrieved')

    return order
  }
}
