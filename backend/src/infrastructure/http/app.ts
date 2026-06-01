import express from 'express'
import cors from 'cors'
import { AppError } from '../../domain/errors/AppError'
// import { authRoutes } from './modules/auth/auth.routes'
// import { productsRoutes } from './modules/products/products.routes'

export const app = express()

app.use(cors())
app.use(express.json())

// app.use('/auth', authRoutes)
// app.use('/products', productsRoutes)

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }
  console.error(err)
  return res.status(500).json({ error: 'Internal server error' })
})