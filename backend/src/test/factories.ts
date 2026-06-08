import { CategoryEntity } from '../domain/category/category.entity'
import { ProductEntity } from '../domain/product/product.entity'
import { OrderEntity } from '../domain/order/order.entity'
import { OrderItemEntity } from '../domain/order/order-item.entity'
import { OrderStatus } from '../domain/order/enums/order-status.enum'
import { UserEntity } from '../domain/user/user.entity'
import { Role } from '../domain/user/enums/role.enum'

export function makeCategory(overrides: Partial<{ id: string; name: string }> = {}): CategoryEntity {
  return new CategoryEntity(overrides.id ?? 'category-id', overrides.name ?? 'Category')
}

export function makeProduct(
  overrides: Partial<{
    id: string
    name: string
    description: string | null
    price: number
    stock: number
    imageUrl: string | null
    active: boolean
    categoryId: string
    createdAt: Date
  }> = {}
): ProductEntity {
  return new ProductEntity(
    overrides.id ?? 'product-id',
    overrides.name ?? 'Product',
    overrides.description ?? null,
    overrides.price ?? 10,
    overrides.stock ?? 5,
    overrides.imageUrl ?? null,
    overrides.active ?? true,
    overrides.categoryId ?? 'category-id',
    overrides.createdAt ?? new Date()
  )
}

export function makeOrderItem(
  overrides: Partial<{
    id: string
    orderId: string
    productId: string
    quantity: number
    unitPrice: number
  }> = {}
): OrderItemEntity {
  return new OrderItemEntity(
    overrides.id ?? 'item-id',
    overrides.orderId ?? 'order-id',
    overrides.productId ?? 'product-id',
    overrides.quantity ?? 1,
    overrides.unitPrice ?? 10
  )
}

export function makeOrder(
  overrides: Partial<{
    id: string
    userId: string
    status: OrderStatus
    total: number
    items: OrderItemEntity[]
    createdAt: Date
  }> = {}
): OrderEntity {
  return new OrderEntity(
    overrides.id ?? 'order-id',
    overrides.userId ?? 'user-id',
    overrides.status ?? OrderStatus.PENDING,
    overrides.total ?? 10,
    overrides.items ?? [],
    overrides.createdAt ?? new Date()
  )
}

export function makeUser(
  overrides: Partial<{
    id: string
    name: string
    email: string
    password: string
    role: Role
    createdAt: Date
  }> = {}
): UserEntity {
  return new UserEntity(
    overrides.id ?? 'user-id',
    overrides.name ?? 'User',
    overrides.email ?? 'user@example.com',
    overrides.password ?? 'hashed-password',
    overrides.role ?? Role.CUSTOMER,
    overrides.createdAt ?? new Date()
  )
}
