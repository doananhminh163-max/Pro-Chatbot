import { http, authEndpoints } from './http'

export interface AuthUser {
  id: string
  email: string
  username: string | null
  fullName: string | null
  avatar: string | null
  phone?: string | null
  role: 'CLIENT' | 'ADMIN'
}

interface AuthResponse {
  user: AuthUser
}

interface ForgotPasswordResponse {
  message: string
}

interface MessageResponse {
  message: string
}

export async function loginWithPassword(payload: { emailOrUsername: string; password: string }) {
  const response = await http.post<AuthResponse>(authEndpoints.login, payload)
  return response.data.user
}

export async function registerWithPassword(payload: {
  username?: string
  email: string
  password: string
  fullName?: string
}) {
  const response = await http.post<AuthResponse>(authEndpoints.register, payload)
  return response.data.user
}

export async function fetchCurrentUser() {
  const response = await http.get<AuthResponse>(authEndpoints.me)
  return response.data.user
}

export async function updateProfile(payload: {
  username?: string
  fullName?: string
  phone?: string
  avatar?: string
}) {
  const response = await http.patch<AuthResponse>(authEndpoints.profile, payload)
  return response.data.user
}

export async function forgotPassword(payload: { emailOrUsername: string }) {
  const response = await http.post<ForgotPasswordResponse>(authEndpoints.forgotPassword, payload)
  return response.data
}

export async function resetPassword(payload: { token: string; newPassword: string }) {
  const response = await http.post<MessageResponse>(authEndpoints.resetPassword, payload)
  return response.data
}

export async function logout() {
  await http.post(authEndpoints.logout)
}

export function getGoogleOAuthUrl() {
  return authEndpoints.googleAuth
}
