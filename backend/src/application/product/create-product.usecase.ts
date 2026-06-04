import { ProductRepository, CreateProductData } from '../../domain/product/product.repository'
import { logger } from '../../shared/config/logger'

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: CreateProductData) {
    const product = await this.productRepository.create(data)

    logger.info({ productId: product.id, name: product.name }, 'Product created')

    return product
  }
}
