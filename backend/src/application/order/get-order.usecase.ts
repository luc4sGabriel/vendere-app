import { OrderRepository } from '../../domain/order/order.repository'
import { AppError } from '../../shared/errors/app-error'
import { ForbiddenError } from '../../shared/errors/forbidden-error'

export class GetOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string, userId: string, role: string) {
    const order = await this.orderRepository.findById(id)

    if (!order) throw new AppError('Order not found', 404)
    if (order.userId !== userId && role !== 'ADMIN') throw new ForbiddenError()

    return order
  }
}