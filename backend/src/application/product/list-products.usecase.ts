import { ProductRepository } from '../../domain/product/product.repository'

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(filters?: { categoryId?: string; name?: string }) {
    return this.productRepository.findAll(filters)
  }
}