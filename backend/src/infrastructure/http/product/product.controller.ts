import { Request, Response, NextFunction } from 'express'
import { PrismaProductRepository } from '../../database/prisma-product.repository'
import { ListProductsUseCase } from '../../../application/product/list-products.usecase'
import { GetProductUseCase } from '../../../application/product/get-product.usecase'
import { CreateProductUseCase } from '../../../application/product/create-product.usecase'
import { UpdateProductUseCase } from '../../../application/product/update-product.usecase'
import { DeleteProductUseCase } from '../../../application/product/soft-delete-product.usecase'

const repo = new PrismaProductRepository()
const listProducts = new ListProductsUseCase(repo)
const getProduct = new GetProductUseCase(repo)
const createProduct = new CreateProductUseCase(repo)
const updateProduct = new UpdateProductUseCase(repo)
const deleteProduct = new DeleteProductUseCase(repo)

export class ProductController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, name } = req.query
      const products = await listProducts.execute({
        categoryId: categoryId as string,
        name: name as string
      })
      return res.json(products)
    } catch (err) { next(err) }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string
      const product = await getProduct.execute(id)
      return res.json(product)
    } catch (err) { next(err) }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await createProduct.execute(req.body)
      return res.status(201).json(product)
    } catch (err) { next(err) }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string
      const product = await updateProduct.execute(id, req.body)
      return res.json(product)
    } catch (err) { next(err) }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string
      await deleteProduct.execute(id)
      return res.status(204).send()
    } catch (err) { next(err) }
  }
}