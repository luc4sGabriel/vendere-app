import { ProductRepository, CreateProductData } from '../../domain/product/product.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { logger } from '../../shared/config/logger'

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, data: Partial<CreateProductData>) {
    const product = await this.productRepository.findById(id)
    if (!product) {
      logger.warn({ productId: id }, 'Product not found')
      throw new NotFoundError()
    }

    const updated = await this.productRepository.update(id, data)

    logger.info({ productId: id }, 'Product updated')

    return updated
  }
}
