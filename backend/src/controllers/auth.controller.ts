import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  findUserById,
  login,
  requestPasswordReset,
  register,
  resetPassword,
  updateProfile,
} from '../services/auth.service.js'
import { sendResetPasswordEmail } from '../services/mailer.service.js'
import { env } from '../config/env.js'
import { clearAuthCookie, setAuthCookie, signJwt } from '../utils/jwt.js'
import type { AuthUserPayload } from '../types/auth.js'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).optional(),
  fullName: z.string().min(1).optional(),
})

const loginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
})

const forgotPasswordSchema = z.object({
  emailOrUsername: z.string().min(1),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
})

const updateProfileSchema = z
  .object({
    username: z.string().optional(),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    aiTone: z.string().optional(),
    aiLanguage: z.string().optional(),
    aiResponseLength: z.string().optional(),
    customInstructions: z.string().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one profile field must be provided',
  })

function issueSessionCookie(response: Response, user: AuthUserPayload) {
  const token = signJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
  })

  setAuthCookie(response, token)
}

export async function registerHandler(request: Request, response: Response) {
  try {
    const payload = registerSchema.parse(request.body)
    const user = await register({
      email: payload.email,
      password: payload.password,
      username: payload.username,
      fullName: payload.fullName,
    })

    issueSessionCookie(response, user)
    response.status(201).json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: 'Invalid register payload', errors: error.flatten() })
      return
    }

    response.status(400).json({ message: (error as Error).message || 'Registration failed' })
  }
}

export async function loginHandler(request: Request, response: Response) {
  try {
    const payload = loginSchema.parse(request.body)
    const user = await login({
      emailOrUsername: payload.emailOrUsername,
      password: payload.password,
    })

    issueSessionCookie(response, user)
    response.status(200).json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: 'Invalid login payload', errors: error.flatten() })
      return
    }

    response.status(401).json({ message: (error as Error).message || 'Login failed' })
  }
}

export async function meHandler(request: Request, response: Response) {
  const subject = request.auth?.sub

  if (!subject) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  const user = await findUserById(subject)

  if (!user) {
    response.status(404).json({ message: 'User not found' })
    return
  }

  response.status(200).json({ user })
}

export async function updateProfileHandler(request: Request, response: Response) {
  const userId = request.auth?.sub

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const payload = updateProfileSchema.parse(request.body)
    const user = await updateProfile(userId, payload)
    response.status(200).json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: 'Invalid profile payload', errors: error.flatten() })
      return
    }

    response.status(400).json({ message: (error as Error).message || 'Profile update failed' })
  }
}

export async function forgotPasswordHandler(request: Request, response: Response) {
  try {
    const payload = forgotPasswordSchema.parse(request.body)
    const resetState = await requestPasswordReset(payload.emailOrUsername)

    if (resetState) {
      try {
        await sendResetPasswordEmail({
          to: resetState.email,
          token: resetState.resetToken,
          expiresAt: resetState.expiresAt,
        })
      } catch (emailError) {
        console.error('[auth] failed to send reset password email', emailError)
      }
    }

    response.status(200).json({
      message: 'If this account exists, a reset instruction has been issued.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: 'Invalid forgot password payload', errors: error.flatten() })
      return
    }

    response.status(400).json({ message: (error as Error).message || 'Forgot password failed' })
  }
}

export async function resetPasswordHandler(request: Request, response: Response) {
  try {
    const payload = resetPasswordSchema.parse(request.body)

    await resetPassword({
      token: payload.token,
      newPassword: payload.newPassword,
    })

    response.status(200).json({ message: 'Password has been reset successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: 'Invalid reset password payload', errors: error.flatten() })
      return
    }

    response.status(400).json({ message: (error as Error).message || 'Reset password failed' })
  }
}

export function logoutHandler(_request: Request, response: Response) {
  clearAuthCookie(response)
  response.status(200).json({ message: 'Logged out' })
}

export function googleSuccessHandler(request: Request, response: Response) {
  const user = request.user as AuthUserPayload | undefined

  if (!user) {
    response.redirect(302, `${env.frontendUrl}/oauth/callback?error=missing-user`)
    return
  }

  issueSessionCookie(response, user)
  response.redirect(302, `${env.frontendUrl}/oauth/callback`)
}

export function googleFailureHandler(_request: Request, response: Response) {
  response.redirect(302, `${env.frontendUrl}/oauth/callback?error=failed`)
}
