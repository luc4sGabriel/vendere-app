import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { RegisterUserUseCase } from './register-user.usecase'
import { UserRepository } from '../../domain/user/user.repository'
import { ConflictError } from '../../shared/errors/conflict-error'
import { Role } from '../../domain/user/enums/role.enum'
import { makeUser } from '../../test/factories'

describe('RegisterUserUseCase', () => {
  let userRepository: UserRepository
  let useCase: RegisterUserUseCase

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      create: vi.fn()
    }
    useCase = new RegisterUserUseCase(userRepository)
  })

  it('deve registrar usuário com senha hasheada', async () => {
    const user = makeUser({
      name: 'João',
      email: 'joao@example.com',
      password: 'hashed',
      role: Role.CUSTOMER
    })

    vi.mocked(userRepository.findByEmail).mockResolvedValue(null)
    vi.mocked(userRepository.create).mockResolvedValue(user)

    const result = await useCase.execute('João', 'joao@example.com', '12345678')

    expect(result).toEqual({
      id: user.id,
      name: 'João',
      email: 'joao@example.com',
      role: Role.CUSTOMER
    })
    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'João',
      email: 'joao@example.com',
      password: expect.any(String)
    })

    const createCall = vi.mocked(userRepository.create).mock.calls[0][0]
    const passwordMatch = await bcrypt.compare('12345678', createCall.password)
    expect(passwordMatch).toBe(true)
  })

  it('deve lançar ConflictError quando email já está em uso', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(makeUser())

    await expect(useCase.execute('João', 'user@example.com', '12345678')).rejects.toThrow(
      new ConflictError('Email already in use')
    )
    expect(userRepository.create).not.toHaveBeenCalled()
  })
})
