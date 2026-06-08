import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { LoginUserUseCase } from './login-user.usecase'
import { UserRepository } from '../../domain/user/user.repository'
import { RefreshTokenRepository } from '../../domain/auth/refresh-token.repository'
import { UnauthorizedError } from '../../shared/errors/unauthorized-error'
import { Role } from '../../domain/user/enums/role.enum'
import { makeUser } from '../../test/factories'

vi.mock('../../shared/config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-key',
    JWT_EXPIRES_IN: '7d'
  }
}))

describe('LoginUserUseCase', () => {
  let userRepository: UserRepository
  let refreshTokenRepository: RefreshTokenRepository
  let useCase: LoginUserUseCase

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      create: vi.fn()
    }
    refreshTokenRepository = {
      create: vi.fn(),
      findByToken: vi.fn(),
      deleteByToken: vi.fn(),
      deleteAllByUserId: vi.fn()
    }
    useCase = new LoginUserUseCase(userRepository, refreshTokenRepository)
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
    vi.mocked(refreshTokenRepository.deleteAllByUserId).mockResolvedValue()
    vi.mocked(refreshTokenRepository.create).mockResolvedValue({ token: 'refresh-token' })

    const result = await useCase.execute('joao@example.com', '12345678')

    expect(result.user).toEqual({
      id: user.id,
      name: 'João',
      email: 'joao@example.com',
      role: Role.CUSTOMER
    })
    expect(jwt.verify(result.accessToken, 'test-secret-key')).toMatchObject({
      id: user.id,
      role: Role.CUSTOMER
    })
    expect(result.refreshToken).toBe('refresh-token')
    expect(refreshTokenRepository.deleteAllByUserId).toHaveBeenCalledWith(user.id)
    expect(refreshTokenRepository.create).toHaveBeenCalledWith(user.id, expect.any(Date))
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
})
