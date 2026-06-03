import { Router } from 'express'
import { UserController } from './user.controller'
import { validate } from '../../../shared/middlewares/validate.middleware'
import { registerUserDto, loginUserDto } from './user.dto'

const userController = new UserController()
export const userRoutes = Router()

userRoutes.post('/register', validate(registerUserDto), (req, res, next) => userController.register(req, res, next))
userRoutes.post('/login', validate(loginUserDto), (req, res, next) => userController.login(req, res, next))