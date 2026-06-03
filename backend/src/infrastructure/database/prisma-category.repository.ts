import { prisma } from '../lib/prisma'
import { CategoryRepository } from '../../domain/category/category.repository'
import { CategoryMapper } from './mappers/category.mapper'
import { CategoryEntity } from '../../domain/category/category.entity'

export class PrismaCategoryRepository implements CategoryRepository {
  async findAll(): Promise<CategoryEntity[]> {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return categories.map(CategoryMapper.toDomain)
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const category = await prisma.category.findUnique({ where: { id } })
    return category ? CategoryMapper.toDomain(category) : null
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    const category = await prisma.category.findUnique({ where: { name } })
    return category ? CategoryMapper.toDomain(category) : null
  }

  async create(name: string): Promise<CategoryEntity> {
    const category = await prisma.category.create({ data: { name } })
    return CategoryMapper.toDomain(category)
  }

  async update(id: string, name: string): Promise<CategoryEntity> {
    const category = await prisma.category.update({ where: { id }, data: { name } })
    return CategoryMapper.toDomain(category)
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } })
  }
}