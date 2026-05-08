import type { NextFunction, Request, Response } from 'express'
import { authCookieName, verifyJwt } from '../utils/jwt.js'

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = request.cookies?.[authCookieName]

  if (!token) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    request.auth = verifyJwt(token)
    next()
  } catch {
    response.status(401).json({ message: 'Invalid or expired session' })
  }
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (request.auth?.role !== 'ADMIN') {
    response.status(403).json({ message: 'Admin access is required' })
    return
  }

  next()
}
