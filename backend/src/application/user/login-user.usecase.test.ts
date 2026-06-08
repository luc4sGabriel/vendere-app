import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { LoginUserUseCase } from './login-user.usecase'
import { UserRepository } from '../../domain/user/user.repository'
import { UnauthorizedError } from '../../shared/errors/unauthorized-error'
import { BadRequestError } from '../../shared/errors/bad-request-error'
import { Role } from '../../domain/user/enums/role.enum'
import { makeUser } from '../../test/factories'

vi.mock('../../shared/config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-key'
  }
}))

describe('LoginUserUseCase', () => {
  let userRepository: UserRepository
  let useCase: LoginUserUseCase

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      create: vi.fn()
    }
    useCase = new LoginUserUseCase(userRepository)
  })

  it('deve autenticar usuário com credenciais válidas', async () => {
    const hashedPassword = await bcrypt.hash('12345678', 8)
    const user = makeUser({
      name: 'João',
      email: 'joao@example.com',
      password: hashedPassword,
      role: Role.CUSTOMER
    })

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user)

    const result = await useCase.execute('joao@example.com', '12345678')

    expect(result.user).toEqual({
      id: user.id,
      name: 'João',
      email: 'joao@example.com',
      role: Role.CUSTOMER
    })
    expect(jwt.verify(result.token, 'test-secret-key')).toMatchObject({
      id: user.id,
      role: Role.CUSTOMER
    })
  })

  it('deve lançar UnauthorizedError quando email não existe', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null)

    await expect(useCase.execute('unknown@example.com', '12345678')).rejects.toThrow(
      new UnauthorizedError('Invalid credentials')
    )
  })

  it('deve lançar UnauthorizedError quando senha é inválida', async () => {
    const hashedPassword = await bcrypt.hash('12345678', 8)
    vi.mocked(userRepository.findByEmail).mockResolvedValue(
      makeUser({ email: 'joao@example.com', password: hashedPassword })
    )

    await expect(useCase.execute('joao@example.com', 'wrong-password')).rejects.toThrow(
      new UnauthorizedError('Invalid credentials')
    )
  })

  it('deve lançar BadRequestError quando JWT_SECRET não está configurado', async () => {
    const envModule = await import('../../shared/config/env')
    const originalSecret = envModule.env.JWT_SECRET

    Object.defineProperty(envModule.env, 'JWT_SECRET', { value: '', configurable: true })

    const hashedPassword = await bcrypt.hash('12345678', 8)
    vi.mocked(userRepository.findByEmail).mockResolvedValue(
      makeUser({ email: 'joao@example.com', password: hashedPassword })
    )

    await expect(useCase.execute('joao@example.com', '12345678')).rejects.toThrow(
      new BadRequestError('JWT_SECRET environment variable is required')
    )

    Object.defineProperty(envModule.env, 'JWT_SECRET', { value: originalSecret, configurable: true })
  })
})
