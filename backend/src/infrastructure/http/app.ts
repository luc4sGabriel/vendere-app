import express from 'express'
import cors from 'cors'
import { AppError } from '../../shared/errors/app-error'
import { userRoutes } from './user/user.routes'
import { productRoutes } from './product/product.routes'

export const app = express()

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/products', productRoutes)

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }
  console.error(err)
  return res.status(500).json({ error: 'Internal server error' })
})