import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { ForbiddenError } from '../errors/forbidden-error'
import { env } from '../config/env'
import { logger } from '../config/logger'

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

  if (!authHeader) {
    logger.warn({ path: req.path, method: req.method }, 'Token missing')
    throw new UnauthorizedError('Token missing')
  }

  const [, token] = authHeader.split(' ')

  if (!env.JWT_SECRET) {
    logger.error('JWT_SECRET environment variable is required')
    return next(new UnauthorizedError('Invalid token'))
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload
    req.user = decoded

    logger.info(
      { userId: decoded.id, role: decoded.role, path: req.path, method: req.method },
      'Authenticated'
    )

    next()
  } catch {
    logger.warn({ path: req.path, method: req.method }, 'Invalid token')
    next(new UnauthorizedError('Invalid token'))
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.user.role !== 'ADMIN') {
    logger.warn(
      { userId: req.user.id, role: req.user.role, path: req.path, method: req.method },
      'Access denied'
    )
    throw new ForbiddenError('Forbidden')
  }

  next()
}
