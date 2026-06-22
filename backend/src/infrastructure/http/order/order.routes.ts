import { Router } from 'express'
import { OrderController } from './order.controller'
import { validate } from '../../../shared/middlewares/validate.middleware'
import { createOrderDto, updateOrderStatusDto, listOrdersDto } from './order.dto'
import { authMiddleware, adminMiddleware } from '../../../shared/middlewares/auth.middleware'

const orderController = new OrderController()
export const orderRoutes = Router()

orderRoutes.get('/', authMiddleware, validate(listOrdersDto, 'query'), (req, res, next) => orderController.list(req, res, next))
orderRoutes.get('/all', authMiddleware, adminMiddleware, (req, res, next) => orderController.listAll(req, res, next))
orderRoutes.get('/:id', authMiddleware, (req, res, next) => orderController.get(req, res, next))
orderRoutes.post('/', authMiddleware, validate(createOrderDto), (req, res, next) => orderController.create(req, res, next))
orderRoutes.patch('/:id/status', authMiddleware, adminMiddleware, validate(updateOrderStatusDto), (req, res, next) => orderController.updateStatus(req, res, next))