import { ProductEntity } from './product.entity'

export interface CreateProductData {
  name: string
  description?: string
  price: number
  stock: number
  imageUrl?: string
  categoryId: string
}

export interface ProductRepository {
  findAll(filters?: { categoryId?: string; name?: string }): Promise<ProductEntity[]>
  findById(id: string): Promise<ProductEntity | null>
  create(data: CreateProductData): Promise<ProductEntity>
  update(id: string, data: Partial<CreateProductData>): Promise<ProductEntity>
  delete(id: string): Promise<void>
}