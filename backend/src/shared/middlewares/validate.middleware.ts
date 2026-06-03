import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { UnprocesssableContentError } from '../errors/unprocesssable-content-error'

type Target = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])

    if (!result.success) {
      const message = result.error.message
      return next(new UnprocesssableContentError(message))
    }

    req[target] = result.data
    next()
  }
}