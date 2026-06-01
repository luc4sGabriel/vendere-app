import { Router } from 'express'
import { UserController } from './user.controller'

const userController = new UserController()
export const userRoutes = Router()

userRoutes.post('/register', (req, res, next) => userController.register(req, res, next))
userRoutes.post('/login', (req, res, next) => userController.login(req, res, next))