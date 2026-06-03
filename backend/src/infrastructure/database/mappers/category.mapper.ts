import { Category } from '@prisma/client'
import { CategoryEntity } from '../../../domain/category/category.entity'

export class CategoryMapper {
  static toDomain(raw: Category): CategoryEntity {
    return new CategoryEntity(raw.id, raw.name)
  }
}