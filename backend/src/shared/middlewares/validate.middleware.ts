import { Request, Response, NextFunction } from 'express'
import { z, ZodType } from 'zod'
import { UnprocesssableContentError } from '../errors/unprocesssable-content-error'
import { logger } from '../config/logger'

type Target = 'body' | 'query' | 'params'

export function validate(schema: ZodType, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])

    if (!result.success) {
      const message = z.prettifyError(result.error)

      logger.warn(
        {
          target,
          path: req.path,
          method: req.method,
          issues: result.error.issues.map((i) => ({ path: i.path, message: i.message }))
        },
        'Validation failed'
      )

      return next(new UnprocesssableContentError(message))
    }

    if (target === 'body') {
      req.body = result.data
    } else {
      Object.assign(req[target], result.data)
    }

    next()
  }
}
