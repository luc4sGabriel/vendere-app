import { ProductRepository } from '../../domain/product/product.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { logger } from '../../shared/config/logger'

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id)
    if (!product) {
      logger.warn({ productId: id }, 'Product not found')
      throw new NotFoundError()
    }

    const deleted = await this.productRepository.delete(id)

    logger.info({ productId: id }, 'Product soft deleted')

    return deleted
  }
}
