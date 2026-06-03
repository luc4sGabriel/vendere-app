import { Request, Response, NextFunction } from 'express'
import { PrismaCategoryRepository } from '../../database/prisma-category.repository'
import { ListCategoriesUseCase } from '../../../application/category/list-categories.usecase'
import { GetCategoryUseCase } from '../../../application/category/get-category.usecase'
import { CreateCategoryUseCase } from '../../../application/category/create-category.usecase'
import { UpdateCategoryUseCase } from '../../../application/category/update-category.usecase'
import { DeleteCategoryUseCase } from '../../../application/category/delete-category.usecase'

const repo = new PrismaCategoryRepository()
const listCategories = new ListCategoriesUseCase(repo)
const getCategory = new GetCategoryUseCase(repo)
const createCategory = new CreateCategoryUseCase(repo)
const updateCategory = new UpdateCategoryUseCase(repo)
const deleteCategory = new DeleteCategoryUseCase(repo)

export class CategoryController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await listCategories.execute()
      return res.json(categories)
    } catch (err) { next(err) }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string
      const category = await getCategory.execute(id)
      return res.json(category)
    } catch (err) { next(err) }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body
      const category = await createCategory.execute(name)
      return res.status(201).json(category)
    } catch (err) { next(err) }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string
      const { name } = req.body
      const category = await updateCategory.execute(id, name)
      return res.json(category)
    } catch (err) { next(err) }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string
      await deleteCategory.execute(id)
      return res.status(204).send()
    } catch (err) { next(err) }
  }
}