import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

export const authEndpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/reset-password',
  me: '/api/auth/me',
  profile: '/api/auth/profile',
  logout: '/api/auth/logout',
  googleAuth: `${apiBaseUrl}/api/auth/google`,
}

export const chatEndpoints = {
  config: '/api/chat/config',
  memory: '/api/chat/memory',
  clearGlobalMemory: '/api/chat/memory/global',
  sessions: '/api/chat/sessions',
  sessionMessages: (sessionId: string) => `/api/chat/sessions/${sessionId}/messages`,
  updateSession: (sessionId: string) => `/api/chat/sessions/${sessionId}`,
  deleteSession: (sessionId: string) => `/api/chat/sessions/${sessionId}`,
  sendMessage: '/api/chat/messages',
}

export const documentEndpoints = {
  list: '/api/documents',
  upload: '/api/documents/upload',
  download: (id: string) => `/api/documents/${id}/download`,
  preview: (id: string) => `/api/documents/${id}/preview`,
  delete: (id: string) => `/api/documents/${id}`,
}
