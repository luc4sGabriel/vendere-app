import { Router } from 'express'
import { CategoryController } from './category.controller'
import { validate } from '../../../shared/middlewares/validate.middleware'
import { createCategoryDto, updateCategoryDto } from './category.dto'
import { authMiddleware, adminMiddleware } from '../../../shared/middlewares/auth.middleware'

const categoryController = new CategoryController()
export const categoryRoutes = Router()

categoryRoutes.get('/', (req, res, next) => categoryController.list(req, res, next))
categoryRoutes.get('/:id', (req, res, next) => categoryController.get(req, res, next))
categoryRoutes.post('/', authMiddleware, adminMiddleware, validate(createCategoryDto), (req, res, next) => categoryController.create(req, res, next))
categoryRoutes.put('/:id', authMiddleware, adminMiddleware, validate(updateCategoryDto), (req, res, next) => categoryController.update(req, res, next))
categoryRoutes.delete('/:id', authMiddleware, adminMiddleware, (req, res, next) => categoryController.delete(req, res, next))