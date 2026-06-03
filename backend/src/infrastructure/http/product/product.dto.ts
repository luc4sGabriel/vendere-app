import { z } from 'zod'

export const createProductDto = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock must be zero or positive'),
  imageUrl: z.string().url('Invalid URL').optional(),
  categoryId: z.string().uuid('Invalid category ID')
})

export const updateProductDto = createProductDto.partial()

export const listProductsDto = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    categoryId: z.string().optional(),
    name: z.string().optional()
  })

export type CreateProductDto = z.infer<typeof createProductDto>
export type UpdateProductDto = z.infer<typeof updateProductDto>
export type ListProductsDto = z.infer<typeof listProductsDto>