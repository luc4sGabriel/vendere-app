import { ProductRepository, CreateProductData } from '../../domain/product/product.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, data: Partial<CreateProductData>) {
    const product = await this.productRepository.findById(id)
    if (!product) throw new NotFoundError()
    return this.productRepository.update(id, data)
  }
}