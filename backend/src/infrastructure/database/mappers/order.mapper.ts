import { Order, OrderItem } from '@prisma/client'
import { OrderEntity } from '../../../domain/order/order.entity'
import { OrderItemEntity } from '../../../domain/order/order-item.entity'
import { OrderStatus } from '../../../domain/order/enums/order-status.enum'

type OrderWithItems = Order & { items: OrderItem[] }

export class OrderMapper {
  static toDomain(raw: OrderWithItems): OrderEntity {
    return new OrderEntity(
      raw.id,
      raw.userId,
      raw.status as OrderStatus,
      Number(raw.total),
      raw.items.map(i => new OrderItemEntity(
        i.id,
        i.orderId,
        i.productId,
        i.quantity,
        Number(i.unitPrice)
      )),
      raw.createdAt
    )
  }
}