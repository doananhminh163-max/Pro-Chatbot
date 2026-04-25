import type { Role, User } from '@prisma/client'
import crypto from 'crypto'
import { prisma } from '../config/prisma.js'
import { comparePassword, generateRandomPassword, hashPassword } from '../utils/password.js'

interface RegisterInput {
  email: string
  password: string
  username?: string
  fullName?: string
}

interface LoginInput {
  emailOrUsername: string
  password: string
}

interface GoogleProfileInput {
  email: string
  fullName?: string
  avatar?: string
}

interface UpdateProfileInput {
  username?: string
  fullName?: string
  phone?: string
  avatar?: string
  aiTone?: string
  aiLanguage?: string
  aiResponseLength?: string
  customInstructions?: string
}

interface ResetPasswordInput {
  token: string
  newPassword: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function sanitizeOptional(value?: string) {
  if (!value) return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

function stripSensitiveFields(user: User) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    avatar: user.avatar,
    phone: user.phone,
    role: user.role as Role,
    personalization: {
      aiTone: user.aiTone,
      aiLanguage: user.aiLanguage,
      aiResponseLength: user.aiResponseLength,
      customInstructions: user.customInstructions,
    },
  }
}

function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function createResetToken() {
  return crypto.randomBytes(32).toString('hex')
}

export async function register(input: RegisterInput) {
  const email = normalizeEmail(input.email)
  const username = sanitizeOptional(input.username)

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, ...(username ? [{ username }] : [])],
    },
  })

  if (existingUser) {
    throw new Error('Email or username already exists')
  }

  const user = await prisma.user.create({
    data: {
      email,
      username,
      fullName: sanitizeOptional(input.fullName),
      passwordHash: await hashPassword(input.password),
    },
  })

  return stripSensitiveFields(user)
}

export async function login(input: LoginInput) {
  const account = input.emailOrUsername.trim()

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizeEmail(account) }, { username: account }],
    },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const passwordMatched = await comparePassword(input.password, user.passwordHash)

  if (!passwordMatched) {
    throw new Error('Invalid credentials')
  }

  return stripSensitiveFields(user)
}

export async function upsertGoogleUser(input: GoogleProfileInput) {
  const email = normalizeEmail(input.email)

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        fullName: sanitizeOptional(input.fullName) ?? existing.fullName,
        avatar: sanitizeOptional(input.avatar) ?? existing.avatar,
      },
    })

    return stripSensitiveFields(updated)
  }

  const usernameBase = email.split('@')[0] ?? 'user'
  const generatedUsername = `${usernameBase}-${Date.now().toString(36)}`

  const created = await prisma.user.create({
    data: {
      email,
      username: generatedUsername,
      fullName: sanitizeOptional(input.fullName),
      avatar: sanitizeOptional(input.avatar),
      passwordHash: await hashPassword(generateRandomPassword()),
    },
  })

  return stripSensitiveFields(created)
}

export async function findUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    return null
  }

  return stripSensitiveFields(user)
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const username = sanitizeOptional(input.username)

  if (username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        id: {
          not: userId,
        },
      },
    })

    if (existingUser) {
      throw new Error('Username is already taken')
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      fullName: sanitizeOptional(input.fullName),
      phone: sanitizeOptional(input.phone),
      avatar: sanitizeOptional(input.avatar),
      aiTone: input.aiTone,
      aiLanguage: input.aiLanguage,
      aiResponseLength: input.aiResponseLength,
      customInstructions: input.customInstructions,
    },
  })

  return stripSensitiveFields(updatedUser)
}

export async function requestPasswordReset(account: string) {
  const identifier = account.trim()
  const normalizedEmail = normalizeEmail(identifier)

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { username: identifier }],
    },
  })

  if (!user) {
    return null
  }

  const rawResetToken = createResetToken()
  const tokenHash = hashResetToken(rawResetToken)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: tokenHash,
      resetPasswordExpiresAt: expiresAt,
    },
  })

  return {
    email: user.email,
    resetToken: rawResetToken,
    expiresAt,
  }
}

export async function resetPassword(input: ResetPasswordInput) {
  const tokenHash = hashResetToken(input.token)

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: tokenHash,
      resetPasswordExpiresAt: {
        gt: new Date(),
      },
    },
  })

  if (!user) {
    throw new Error('Reset token is invalid or expired')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(input.newPassword),
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    },
  })
}
