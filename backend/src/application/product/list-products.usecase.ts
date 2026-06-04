import { ProductRepository } from '../../domain/product/product.repository'
import { logger } from '../../shared/config/logger'

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(filters?: { categoryId?: string; name?: string }) {
    const result = await this.productRepository.findAll(filters ?? {})

    logger.info({ total: result.meta.total, filters }, 'Products listed')

    return result
  }
}
