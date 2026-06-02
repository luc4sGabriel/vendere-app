import { Product } from '@prisma/client'
import { ProductEntity } from '../../../domain/product/product.entity'

export class ProductMapper {
  static toDomain(raw: Product): ProductEntity {
    return new ProductEntity(
      raw.id,
      raw.name,
      raw.description,
      Number(raw.price),
      raw.stock,
      raw.imageUrl,
      raw.active,
      raw.categoryId,
      raw.createdAt
    )
  }
}