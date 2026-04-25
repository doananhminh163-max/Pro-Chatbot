import type { Response } from 'express'
import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'
import { env, isProduction } from '../config/env.js'

export interface JwtPayload {
  sub: string
  email: string
  role: 'CLIENT' | 'ADMIN'
}

const COOKIE_NAME = 'access_token'

export function signJwt(payload: JwtPayload) {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  }

  return jwt.sign(payload, env.jwtSecret, {
    ...options,
  })
}

export function verifyJwt(token: string) {
  return jwt.verify(token, env.jwtSecret) as JwtPayload
}

export function setAuthCookie(response: Response, token: string) {
  response.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookie(response: Response) {
  response.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  })
}

export const authCookieName = COOKIE_NAME
