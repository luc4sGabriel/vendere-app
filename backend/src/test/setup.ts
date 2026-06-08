import { vi } from 'vitest'

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test'
process.env.JWT_SECRET ??= 'test-secret-key'
process.env.NODE_ENV = 'test'

vi.mock('../shared/config/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))
