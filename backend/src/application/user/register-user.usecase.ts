import { UserRepository } from '../../domain/user/user.repository'
import bcrypt from 'bcryptjs'
import { ConflictError } from '../../shared/errors/conflict-error'

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(name: string, email: string, password: string) {
    const userExists = await this.userRepository.findByEmail(email)

    if (userExists) throw new ConflictError('Email already in use')

    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}