import { ProductRepository, CreateProductData } from '../../domain/product/product.repository'

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: CreateProductData) {
    return this.productRepository.create(data)
  }
}