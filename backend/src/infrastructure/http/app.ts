import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import pinoHttp from 'pino-http'
import { AppError } from '../../shared/errors/app-error'
import { userRoutes } from './user/user.routes'
import { productRoutes } from './product/product.routes'
import { orderRoutes } from './order/order.routes'
import { categoryRoutes } from './category/category.routes'
import { logger } from '../../shared/config/logger'

export const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(pinoHttp({ logger }))

const FIFTEEN_MINUTES = 15 * 60 * 1000

const limiter = rateLimit({
  // Example: 15(minutes) * 60(converter to seconds) * 1000(converter to milliseconds), for each 15m , 100 max reqs
  // windowMs: 15 * 60 * 1000,
  windowMs: FIFTEEN_MINUTES,
  limit: 100,
  message: { error: 'Too many requests, please try again later' },
  handler: (req, res, next, options) => {
    logger.warn({ path: req.path, method: req.method, ip: req.ip }, 'Too many requests')
    res.status(options.statusCode).json(options.message)
  }
})

const authLimiter = rateLimit({
  // Example: 15(minutes) * 60(converter to seconds) * 1000(converter to milliseconds), for each 15m , 10 max reqs => to prevent brute force attacks
  // windowMs: 15 * 60 * 1000,
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  message: { error: 'Too many attempts, please try again later' },
  handler: (req, res, next, options) => {
    logger.warn({ path: req.path, method: req.method, ip: req.ip }, 'Too many auth attempts')
    res.status(options.statusCode).json(options.message)
  }
})

app.use(limiter)

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`
  })
})

app.use('/users', authLimiter, userRoutes)
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/orders', orderRoutes)

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(
        { path: req.path, method: req.method, statusCode: err.statusCode, message: err.message },
        'Application error'
      )
    }
    return res.status(err.statusCode).json({ error: err.message })
  }
  logger.error({ err, path: req.path, method: req.method }, 'Internal server error')
  return res.status(500).json({ error: 'Internal server error' })
})