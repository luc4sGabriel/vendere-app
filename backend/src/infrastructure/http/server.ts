import { app } from './app'
import { env } from '../../shared/config/env'
import { logger } from '../../shared/config/logger'

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`)
})