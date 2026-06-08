import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LogoutUserUseCase } from './logout-user.usecase'
import { RefreshTokenRepository } from '../../domain/auth/refresh-token.repository'

describe('LogoutUserUseCase', () => {
  let refreshTokenRepository: RefreshTokenRepository
  let useCase: LogoutUserUseCase

  beforeEach(() => {
    refreshTokenRepository = {
      create: vi.fn(),
      findByToken: vi.fn(),
      deleteByToken: vi.fn(),
      deleteAllByUserId: vi.fn()
    }
    useCase = new LogoutUserUseCase(refreshTokenRepository)
  })

  it('deve remover todos os refresh tokens do usuário', async () => {
    vi.mocked(refreshTokenRepository.deleteAllByUserId).mockResolvedValue()

    await useCase.execute('user-id')

    expect(refreshTokenRepository.deleteAllByUserId).toHaveBeenCalledWith('user-id')
  })
})
