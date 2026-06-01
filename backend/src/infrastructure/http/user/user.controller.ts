import { Request, Response, NextFunction } from 'express'
import { RegisterUserUseCase } from '../../../application/user/register-user.usecase'
import { LoginUserUseCase } from '../../../application/user/login-user.usecase'
import { PrismaUserRepository } from '../../database/prisma-user.repository'

//TODO: do a factory later
const userRepository = new PrismaUserRepository()
const registerUserUseCase = new RegisterUserUseCase(userRepository)
const loginUserUseCase = new LoginUserUseCase(userRepository)

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body
      const user = await registerUserUseCase.execute(name, email, password)
      return res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const result = await loginUserUseCase.execute(email, password)
      return res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}