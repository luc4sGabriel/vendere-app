import { Request, Response, NextFunction } from 'express'
import { PrismaOrderRepository } from '../../database/prisma-order.repository'
import { PrismaProductRepository } from '../../database/prisma-product.repository'
import { CreateOrderUseCase } from '../../../application/order/create-order.usecase'
import { ListOrdersUseCase } from '../../../application/order/list-orders.usecase'
import { GetOrderUseCase } from '../../../application/order/get-order.usecase'
import { UpdateOrderStatusUseCase } from '../../../application/order/update-order-status.usecase'
import { ListAllOrdersUseCase } from '../../../application/order/list-all-orders.usecase'

const orderRepo = new PrismaOrderRepository()
const productRepo = new PrismaProductRepository()
const createOrder = new CreateOrderUseCase(orderRepo, productRepo)
const listOrders = new ListOrdersUseCase(orderRepo)
const getOrder = new GetOrderUseCase(orderRepo)
const updateOrderStatus = new UpdateOrderStatusUseCase(orderRepo)
const listAllOrdersUseCase = new ListAllOrdersUseCase(orderRepo)

export class OrderController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body
      const order = await createOrder.execute(req.user.id, items)
      return res.status(201).json(order)
    } catch (err) { next(err) }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query
      const orders = await listOrders.execute(req.user.id, {
        page: Number(page) || 1,
        limit: Number(limit) || 10
      })
      return res.json(orders)
    } catch (err) { next(err) }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string
      const order = await getOrder.execute(id, req.user.id, req.user.role)
      return res.json(order)
    } catch (err) { next(err) }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string
      const { status } = req.body
      const order = await updateOrderStatus.execute(id, status)
      return res.json(order)
    } catch (err) { next(err) }
  }

  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query
      const orders = await listAllOrdersUseCase.execute({
        page: Number(page) || 1,
        limit: Number(limit) || 10
      })
      return res.json(orders)
    } catch (err) { next(err) }
  }
}