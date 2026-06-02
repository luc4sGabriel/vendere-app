import { prisma } from '../lib/prisma'
import { ProductEntity } from '../../domain/product/product.entity'
import { ProductRepository, CreateProductData } from '../../domain/product/product.repository'

export class PrismaProductRepository implements ProductRepository {
  private toEntity(p: any): ProductEntity {
    return new ProductEntity(
      p.id, p.name, p.description, Number(p.price),
      p.stock, p.imageUrl, p.active, p.categoryId, p.createdAt
    )
  }

  async findAll(filters?: { categoryId?: string; name?: string }) {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.name && { name: { contains: filters.name, mode: 'insensitive' } })
      }
    })
    return products.map(this.toEntity)
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return null
    return this.toEntity(product)
  }

  async create(data: CreateProductData) {
    const product = await prisma.product.create({ data })
    return this.toEntity(product)
  }

  async update(id: string, data: Partial<CreateProductData>) {
    const product = await prisma.product.update({ where: { id }, data })
    return this.toEntity(product)
  }

  async delete(id: string) {
    await prisma.product.update({ where: { id }, data: { active: false } })
  }
}