import { OrderRepository } from '../../domain/order/order.repository'
import { OrderStatus } from '../../domain/order/enums/order-status.enum'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { logger } from '../../shared/config/logger'

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string, status: OrderStatus) {
    const order = await this.orderRepository.findById(id)
    if (!order) {
      logger.warn({ orderId: id }, 'Order not found')
      throw new NotFoundError()
    }

    const updated = await this.orderRepository.updateStatus(id, status)

    logger.info({ orderId: id, status }, 'Order status updated')

    return updated
  }
}
