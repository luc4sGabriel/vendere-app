import { ProductRepository } from '../../domain/product/product.repository'
import { AppError } from '../../shared/errors/app-error'
import { NotFoundError } from '../../shared/errors/not-found-error'

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id)
    if (!product) throw new NotFoundError('Product not found')
    return this.productRepository.delete(id)
  }
}