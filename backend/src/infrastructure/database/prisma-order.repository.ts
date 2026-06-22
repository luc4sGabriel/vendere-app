import { prisma } from '../lib/prisma'
import { OrderRepository, CreateOrderData } from '../../domain/order/order.repository'
import { OrderMapper } from './mappers/order.mapper'
import { OrderEntity } from '../../domain/order/order.entity'
import { PaginationParams, PaginatedResponse } from '../../shared/types/pagination.types'
import { buildPaginatedResponse, getPrismaSkip } from '../../shared/utils/pagination'

export class PrismaOrderRepository implements OrderRepository {
  async findAll(userId: string, params: PaginationParams): Promise<PaginatedResponse<OrderEntity>> {
    const page = params.page ?? 1
    const limit = params.limit ?? 10
    const skip = getPrismaSkip(page, limit)

    const where = { userId }

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      }),
      prisma.order.count({ where })
    ])

    return buildPaginatedResponse(orders.map(OrderMapper.toDomain), total, page, limit)
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    })
    return order ? OrderMapper.toDomain(order) : null
  }

  async create(data: CreateOrderData): Promise<OrderEntity> {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        total: data.total,
        items: { create: data.items }
      },
      include: { items: true }
    })
    return OrderMapper.toDomain(order)
  }

  async updateStatus(id: string, status: string): Promise<OrderEntity> {
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: true }
    })
    return OrderMapper.toDomain(order)
  }

  async findAllOrders(params: PaginationParams): Promise<PaginatedResponse<OrderEntity>> {
    const page = params.page ?? 1
    const limit = params.limit ?? 10
    const skip = getPrismaSkip(page, limit)
  
    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      }),
      prisma.order.count()
    ])
  
    return buildPaginatedResponse(orders.map(OrderMapper.toDomain), total, page, limit)
  }
}