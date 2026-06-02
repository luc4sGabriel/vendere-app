import { OrderStatus } from './enums/order-status.enum'
import { OrderItemEntity } from './order-item.entity'

export class OrderEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly status: OrderStatus,
    public readonly total: number,
    public readonly items: OrderItemEntity[],
    public readonly createdAt: Date
  ) {}
}