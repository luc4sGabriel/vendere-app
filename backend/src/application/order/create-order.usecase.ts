import { OrderRepository } from '../../domain/order/order.repository'
import { ProductRepository } from '../../domain/product/product.repository'
import { logger } from '../../shared/config/logger'
import { NotFoundError } from '../../shared/errors/not-found-error'

interface CreateOrderItem {
  productId: string
  quantity: number
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository
  ) {}

  async execute(userId: string, items: CreateOrderItem[]) {
    let total = 0
    const orderItems = []

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId)

      if (!product) {
        logger.warn({ productId: item.productId, userId }, 'Product not found')
        throw new NotFoundError()
      }
      if (!product.active) {
        logger.warn({ productId: item.productId, userId }, 'Product inactive')
        throw new NotFoundError()
      }
      if (product.stock < item.quantity) {
        logger.warn(
          { productId: item.productId, productName: product.name, stock: product.stock, quantity: item.quantity, userId },
          'Insufficient stock'
        )
        throw new NotFoundError(`Insufficient stock for ${product.name}`)
      }

      total += product.price * item.quantity
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price
      })
    }

    const order = await this.orderRepository.create({ userId, total, items: orderItems })

    logger.info({ orderId: order.id, userId, total, itemCount: orderItems.length }, 'Order created')

    return order
  }
}
