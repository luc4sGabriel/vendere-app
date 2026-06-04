import { ProductRepository } from '../../domain/product/product.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { logger } from '../../shared/config/logger'

export class GetProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id)
    if (!product) {
      logger.warn({ productId: id }, 'Product not found')
      throw new NotFoundError()
    }

    logger.info({ productId: id }, 'Product retrieved')

    return product
  }
}
