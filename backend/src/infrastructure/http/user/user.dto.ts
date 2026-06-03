import { z } from 'zod'

export const registerUserDto = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must have at least 6 characters')
})

export const loginUserDto = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
})

export type RegisterUserDto = z.infer<typeof registerUserDto>
export type LoginUserDto = z.infer<typeof loginUserDto>