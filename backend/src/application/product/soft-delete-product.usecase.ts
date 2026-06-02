import { ProductRepository } from '../../domain/product/product.repository'
import { AppError } from '../../shared/errors/app-error'

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id)
    if (!product) throw new AppError('Product not found', 404)
    return this.productRepository.delete(id)
  }
}