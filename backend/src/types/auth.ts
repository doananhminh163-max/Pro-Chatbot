import type { Role } from '@prisma/client'

export interface AuthUserPayload {
  id: string
  email: string
  username: string | null
  fullName: string | null
  avatar: string | null
  phone?: string | null
  role: Role
}
