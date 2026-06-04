import 'dotenv/config'
import { app } from './app'
import { env } from '../../shared/config/env'

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`)
})