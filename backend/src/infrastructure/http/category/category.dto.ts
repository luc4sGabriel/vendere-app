import { z } from 'zod'

export const createCategoryDto = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').trim()
})

export const updateCategoryDto = createCategoryDto

export type CreateCategoryDto = z.infer<typeof createCategoryDto>
export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>