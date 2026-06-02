import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { ForbiddenError } from '../errors/forbidden-error'

interface TokenPayload {
  id: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user: TokenPayload
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) throw new UnauthorizedError('Token missing')

  const [, token] = authHeader.split(' ')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
    req.user = decoded
    next()
  } catch {
    next(new UnauthorizedError('Invalid token'))
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.user.role !== 'ADMIN') throw new ForbiddenError('Forbidden')
  next()
}