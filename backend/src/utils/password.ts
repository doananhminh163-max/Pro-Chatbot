import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export function hashPassword(rawPassword: string) {
  return bcrypt.hash(rawPassword, SALT_ROUNDS)
}

export function comparePassword(rawPassword: string, passwordHash: string) {
  return bcrypt.compare(rawPassword, passwordHash)
}

export function generateRandomPassword() {
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}
