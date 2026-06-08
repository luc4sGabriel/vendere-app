import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { RefreshTokenUseCase } from './refresh-token.usecase'
import { RefreshTokenRepository } from '../../domain/auth/refresh-token.repository'
import { UserRepository } from '../../domain/user/user.repository'
import { AppError } from '../../shared/errors/app-error'
import { Role } from '../../domain/user/enums/role.enum'
import { makeUser } from '../../test/factories'

vi.mock('../../shared/config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-key',
    JWT_EXPIRES_IN: '7d'
  }
}))

describe('RefreshTokenUseCase', () => {
  let refreshTokenRepository: RefreshTokenRepository
  let userRepository: UserRepository
  let useCase: RefreshTokenUseCase

  beforeEach(() => {
    refreshTokenRepository = {
      create: vi.fn(),
      findByToken: vi.fn(),
      deleteByToken: vi.fn(),
      deleteAllByUserId: vi.fn()
    }
    userRepository = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      create: vi.fn()
    }
    useCase = new RefreshTokenUseCase(refreshTokenRepository, userRepository)
  })

  it('deve renovar tokens com refresh token válido', async () => {
    const user = makeUser({ id: 'user-id', role: Role.CUSTOMER })
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    vi.mocked(refreshTokenRepository.findByToken).mockResolvedValue({
      token: 'old-refresh-token',
      userId: user.id,
      expiresAt
    })
    vi.mocked(userRepository.findById).mockResolvedValue(user)
    vi.mocked(refreshTokenRepository.deleteByToken).mockResolvedValue()
    vi.mocked(refreshTokenRepository.create).mockResolvedValue({ token: 'new-refresh-token' })

    const result = await useCase.execute('old-refresh-token')

    expect(jwt.verify(result.accessToken, 'test-secret-key')).toMatchObject({
      id: user.id,
      role: Role.CUSTOMER
    })
    expect(result.refreshToken).toBe('new-refresh-token')
    expect(refreshTokenRepository.deleteByToken).toHaveBeenCalledWith('old-refresh-token')
    expect(refreshTokenRepository.create).toHaveBeenCalledWith(user.id, expect.any(Date))
  })

  it('deve lançar AppError quando refresh token é inválido', async () => {
    vi.mocked(refreshTokenRepository.findByToken).mockResolvedValue(null)

    await expect(useCase.execute('invalid-token')).rejects.toThrow(
      new AppError('Invalid refresh token', 401)
    )
  })

  it('deve lançar AppError e remover token quando refresh token expirou', async () => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() - 1)

    vi.mocked(refreshTokenRepository.findByToken).mockResolvedValue({
      token: 'expired-token',
      userId: 'user-id',
      expiresAt
    })
    vi.mocked(refreshTokenRepository.deleteByToken).mockResolvedValue()

    await expect(useCase.execute('expired-token')).rejects.toThrow(
      new AppError('Refresh token expired', 401)
    )
    expect(refreshTokenRepository.deleteByToken).toHaveBeenCalledWith('expired-token')
  })

  it('deve lançar AppError quando usuário não existe', async () => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    vi.mocked(refreshTokenRepository.findByToken).mockResolvedValue({
      token: 'valid-token',
      userId: 'user-id',
      expiresAt
    })
    vi.mocked(userRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('valid-token')).rejects.toThrow(new AppError('User not found', 404))
  })
})
