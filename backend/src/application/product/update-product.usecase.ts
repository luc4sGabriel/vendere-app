import { ProductRepository, CreateProductData } from '../../domain/product/product.repository'
import { AppError } from '../../shared/errors/app-error'

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, data: Partial<CreateProductData>) {
    const product = await this.productRepository.findById(id)
    if (!product) throw new AppError('Product not found', 404)
    return this.productRepository.update(id, data)
  }
}