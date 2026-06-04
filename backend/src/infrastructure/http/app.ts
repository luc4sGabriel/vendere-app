import express from 'express'
import cors from 'cors'
import { AppError } from '../../shared/errors/app-error'
import { userRoutes } from './user/user.routes'
import { productRoutes } from './product/product.routes'
import { orderRoutes } from './order/order.routes'
import { categoryRoutes } from './category/category.routes'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from '../../shared/config/env'

export const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

const FIFTEEN_MINUTES = 15 * 60 * 1000

const limiter = rateLimit({
  // Example: 15(minutes) * 60(converter to seconds) * 1000(converter to milliseconds), for each 15m , 100 max reqs
  // windowMs: 15 * 60 * 1000,
  windowMs: FIFTEEN_MINUTES,
  limit: 100,
  message: { error: 'Too many requests, please try again later' }
})

const authLimiter = rateLimit({
  // Example: 15(minutes) * 60(converter to seconds) * 1000(converter to milliseconds), for each 15m , 10 max reqs => to prevent brute force attacks
  // windowMs: 15 * 60 * 1000,
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  message: { error: 'Too many attempts, please try again later' }
})

app.use(limiter)

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: env.NODE_ENV,
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
    return res.status(err.statusCode).json({ error: err.message })
  }
  console.error(err)
  return res.status(500).json({ error: 'Internal server error' })
})