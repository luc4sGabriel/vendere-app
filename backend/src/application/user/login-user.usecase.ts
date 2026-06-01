import { UserRepository } from '../../domain/user/user.repository'
import { AppError } from '../../domain/errors/AppError'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new AppError('Invalid credentials', 401)

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) throw new AppError('Invalid credentials', 401)

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    }
  }
}