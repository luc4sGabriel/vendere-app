import { prisma } from '../lib/prisma'
import { ProductRepository, CreateProductData, ProductFilters } from '../../domain/product/product.repository'
import { ProductMapper } from './mappers/product.mapper'
import { PaginatedResponse } from '../../shared/types/pagination.types'
import { buildPaginatedResponse, getPrismaSkip } from '../../shared/utils/pagination'
import { ProductEntity } from '../../domain/product/product.entity'

export class PrismaProductRepository implements ProductRepository {
  async findAll(filters: ProductFilters): Promise<PaginatedResponse<ProductEntity>> {
    const { page = 1, limit = 10, categoryId, name } = filters
    const skip = getPrismaSkip(page, limit)
  
    const where = {
      active: true,
      ...(categoryId && { categoryId }),
      ...(name && { name: { contains: name, mode: 'insensitive' as const } })
    }
  
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where })
    ])
  
    return buildPaginatedResponse(products.map(ProductMapper.toDomain), total, page, limit)
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({ where: { id } })
    return product ? ProductMapper.toDomain(product) : null
  }

  async create(data: CreateProductData): Promise<ProductEntity> {
    const product = await prisma.product.create({ data })
    return ProductMapper.toDomain(product)
  }

  async update(id: string, data: Partial<CreateProductData>): Promise<ProductEntity> {
    const product = await prisma.product.update({ where: { id }, data })
    return ProductMapper.toDomain(product)
  }

  async delete(id: string): Promise<void> {
    await prisma.product.update({ where: { id }, data: { active: false } })
  }
}