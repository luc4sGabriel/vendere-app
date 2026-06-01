import { UserRepository } from '../../domain/user/user.repository'
import { AppError } from '../../domain/errors/AppError'
import bcrypt from 'bcryptjs'

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(name: string, email: string, password: string) {
    const userExists = await this.userRepository.findByEmail(email)

    if (userExists) throw new AppError('Email already in use')

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