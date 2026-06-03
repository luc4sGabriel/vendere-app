import { OrderRepository } from '../../domain/order/order.repository'
import { OrderStatus } from '../../domain/order/enums/order-status.enum'
import { NotFoundError } from '../../shared/errors/not-found-error'

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string, status: OrderStatus) {
    const order = await this.orderRepository.findById(id)
    if (!order) throw new NotFoundError()
    return this.orderRepository.updateStatus(id, status)
  }
}