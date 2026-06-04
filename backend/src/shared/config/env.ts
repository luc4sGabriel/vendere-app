import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string('Invalid DATABASE_URL'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must have at least 8 characters'),
  JWT_EXPIRES_IN: z.string().default('7d')
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('❌ Invalid environment variables:')
  console.error(z.prettifyError(result.error))
  process.exit(1)
}

export const env = result.data