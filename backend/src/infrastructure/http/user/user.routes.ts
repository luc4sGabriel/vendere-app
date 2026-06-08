import { Router } from 'express'
import { UserController } from './user.controller'
import { validate } from '../../../shared/middlewares/validate.middleware'
import { registerUserDto, loginUserDto, refreshTokenDto } from './user.dto'
import { authMiddleware } from '../../../shared/middlewares/auth.middleware'

const userController = new UserController()
export const userRoutes = Router()

userRoutes.post('/register', validate(registerUserDto), (req, res, next) => userController.register(req, res, next))
userRoutes.post('/login', validate(loginUserDto), (req, res, next) => userController.login(req, res, next))
userRoutes.post('/refresh', validate(refreshTokenDto), (req, res, next) => userController.refresh(req, res, next))
userRoutes.post('/logout', authMiddleware, (req, res, next) => userController.logout(req, res, next))