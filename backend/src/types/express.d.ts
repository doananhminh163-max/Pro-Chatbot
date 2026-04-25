import type { JwtPayload } from '../utils/jwt.js'
import type { AuthUserPayload } from './auth.js'

declare global {
  namespace Express {
    interface User extends AuthUserPayload {}

    interface Request {
      auth?: JwtPayload
    }
  }
}

export {}
