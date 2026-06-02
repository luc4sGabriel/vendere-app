import { Router } from 'express'
import { ProductController } from './product.controller'
import { authMiddleware, adminMiddleware } from '../../../shared/middlewares/auth.middleware'

const productController = new ProductController()
export const productRoutes = Router()

productRoutes.get('/', (req, res, next) => productController.list(req, res, next))
productRoutes.get('/:id', (req, res, next) => productController.get(req, res, next))
productRoutes.post('/', authMiddleware, adminMiddleware, (req, res, next) => productController.create(req, res, next))
productRoutes.put('/:id', authMiddleware, adminMiddleware, (req, res, next) => productController.update(req, res, next))
productRoutes.delete('/:id', authMiddleware, adminMiddleware, (req, res, next) => productController.delete(req, res, next))